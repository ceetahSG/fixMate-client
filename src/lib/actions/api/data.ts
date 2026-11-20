const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

export const getMyServices = async (technicianEmail: string) => {
  const response = await fetch(`${baseUrl}/services/${technicianEmail}`);
  return response.json();
};
