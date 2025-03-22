import { Outlet } from "react-router-dom";
import ApplicationBar from "./ApplicationBar";
import FooterComp from "./FooterComp";

function Layout() {
  return (
    <div className="max-w-[100vw] overflow-hidden font-albert z-10">
      <div className="w-full fixed top-0 left-0 z-40 bg-white mb-[1px]">
        <ApplicationBar />
      </div>
      <div className="min-h-screen relative mt-36 z-0">
        <Outlet />
      </div>
      <FooterComp />
    </div>
  );
}
export default Layout;
