import Navbar from "../components/shared/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar></Navbar>
      {children}
    </>
  );
};
export default RootLayout;
