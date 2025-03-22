import React, { useState } from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Drawer,
  Card,
} from "@material-tailwind/react";
import { ShoppingBagIcon, PowerIcon } from "@heroicons/react/24/solid";
import { BadgePercent, Stethoscope, TicketPercent } from "lucide-react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../../redux/Slices/authSlices";
import { IoIosBasket } from "react-icons/io";
import { SiGooglecloudcomposer } from "react-icons/si";

function SideBar() {
  const [open, setOpen] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    return navigate("/admin/glovista_login");
  };

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <div className="max-w-[100vw] h-16 bg-[#1da199]">
        <div className="flex justify-between items-center px-3">
          <Link
            to={"/admin/dashboard"}
            className="text-center text-lg font-semibold bg-white bg-clip-text text-transparent"
          >
            <img src="/glovista_logo.svg" alt="brand" className="w-40" />
          </Link>
          <IconButton
            className="mt-3"
            variant="text"
            size="lg"
            onClick={openDrawer}
          >
            {isDrawerOpen ? (
              <XMarkIcon className="h-8 w-8 stroke-2" />
            ) : (
              <Bars3Icon className="h-8 w-8 stroke-2" />
            )}
          </IconButton>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card
          color="transparent"
          shadow={false}
          className="max-h-[calc(100vh-2rem)] w-full p-4 overflow-auto"
        >
          <Link to={"/admin/dashboard"}>
            <div className="mb-2 flex items-end gap-4 p-4">
              <img src="/glovista_logo.svg" alt="brand" />
            </div>
          </Link>
          <List className="text-black">
            <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <Link to={"/admin/dashboard"}>
                <ListItem>
                  <ListItemPrefix>
                    <DashboardIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Dashboard
                </ListItem>
              </Link>

              <Link to={"/admin/category"}>
                <ListItem>
                  <ListItemPrefix>
                    <CategoryIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Category
                  </Typography>
                </ListItem>
              </Link>
            </Accordion>
            <Accordion
              open={open === 2}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 2 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 2}>
                <AccordionHeader
                  onClick={() => handleOpen(2)}
                  className="border-b-0 p-3 text-black"
                >
                  <ListItemPrefix>
                    <ShoppingBagIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Products
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <Link to={"/admin/orders"}>
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Orders
                    </ListItem>
                  </Link>
                  <Link to={"/admin/products"}>
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Product Management
                    </ListItem>
                  </Link>
                </List>
              </AccordionBody>
            </Accordion>
            <Link to={"/admin/kitsCompo"}>
              <ListItem>
                <ListItemPrefix>
                  <SiGooglecloudcomposer className="h-5 w-5" />
                </ListItemPrefix>
                Kits&Compo Management
              </ListItem>
            </Link>
            <Link to={"/admin/coupons"}>
              <ListItem>
                <ListItemPrefix>
                  <TicketPercent className="h-5 w-5" />
                </ListItemPrefix>
                Coupon Management
              </ListItem>
            </Link>
            <Link to={"/admin/offers"}>
              <ListItem>
                <ListItemPrefix>
                  <BadgePercent className="h-5 w-5" />
                </ListItemPrefix>
                Offer Management
              </ListItem>
            </Link>
            <Link to={"/admin/ingredients"}>
              <ListItem>
                <ListItemPrefix>
                  <IoIosBasket className="h-5 w-5" />
                </ListItemPrefix>
                Ingredients Management
              </ListItem>
            </Link>
            <Link to={"/admin/concerns"}>
              <ListItem>
                <ListItemPrefix>
                  <Stethoscope className="h-5 w-5" />
                </ListItemPrefix>
                Concerns Management
              </ListItem>
            </Link>
            <hr className="my-2 border-blue-gray-50" />
            <Link to={"/admin/userlist"}>
              <ListItem>
                <ListItemPrefix>
                  <PeopleIcon className="h-5 w-5" />
                </ListItemPrefix>
                Users
              </ListItem>
            </Link>
            <Link to={"/admin/enquiry"}>
              <ListItem>
                <ListItemPrefix>
                  <MenuIcon className="h-5 w-5" />
                </ListItemPrefix>
                Enquiry
              </ListItem>
            </Link>
            <Link to={"/admin/salesreport"}>
              <ListItem>
                <ListItemPrefix>
                  <AssessmentIcon className="h-5 w-5" />
                </ListItemPrefix>
                Sales Report
              </ListItem>
            </Link>
            <ListItem onClick={handleLogout}>
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </Drawer>
    </>
  );
}
export default SideBar;
