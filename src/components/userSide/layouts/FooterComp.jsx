import { Facebook, Instagram, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getConcerns } from "../../../services/adminApiService";
import { Pinterest } from "@mui/icons-material";

const quickLinks = [
  { text: "Home", path: "/" },
  { text: "Skin Test", path: "#" },
  { text: "Why Glovista", path: "/Why_us" },
];

const help = [
  { text: "Contact us", path: "/contact" },
  { text: "Skin Care blogs", path: "/blogs" },
  { text: "All Products", path: "/products" },
];

export default function Footer() {
  const [concerns, setConcerns] = useState([]);
  // const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (selectedItem) => {
    const queryParam = `?${encodeURIComponent("concerns")}=${encodeURIComponent(
      selectedItem
    )}`;

    navigate(`/products${queryParam}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [concernsRes, ingredientsRes] = await Promise.all([
          getConcerns(),
          // getIngredients(),
        ]);

        setConcerns(concernsRes || []);
        // setIngredients(ingredientsRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <footer className=" p-10">
      <div className=" p-10 mx-auto rounded-md bg-navBg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 mx-auto ">
            <img
              src="/glovista_logo.svg"
              alt="Dermatouch Logo"
              width={173}
              height={48}
              className="mb-6"
            />
          </div>

          <div>
            <h3 className="font-semibold text-base cursor-default mb-2 text-gray-700">
              Quick links
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(({ text, path }, i) => (
                <li key={i}>
                  <Link to={path} className="text-gray-600 hover:text-gray-900">
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base cursor-default mb-2 text-gray-700">
              Shop by Concern
            </h3>
            <ul className="space-y-2 text-sm">
              {concerns.map(({ concern_name }, i) => (
                <li key={i}>
                  <div
                    onClick={() => handleSelect(concern_name)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {concern_name}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base cursor-default mb-2 text-gray-700">
              Help
            </h3>
            <ul className="space-y-2 text-sm">
              {help.map(({ text, path }, i) => (
                <li key={i}>
                  <Link to={path} className="text-gray-600 hover:text-gray-900">
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <Link to="https://www.facebook.com/profile.php?id=61571959744157" className="text-gray-600 hover:text-gray-900">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link to="https://www.instagram.com/glovistacare/" className="text-gray-600 hover:text-gray-900">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link to="https://in.pinterest.com/glovistacare/" className="text-gray-600 hover:text-gray-900">
                <Pinterest className="h-6 w-6" />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-gray-900">
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <Link to="/privacy_policy" className="hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link to="/shipping_policy" className="hover:text-gray-900">
                Shipping Policy
              </Link>
              <Link to="/" className="hover:text-gray-900">
                Terms of Service
              </Link>
              <Link to="/return_policy" className="hover:text-gray-900">
                Return/Exchange
              </Link>
              <Link to="/" className="hover:text-gray-900">
                Track order
              </Link>
            </div>
          </div>
          <div className="mt-8 cursor-default border border-b-gray-300 border-t-gray-300  py-4 text-center text-sm text-gray-500">
            © 2025. All Rights Reserved by Glovista
          </div>
        </div>
      </div>
    </footer>
  );
}
