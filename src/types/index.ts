export type TUserRole = "Customer" | "Technician" | "Admin";

export type TUser = {
  name: string;
  email: string;
  role: TUserRole;
  img?: string;
};

export type TServiceData = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  isAvailable: boolean;
  createdAt: string;
};

export type tBookingData = {
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: "requested" | "in-progress" | "completed" | "cancelled";
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
};
