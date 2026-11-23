import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUsers } from "@/lib/actions/api/data";
import ManageUsersTable, { type UserRow } from "./ManageUsersTable";

export const metadata = {
  title: "Manage Users | FixMate",
};

type Role = "Customer" | "Technician" | "Admin";

type RawUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
};

function normalizeRole(value: unknown): Role {
  const role = String(value ?? "").trim().toLowerCase();

  if (role === "admin") return "Admin";
  if (role === "technician") return "Technician";

  return "Customer";
}

function formatJoined(value: unknown) {
  if (!value) return "—";

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function ManageUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const rawUsers = await getUsers().catch(() => []);
  const currentEmail = session?.user?.email ?? "";

  const users: UserRow[] = (Array.isArray(rawUsers) ? rawUsers : [])
    .filter((user: RawUser) => Boolean(user?._id ?? user?.id))
    .map((user: RawUser) => ({
      _id: String(user._id ?? user.id ?? ""),
      name: user.name || "Unnamed user",
      email: user.email || "—",
      role: normalizeRole(user.role),
      createdAt: formatJoined(user.createdAt),
      isCurrent: user.email === currentEmail,
    }));

  return <ManageUsersTable usersData={users} />;
}
