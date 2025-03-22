import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from "../../assets/Banners/banner1.jpg";
import banner2 from "../../assets/Banners/banner2.jpg";
import banner3 from "../../assets/Banners/banner3.jpg";
import banner4 from "../../assets/Banners/banner4.jpg";
import banner5 from "../../assets/Banners/banner5.jpg";
import banner6 from "../../assets/Banners/banner 6.jpg";
import banner7 from "../../assets/Banners/banner 7.jpg";
import banner8 from "../../assets/Banners/banner 8.jpg";
import banner9 from "../../assets/Banners/banner 9.jpg";
import Slider from "react-slick";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  adaptiveHeight: true,
  pauseOnHover: false,
};

function Banner() {
  const bannerImages = [
    { id: 1, src: banner1, alt: "Banner 1" },
    { id: 2, src: banner2, alt: "Banner 2" },
    { id: 3, src: banner3, alt: "Banner 3" },
    { id: 4, src: banner4, alt: "Banner 4" },
    { id: 5, src: banner5, alt: "Banner 5" },
    { id: 5, src: banner6, alt: "Banner 6" },
    { id: 5, src: banner7, alt: "Banner 7" },
    { id: 5, src: banner8, alt: "Banner 8" },
    { id: 5, src: banner9, alt: "Banner 9" },
  ];

  return (
    <div className="bg-white max-h-[70vh] cursor-pointer overflow-hidden">
      <div className="mx-auto px-4 ">
        <Slider {...settings}>
          {bannerImages.map((banner) => (
            <div
              key={banner.id}
              className="flex justify-center items-center md:object-none max-h-[70vh]"
            >
              <img
                src={banner.src}
                alt={banner.alt}
                className="w-full h-full xl:object-fill object-contain rounded-lg shadow-lg"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Banner;
