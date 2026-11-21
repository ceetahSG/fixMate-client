const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

export const getMyServices = async (technicianEmail: string) => {
  const response = await fetch(`${baseUrl}/services/${technicianEmail}`);
  return response.json();
};

export const getServices = async () => {
  const response = await fetch(`${baseUrl}/services`);
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${baseUrl}/users`);
  return response.json();
};
