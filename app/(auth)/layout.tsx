import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth",
  description: "Accede a tu cuenta de AdPulse Intelligence.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center p-6"
      style={{ background: "#0d0f14" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
            AP
          </div>
          <p className="text-sm" style={{ color: "#5a5c66" }}>AdPulse Intelligence</p>
        </div>
        {children}
      </div>
    </div>
  );
}
