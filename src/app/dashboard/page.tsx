import { auth } from "@/auth";
import DashboardPageClient from "@/components/dashboard/dashboard-page";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  return (
    <DashboardPageClient
      currentUser={{
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
    />
  );
}
