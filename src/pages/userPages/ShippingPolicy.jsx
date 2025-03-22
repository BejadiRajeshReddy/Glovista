import React from "react";
import { Link } from "react-router-dom";

const ShippingPolicy = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>
          <span>/</span> &#160; Shipping Policy
        </nav>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          Glovista Shipping Policy
        </h1>
        <h2 className="text-base font-bold mb-3 sm:mb-4">
          How Does the Delivery Process Work?
        </h2>

        <p className="text-sm  text-black leading-relaxed mb-4">
          At <b>Govista</b>, we ensure your products undergo a thorough quality
          check before being shipped. Once your order is processed, each product
          is inspected to ensure it meets our high-quality standards. After
          passing the final round of checks, your items are carefully packaged
          and handed over to our trusted delivery partners. Our delivery
          partners aim to bring your package to you as quickly as possible. If
          they are unable to reach your provided address or deliver at the
          designated time, they will contact you to resolve the issue promptly.
        </p>

        <h2 className="text-base font-bold mb-3 sm:mb-4">
          How Are Items Packaged?
        </h2>
        <p className="text-base text-black leading-relaxed mb-4">
          We believe in delivering not just skincare but a premium experience.
          Your Dermatouch products are securely packaged in durable and elegant
          boxes to ensure they arrive in perfect condition. For added
          protection, each premium box is carefully placed in a sturdy
          corrugated box, minimizing the risk of damage during transit. Our
          state-of-the-art packaging reflects our commitment to delivering
          excellence at every step.
        </p>
        <h2 className="text-base font-bold mb-3 sm:mb-4">
          Where Does Glovista Ship?
        </h2>
        <p className="text-base text-black leading-relaxed mb-4">
          Dermatouch ships across <b>India</b>, bringing our science-backed
          skincare solutions to your doorstep!
        </p>

        <h2 className="text-base font-bold mb-3 sm:mb-4">
          What is the Estimated Delivery Time?
        </h2>

        <p className="text-base text-black leading-relaxed mb-4">
          Our estimated delivery time is <b>2–6 business days</b> from the date
          of order placement (excluding Sundays and public holidays). While we
          strive to meet these timelines, delays may occur due to external
          factors such as natural calamities, strikes, or logistical issues.
          During high-demand sale events, dispatches might experience slight
          delays due to increased volumes. In such cases, delivery may take an
          additional 2–3 business days beyond our usual timelines.
        </p>

        <h2 className="text-base font-bold mb-3 sm:mb-4">
          How Can I Track My Order?
        </h2>
        <p className="text-base text-black leading-relaxed mb-4">
          We send an SMS/E-mail with the tracking details once the order is
          processed for shipping. You can also visit the Track My Order section
          on our website and check the details with your order number.
        </p>

        <h2 className="text-base font-bold mb-3 sm:mb-4">
          What Happens If My Order is Shipped in Multiple Shipments?
        </h2>
        <p className="text-base text-black leading-relaxed mb-4">
          If your order is delivered in multiple shipments, there’s no need to
          worry. This simply means that different parts of your order are being
          shipped from separate warehouse locations to ensure faster delivery.
        </p>

        <h2 className="text-base font-bold mb-3 sm:mb-4">
          Are There Any Shipping Charges?
        </h2>
        <p className="text-base text-black leading-relaxed mb-4">
          If after you opt-in, you may withdraw your consent from further
          contact at any time. This can be achieved by unsubscribing to our
          emails or by contacting our customer support team.
        </p>

        <h2 className="text-base font-bold mb-3 sm:mb-4">
          Are There Any Shipping Charges?
        </h2>
        <p className="text-base text-black leading-relaxed mb-4">
          We offer <b>free shipping</b> on all orders placed on our website.
        </p>
      </div>
    </>
  );
};

export default ShippingPolicy;
