import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

function Layout() {
  return (
    <div className="max-w-[100vw] overflow-hidden">
      <SideBar />
      <div className="p-10">
        <Outlet />
      </div>
    </div>
  );
}
export default Layout;
