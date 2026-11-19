export type TUserRole = "Customer" | "Technician" | "Admin";

export type TUser = {
  name: string;
  email: string;
  role: TUserRole;
  img?: string;
};

