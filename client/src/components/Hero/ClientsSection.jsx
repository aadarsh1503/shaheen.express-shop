import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./Slide.css";
import i1 from "./images/i1.png";
import i2 from "./images/i2.png";
import i3 from "./images/i3.png";

import i5 from "./images/i5.png";
import i6 from "./images/i6.png";
import i7 from "./images/i7.png";
import i8 from "./images/i8.png";
import i9 from "./images/i9.png";
import i10 from "./images/i10.png";

const ClientsSection = () => {
    const images = [i1, i2, i3, i5, i6 ,i7,i8,i9,i10];
    const imageLinks = [
        
    ];

    const [isLoaded, setIsLoaded] = useState(false);
    const sliderRef = useRef(null);

    const preloadImages = (images) => {
        let loadedImages = 0;
        const totalImages = images.length;

        images.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedImages += 1;
                if (loadedImages === totalImages) {
                    setIsLoaded(true);
                }
            };
        });
    };

    useEffect(() => {
        preloadImages(images);
    }, [images]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2100,
        cssEase: "linear",
        pauseOnHover: false,
        beforeChange: (current, next) => {
            if (sliderRef.current) {
                sliderRef.current.slickGoTo(next);
            }
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 360,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <section id='clients' className="py-10 lg:max-w-7xl lg:w-full w-[200px] mx-auto">
           <h2 className="text-center text-sm text-dgreen font-bold tracking-wide uppercase">
        Clients
      </h2>
      <p className="text-center  text-black text-2xl mb-16 font-semibold my-4">
        We’re Happy to Grow Together
      </p>
        <div className="">
            {isLoaded ? (
                <Slider ref={sliderRef} {...settings}>
                    {images.map((src, index) => (
                        <div key={index} className="slide-item">
                            <a href={imageLinks[index]} target="_blank" rel="noopener noreferrer" className="image-link">
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="object-contain w-full md:w-3/4 mx-auto slide-image"
                                    style={{ maxHeight: '300px' }}
                                />
                            </a>
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <span>Loading...</span>
                </div>
            )}
        </div>
    </section>
    

    );
};

export default ClientsSection;
