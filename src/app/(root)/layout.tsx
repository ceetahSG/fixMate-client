import { Suspense } from "react";
import Navbar from "../components/shared/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense
        fallback={
          <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-100 bg-white" />
        }
      >
        <Navbar />
      </Suspense>
      {children}
    </>
  );
};
export default RootLayout;
