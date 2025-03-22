import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  ChevronDownIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../../../redux/Slices/authSlices";
import cart from "../../../assets/icons/cart.png";
import user from "../../../assets/icons/user.png";

function NavList() {
 
  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-medium text-2xl"
      >
        <Link to="/#best-seller-section">Skin care</Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-medium text-2xl"
      >
        <a href="#" className="flex items-center hover:text-white/75">
          Body Care
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-medium text-2xl"
      >
        <a href="#" className="flex items-center hover:text-white/75">
          Lip Care
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-medium text-2xl"
      >
        <a href="#" className="flex items-center hover:text-white/75">
          About Us
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-medium text-2xl"
      >
        <Link to="/wishlist">Contact</Link>
      </Typography>
    </ul>
  );
}

export function NavbarComp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(resetState());
    navigate("/login");
  };

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full px-6 py-3 mt-3 bg-[#1da199] rounded-t-3xl">
        <div className="flex items-center justify-between text-white">
          <Typography className="mr-4 cursor-pointer py-1.5 font-sans text-3xl font-bold">
            <Link to="/">Glovista</Link>
          </Typography>
          <div className="hidden lg:block">
            <NavList />
          </div>
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Icon */}
            <div className="relative">
              <IconButton
                variant="text"
                color="white"
                className="p-2"
                onClick={() => setShowSearch(!showSearch)}
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </IconButton>
              {showSearch && (
                <div
                  className={`absolute top-0 right-0 transform transition-transform duration-300 ${
                    showSearch ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 h-10 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-300"
                    onClick={() => setShowSearch(false)}
                  >
                    ✖
                  </button>
                </div>
              )}
            </div>
            <IconButton variant="text" color="white">
              <Link to="/cart">
                <img src={cart} alt="" className="w-10 h-10" />
              </Link>
            </IconButton>
            <Typography>
              {isLoggedIn ? (
                <>
                  <img
                    src={user}
                    alt="User"
                    onClick={handleMenuOpen}
                    className="cursor-pointer"
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => navigate("/user_profile")}>
                      User Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Link to="/login">
                  <img src={user} alt="Login" className="w-10 h- 10" />
                </Link>
              )}
            </Typography>
          </div>
          <IconButton
            variant="text"
            color="white"
            className="ml-auto h-6 w-6 text-inherit lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          <NavList />
        </Collapse>
      </div>
    </div>
  );
}
