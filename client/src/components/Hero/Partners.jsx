import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./Slide.css";
import a1 from "./PartnersImages/a1.png";
import a2 from "./PartnersImages/a2.png";
import a4 from "./PartnersImages/a4.png";
import a3 from "./PartnersImages/a6.png";
import a5 from "./PartnersImages/a7.png";

const ClientsSection = () => {
    const images = [a1, a2, a3, a4, a5];
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
        slidesToShow: 5,
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
        <section id='partners' className="py-10 lg:max-w-7xl lg:w-full w-[200px] mx-auto">
            <h2 className='text-white text-5xl  mb-4'>hii</h2>
            <h2 className='text-white text-5xl  mb-4'>hii</h2>
    
<h2 className="text-center text-sm text-dgreen font-bold tracking-wide uppercase">
Partners
</h2>
<p className="text-center text-black text-2xl font-semibold mb-8 my-4">
We Work With The Best
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






