import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient({ useServiceRole: true });

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
        const status = subscription.status;

        const subscriptionStatus =
          status === "active"
            ? "active"
            : status === "trialing"
            ? "trialing"
            : status === "past_due"
            ? "past_due"
            : status === "canceled"
            ? "canceled"
            : "inactive";

        const periodEnd = (subscription as any).current_period_end
          ? new Date((subscription as any).current_period_end * 1000).toISOString()
          : null;

        await supabase
          .from("profiles")
          .update({
            subscription_status: subscriptionStatus,
            subscription_provider: "stripe",
            subscription_customer_id: customerId,
            subscription_period_end: periodEnd,
          })
          .eq("subscription_customer_id", customerId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "canceled",
            subscription_period_end: null,
          })
          .eq("subscription_customer_id", customerId);

        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        const customerEmail = session.customer_details?.email;

        if (customerId && customerEmail) {
          await supabase
            .from("profiles")
            .update({
              subscription_customer_id: customerId,
              subscription_status: "active",
              subscription_provider: "stripe",
            })
            .eq("email", customerEmail);
        }

        break;
      }

      default:
        break;
    }

    await supabase.from("audit_logs").insert({
      action: `stripe.${event.type}`,
      entity_type: "stripe_event",
      entity_id: event.id,
      metadata: { type: event.type },
    });
  } catch (err: any) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ received: true, error: err.message });
  }

  return NextResponse.json({ received: true });
}
