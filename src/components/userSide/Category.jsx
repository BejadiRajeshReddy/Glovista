import React, { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Typography } from "@mui/material";
import { getCategory } from "../../services/userApiServices";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

function Category() {
  const [categoryData, setCategoryData] = useState([]);

  const navigate = useNavigate();

  const handleSelect = (selectedItem) => {
    const queryParam = `?category=${encodeURIComponent(selectedItem)}`;
    navigate(`/products${queryParam}`);
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await getCategory();

        setCategoryData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("An error occurred fetching data", error);
      }
    };
    fetchCategoryData();
  }, []);

  return (
    <div className="w-full mb-5">
      <h1 className="text-center text-[#1da199] text-2xl mt-3 pb-5">
        Categories
      </h1>
      {categoryData.length > 0 ? (
        <div className=" px-10 gap-10">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={5}
            spaceBetween={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1 },
              425: { slidesPerView: 2 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full max-w-6xl mx-auto"
          >
            {categoryData.map((category, index) => (
              <SwiperSlide key={category.id}>
                <div
                  onClick={() => handleSelect(category.category_name)}
                  key={index}
                  className="flex-col pl-10 mx-auto text-center gap-2 mb-10"
                >
                  <div className="cursor-pointer rounded-full justify-center w-fit object-contain border-[1px] border-black">
                    <img
                      src={category.category_image}
                      alt="image_banner"
                      className="w-40 h-40 rounded-full"
                    />
                  </div>
                  <h4 className="text-center text-[#1da199] mr-10 mt-0 group cursor-pointer">
                    {category.category_name}
                    <p className="text-[#278e60] ml-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowForwardIcon />
                    </p>
                  </h4>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <Typography
          variant="h5"
          className="flex justify-center text-center text-4xl text-red-500"
        >
          Categories Not Found
        </Typography>
      )}
    </div>
  );
}

export default Category;
