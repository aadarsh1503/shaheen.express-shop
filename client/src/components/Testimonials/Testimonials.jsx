import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

import i1 from "./i1.avif";
import i100jpg from "./i100jpg.jpg";
import i101 from "./i101.jpg";
import i102 from "./i102.jpg";

const Testimonials = () => {
  const testimonials = [
    { id: 1, name: "Sarah T.", designation:"Operations Manager, Global E-Commerce Brand", text: "Partnering with Shaheen Express has been a game-changer for our international operations. Their seamless integration of real-time tracking, fast delivery times, and reliable customer service has significantly boosted our customer satisfaction.", image: i1 },
    { id: 2, name: "John M.", designation:"Supply Chain Director, Leading Manufacturing Co.", text: "As a global manufacturer, timely and cost-effective delivery is critical. We've worked with Shaheen Express for over three years, and they’ve consistently exceeded our expectations, from handling complex customs processes to managing time-sensitive shipments.", image: i100jpg },
    { id: 3, name: "Lisa D.", designation:"Logistics Coordinator, Nationwide Retail Chain", text: "Shaheen Express has completely transformed our distribution network. Their team took the time to understand our business and implemented a tailored logistics solution that maximized efficiency and reduced our costs.", image: i102 },
    { id: 4, name: "Michael G.", designation:"Regional Logistics Manager, Int'l Freight Co.", text: "Our e-commerce platform relies on precise and dependable logistics, and Shaheen Express has consistently delivered. Their ability to handle large-scale shipments with accuracy and care has helped us maintain our reputation for timely deliveries.", image: i101 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const getCardIndices = () => {
    const total = testimonials.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;
    return [prevIndex, currentIndex, nextIndex];
  };

  const visibleIndices = getCardIndices();

  return (
    <div className="bg-slate-50/50 w-full py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
      <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
        >
          <h2 className="font-bold text-[#EC2027] text-base tracking-widest uppercase">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
            What Our Happy Clients Say
          </p>
        </motion.div>

        <div className="relative h-[450px] md:h-[400px] flex items-center justify-center">
          <button
            onClick={handlePrev}
            className="absolute left-0 md:left-4 xl:left-[350px] top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition"
          >
            <BsChevronLeft className="text-[#EC2027]" size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 md:right-4 xl:right-[350px] top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition"
          >
            <BsChevronRight className="text-[#EC2027]" size={24} />
          </button>

          <div className="relative w-full h-full [perspective:1000px]">
            {testimonials.map((testimonial, index) => {
              const visibleIndex = visibleIndices.indexOf(index);
              
              let positionStyle = {};
              let zIndex = 0;
              let opacity = 0;
              let scale = 0.8;
              let isClickable = false;

              if (visibleIndex !== -1) {
                opacity = 1;
                if (visibleIndex === 1) { // Center card
                  zIndex = 10;
                  scale = 1;
                  positionStyle = { transform: "translateX(0) translateZ(0) rotateY(0)" };
                } 
                else if (visibleIndex === 0) { // Left card
                  zIndex = 5;
                  // ✨ FIX: Values changed to bring card closer
                  positionStyle = { transform: "translateX(-40%) translateZ(-150px) rotateY(45deg)" };
                  isClickable = true;
                } 
                else if (visibleIndex === 2) { // Right card
                  zIndex = 5;
                  // ✨ FIX: Values changed to bring card closer
                  positionStyle = { transform: "translateX(40%) translateZ(-150px) rotateY(-45deg)" };
                  isClickable = true;
                }
              } else {
                positionStyle = { transform: `translateX(0) translateZ(-500px) rotateY(0)` };
              }

              return (
                <div
                  key={testimonial.id}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    ...positionStyle,
                    zIndex: zIndex,
                  }}
                  onClick={() => {
                    if (isClickable) setCurrentIndex(index);
                  }}
                >
                  <div
                    className={`
                      w-11/12 md:w-3/4 lg:w-[450px] min-h-[320px] 
                      bg-white/60 backdrop-blur-xl rounded-2xl 
                      shadow-2xl shadow-cyan-500/20 border border-gray-200/50 
                      p-6 text-center flex flex-col items-center justify-center 
                      transition-all duration-500
                      ${isClickable ? 'cursor-pointer' : ''}
                    `}
                    style={{
                      opacity: opacity,
                      transform: `scale(${scale})`,
                    }}
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-24 h-24 mb-4 object-cover bg-white p-1 rounded-full ring-4 ring-[#EC2027]"
                    />
                    <p className="text-base text-slate-600 leading-relaxed line-clamp-4">
                      "{testimonial.text}"
                    </p>
                    <p className="mt-6 text-lg font-bold text-slate-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm font-medium text-[#000000]">
                      {testimonial.designation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;