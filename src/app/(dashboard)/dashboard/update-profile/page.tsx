import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import UpdateProfileForm from "@/app/components/dashboard/UpdateProfileForm";

export const metadata = {
  title: "Update Profile | FixMate",
};

export default async function UpdateProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role =
    user && "role" in user ? String(user.role ?? "Customer") : "Customer";
  const displayRole =
    role.toLowerCase() === "admin"
      ? "Admin"
      : role.toLowerCase() === "technician"
        ? "Technician"
        : "Customer";

  return (
    <UpdateProfileForm
      initialName={user?.name ?? ""}
      initialEmail={user?.email ?? ""}
      initialRole={displayRole}
      initialPhone=""
      initialArea=""
      initialBio=""
      initialImage={null}
    />
  );
}
