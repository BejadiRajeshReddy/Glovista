import { useState, useEffect } from "react";
import { Typography, IconButton, Collapse } from "@material-tailwind/react";
import Logo from "../../../assets/Logo/glovista_logo.png";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Slider1 from "../sliders/Slider1";
import NavList from "./NavList";
import { logoutSuccess } from "../../../redux/Slices/authSlices";

function ApplicationBar() {
  const [openNav, setOpenNav] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParam = `?search=${encodeURIComponent(search)}`;
    setSearch("");
    navigate(`/products${queryParam}`);
  };

  const handleNavigation = () => {
    setShowDropdown(false);
    navigate("/user_profile");
  };

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Slider1 />

      <div className=" 2xl:px-10 xl:px-4">
        <div className="flex items-center border border-blue-gray-50 rounded-lg justify-between h-24 text-black">
          <div className="lg:w-1/5 w-40 flex justify-center items-center h-24 border-b rounded-lg  bg-navBg">
            <Link
              className="w-full xl:w-80 flex justify-center xl:px-0"
              to={"/"}
            >
              <img className="xl:w-[70%]" src={Logo} alt="glovista" />
            </Link>
          </div>
          <div className="hidden h-full w-full xl:flex items-center bg-navBg justify-between ">
            <NavList />
          </div>
          <div className=" px-5 md:pl-0 w-full xl:w-fit flex justify-end gap-2 lg:gap-4 items-center h-full bg-navBg">
            <div className="relative flex w-full md:w-2/5 xl:w-60 2xl:w-64 gap-2  items-center">
              <MagnifyingGlassIcon
                onClick={handleSearch}
                height={24}
                width={24}
                color="#0cb098"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="search"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What are you looking for ?"
                className=" border font-albert w-full border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-500  sm:placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
              />
            </div>

            <div className="flex items-center gap-4 relative">
              {isLoggedIn && !userInfo.is_superuser ? (
                <>
                  <IconButton
                    variant="text"
                    color="black"
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    <UserIcon width={24} />
                  </IconButton>
                  {showDropdown && (
                    <div className="absolute text-sm w-40 top-12 right-0 bg-white text-black shadow-lg rounded-md">
                      <ul className="p-2">
                        <div onClick={handleNavigation}>
                          <li className="p-2 hover:bg-[#c9f0e6] cursor-pointer">
                            User Profile
                          </li>
                        </div>
                        <li
                          className="p-2 hover:bg-[#c9f0e6] cursor-pointer"
                          onClick={handleLogout}
                        >
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <IconButton variant="text" color="black">
                    <Typography
                      variant="small"
                      color="black"
                      className="cursor-pointer font-medium text-xl"
                    >
                      <UserIcon width={24} />
                    </Typography>
                  </IconButton>
                </Link>
              )}
              <Link to={"/cart"}>
                <IconButton variant="text" color="black">
                  <ShoppingBagIcon width={24} />
                </IconButton>
              </Link>
            </div>
            <IconButton
              variant="text"
              color="black"
              className="text-inherit xl:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              <div className="relative h-6 px-3 w-6 transition-transform duration-300 ease-in-out">
                {openNav ? (
                  <XMarkIcon className="absolute inset-0 h-6 w-6 transform scale-100 transition-transform duration-300 ease-in-out" />
                ) : (
                  <Bars3Icon className="absolute  inset-0 h-6 w-6 transform scale-100 transition-transform duration-300 ease-in-out" />
                )}
              </div>
            </IconButton>
          </div>{" "}
        </div>
      </div>

      <Collapse open={openNav} className="xl:hidden">
        <div className="flex flex-col items-start xl:items-center gap-4">
          <NavList />
        </div>
      </Collapse>
    </div>
  );
}

export default ApplicationBar;
