import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";

const testimonials = [
  {
    id: 1,
    name: "Madhuri Amol",
    rating: 4.5,
    product: "Salicylic Acid 2% Sebustop 2% Face Serum",
    review:
      "I purchased this face serum for my acne prone skin. It is highly effective and helps to remove acne-causing bacteria, slough dead skin cells, and fade dark spots or marks. It's an effective product and gives satisfactory results.",
    image: "/model2.jpeg",
  },
  {
    id: 2,
    name: "Nisha Zohra",
    rating: 4.5,
    product: "Very soft on skin",
    review:
      "Daily Glow Bright & Even Skin Tone Face Wash creates a rich foam and has a pleasant scent. It effectively cleanses dirt and oil, leaving my skin refreshed and clean. I incorporate it into my daily skincare routine.",
    image: "/model3.jpeg",
  },
  {
    id: 3,
    name: "Neelima Jain",
    rating: 4.7,
    product: "Even skin tone",
    review:
      "Just loved this Bye Bye Nigricans Cream as it’s non-oily and non-greasy. I used this product for my knee and elbow, and it worked really well. The product absorbs quickly, and the fragrance is mild. It needs consistent use for best results.",
    image: "/mode4.jpeg",
  },
  {
    id: 4,
    name: "Neelima Jain",
    rating: 4.7,
    product: "Even skin tone",
    review:
      "Just loved this Bye Bye Nigricans Cream as it’s non-oily and non-greasy. I used this product for my knee and elbow, and it worked really well. The product absorbs quickly, and the fragrance is mild. It needs consistent use for best results.",
    image: "/model2.jpeg ",
  },
  {
    id: 5,
    name: "Neelima Jain",
    rating: 4.7,
    product: "Even skin tone",
    review:
      "Just loved this Bye Bye Nigricans Cream as it’s non-oily and non-greasy. I used this product for my knee and elbow, and it worked really well. The product absorbs quickly, and the fragrance is mild. It needs consistent use for best results.",
    image: "/model3.jpeg ",
  },
  {
    id: 6,
    name: "Neelima Jain",
    rating: 4.7,
    product: "Even skin tone",
    review:
      "Just loved this Bye Bye Nigricans Cream as it’s non-oily and non-greasy. I used this product for my knee and elbow, and it worked really well. The product absorbs quickly, and the fragrance is mild. It needs consistent use for best results.",
    image: "/mode4.jpeg ",
  },
];

const Testimonials = () => {
  return (
    <div className="py-12 bg-white">
      <h2 className="text-3xl font-semibold text-center">
        Our <span className="font-bold">Customer's Skin</span> Care Journeys
      </h2>
      <div className="mt-8 px-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full max-w-5xl mx-auto"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="border cursor-default border-gray-200 rounded-2xl shadow-lg mb-14 text-center bg-white">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-yellow-500 text-sm my-1">
                    <FaStar />
                    {testimonial.rating}
                    <BsCheckCircleFill className="text-blue-500 ml-1" />
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    {testimonial.product}
                  </h4>
                  <p className="text-gray-600 text-sm mt-2">
                    {testimonial.review}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;
