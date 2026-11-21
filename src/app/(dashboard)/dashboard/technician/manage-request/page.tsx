import { headers } from "next/headers";
import ManageRequestsBoard, {
  type TechnicianRequest,
} from "@/app/components/technician/ManageRequestsBoard";
import { getBookingByTechnicianEmail } from "@/lib/actions/api/data";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Repair Requests | FixMate",
  description:
    "Review incoming repair requests and keep every job status current.",
};

const ManageRequestPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  const rawRequests = email
    ? await getBookingByTechnicianEmail(email).catch(() => [])
    : [];

  const requests: TechnicianRequest[] = Array.isArray(rawRequests)
    ? rawRequests
    : [];

  return <ManageRequestsBoard requests={requests} />;
};

export default ManageRequestPage;
