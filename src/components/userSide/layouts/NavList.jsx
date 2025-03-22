import { Typography } from "@material-tailwind/react";
// import React from "react";
import NavListMenu from "./NavListMenu";
import { Link } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";

const navItems = [
  { title: "Care Kits", route: "/kits-combo" },
  { title: "Best Sellers", route: "/products"},
  // { title: "Skin Test", route: "/skin-test" },
  { title: "Glopedia", route: "/why_us" },
  { title: "Connect", route: "/contact" },
];

const NavList = () => (
  <ul className="flex flex-col w-full h-full font-albert font-light xl:flex-row xl:items-center xl:gap-4 xl:border-0 border-b border-gray-500">
    <NavListMenu />
    {navItems.map((item, index) => (
      <Link
        to={item.route}
        key={index}
        className="w-full px-3 py-2 xl:w-auto flex justify-between items-center hover:bg-gray-200"
      >
        <div className="flex items-center gap-2">
          <Typography
            color="black"
            className="font-medium text-sm font-albert whitespace-nowrap"
          >
            {item.title}
          </Typography>
        </div>
        <div className="block xl:hidden">
          <ChevronRight className="text-gray-600" width={14} height={14} />
        </div>
      </Link>
    ))}
  </ul>
);

export default NavList;
