import {
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategory } from "../../../services/userApiServices";
import { getConcerns, getIngredients } from "../../../services/adminApiService";

function NavListMenu() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleSelect = (selectedCategory, selectedItem) => {
    const queryParam =
      selectedItem === "All"
        ? "all"
        : `?${encodeURIComponent(
            selectedCategory === "products" ? "category" : selectedCategory
          )}=${
            selectedCategory === "ingredients"
              ? encodeURIComponent(selectedItem.title)
              : encodeURIComponent(selectedItem.title)
          }`;

    navigate(`/products${queryParam}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, concernsRes, ingredientsRes] = await Promise.all([
          getCategory(),
          getConcerns(),
          getIngredients(),
        ]);

        setAllCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
        setConcerns(concernsRes || []);
        setIngredients(ingredientsRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setMenuItems([
      {
        category: "products",
        items: [
          { title: "All" },
          ...allCategories.map((category) => ({
            title: category.category_name,
            id: category.id,
          })),
        ],
      },
      {
        category: "concerns",
        items: concerns.map((concern) => ({
          title: concern.concern_name,
          id: concern.id,
        })),
      },
      {
        category: "ingredients",
        items: ingredients.map((ingredient) => ({
          title: ingredient.ingredient_name,
          id: ingredient.id,
        })),
      },
    ]);
  }, [allCategories, concerns, ingredients]);

  return (
    <div className="relative inline-block text-left">
      <div className="flex xl:hidden items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-200 font-medium text-base">
        <div>Shop</div>
        {isCategoriesOpen ? (
          <MinusIcon
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-5 h-5 text-gray-900"
          />
        ) : (
          <PlusIcon
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-5 h-5 text-gray-900"
          />
        )}
      </div>

      {isCategoriesOpen && (
        <div className="xl:hidden bg-white shadow-md ring-1 ring-gray-300 rounded-md">
          {menuItems.map(({ category, items }, index) => (
            <div key={index} className="border-b last:border-none">
              <div
                onClick={() => toggleCategory(index)}
                className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <span className="text-sm font-bold text-gray-900 uppercase">
                  {category}
                </span>
                {expandedCategory === index ? (
                  <MinusIcon className="w-5 h-5 text-gray-900" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-gray-900" />
                )}
              </div>
              {expandedCategory === index && (
                <ul className="pl-6 pr-4 py-2 space-y-1">
                  {items.map((item, idx) => (
                    <li key={idx}>
                      <div
                        onClick={() => handleSelect(category, item)}
                        className="block text-sm text-gray-700 hover:text-gray-900"
                      >
                        {item.title}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="hidden xl:block relative px-3 py-2 cursor-pointer hover:bg-gray-200"
      >
        <div className="font-medium flex text-sm font-albert whitespace-nowrap">
          Shop
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </div>
        <div
          className={`absolute z-20 left-0 w-[50vw] max-h-[65vh] pb-10 overflow-y-auto xl:mt-2 flex py-5 bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-sm transform transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          {menuItems.map(({ category, items }, index) => (
            <div key={index} className="p-4">
              <h3 className="mb-2 text-sm font-bold text-gray-900 uppercase">
                {category}
              </h3>
              <ul className="space-y-1">
                {items.map((item, idx) => (
                  <li key={idx}>
                    <div
                      onClick={() => handleSelect(category, item)}
                      className="block py-1 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {item.title}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavListMenu;
