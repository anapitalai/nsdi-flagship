import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Avatar } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/profile");
  }

  const displayName = session.user.name ?? "Signed in user";
  const email = session.user.email ?? "No email provided";

  return (
    <AuthShell
      badge="Account"
      title="Your NSDI profile."
      description="Review the account details tied to your signed-in session and manage sign-out from here or the sidebar menu."
      points={[
        "Avatar fallback uses initials when no image is available",
        "Profile access is protected server-side",
        "Sign out stays available from the sidebar and here",
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/20 p-4">
          <Avatar
            name={displayName}
            imageUrl={session.user.image}
            sizeClassName="size-16"
          />
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold">{displayName}</p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Session user id
            </p>
            <p className="mt-1 text-sm">{session.user.id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Email
            </p>
            <p className="mt-1 text-sm">{email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
          <SignOutButton callbackUrl="/sign-in" />
        </div>
      </div>
    </AuthShell>
  );
}
