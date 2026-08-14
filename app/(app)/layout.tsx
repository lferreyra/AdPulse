import { redirect } from "next/navigation";
import { createServerSupabaseClient, getServerProfile } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getServerProfile();

  return (
    <div className="app-layout flex h-svh overflow-hidden" style={{ background: "#0d0f14" }}>
      <Sidebar
        isOwner={profile?.role === "owner"}
        userEmail={profile?.email ?? user.email}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
