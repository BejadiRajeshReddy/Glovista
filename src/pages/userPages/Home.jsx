import React from "react";
import Banner from "../../components/userSide/Banner";
import Category from "../../components/userSide/Category";
import Slider2 from "../../components/userSide/sliders/Slider2";
import BestSeller from "../../components/userSide/BestSeller";
import Testimonials from "../../components/userSide/Testimonials";

function Home() {
  return (
    <>
      <Banner />
      <Slider2 />
      <Category />
      <div id="best-seller-section">
        <BestSeller />
      </div>
      <Testimonials />
    </>
  );
}
export default Home;
