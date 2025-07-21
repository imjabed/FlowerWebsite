import Navbar from './Navbar'
import Footer from './Footer'
import './HomeRes.css' //Responsive css

import { useState,useEffect } from "react";
import axios from 'axios';

// Animations 
import useLenis from './useLenis'

import GenderToggle from "./GenderToggle"; 
import CustomizeForm from './CustomizeForm';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules'; // If you want dots

function Home(){
    const deployedurl = import.meta.env.VITE_BACKEND_URL;
    const localurl='http://localhost:5678';

    useLenis(); 
    const [gender, setGender] = useState("her");
    const [products, setProducts] = useState([]);

    useEffect(() => {
      const token = localStorage.getItem("token");

      axios.get(`${deployedurl}/api/products/show`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setProducts(res.data);
        console.log("Fetched Products:", res.data);
      })
      .catch(err => console.error("Error fetching products:", err));
    }, []);

    return(
        <>
          <Navbar/>
          <div className="w-full px-0 py-0 m-0 md:h-[600px] px-4 text-center text-left banner" style={{ backgroundColor: gender === 'her' ? '#ffe6f0' : '#d0e8ff' }}>
              <GenderToggle onToggle={(selected) => setGender(selected)} />
              <div className='flex flex-col items-center justify-center gap-0 md:flex-row  gap-8'>
                  <div className="max-w-md mt-6 md:mt-0 flex flex-col justify-center items-center">
                      <h3 className={`text-[60px] leading-18 text-center md:text-[80px] font mb-4 ${gender === 'her' ? "text-pink-500" : "text-blue-500"}`}>
                      Beautiful Flower Ribbon Bouquets
                      </h3>
                      <p className={`text-center mb-0 ${gender === 'her' ? "text-pink-500" : "text-blue-500"} md:text-gray-600 mb-6 `}>
                      Surprise your loved ones with handcrafted floral beauty wrapped in elegant ribbons.
                      </p>
                      <button
                        className={`hidden md:flex justify-center items-center rounded-[40px] px-6 py-3 text-lg font-semibold shadow-md transition duration-300 hover:scale-105 ${
                          gender === "her" ? "bg-pink-500 text-white" : "bg-blue-500 text-white"
                      }`}
                      >
                      Gift Now
                      </button>
                  </div>

                  <div className="md:flex-shrink-0">
                      <img
                      src={gender === "her" ? "./Flower.jpg" : "./Flower2.png"}
                      alt="Flower Ribbon Bouquet"
                      className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] object-cover rounded-xl shadow-lg"
                      />

                  <button className={`flex justify-center items-center w-full rounded-[40px] px-6 py-3 text-lg font-semibold shadow-md transition duration-300 hover:scale-105 mt-5 mb-5 md:hidden ${
                      gender === "her" ? "bg-pink-500 text-white" : "bg-blue-500 text-white"
                    }`}
                  >
                    Gift Now
                  </button>

                  </div>

              </div>
          </div>

          <div className={`min-h-screen w-full px-4 py-8 sm:px-6 md:px-10 transition-all duration-300 
            ${gender === "her" ? "bg-pink-200 text-pink-600" : "bg-blue-200 text-blue-800"}`}>

            <div>
              <h2 className='text-[32px] sm:text-[45px] md:text-[60px] text-center mb-2 transition-all duration-300'
                style={{ fontFamily: '"Love Light", cursive' }}>
                Premium Collections
              </h2>
              <p className="text-[20px] sm:text-[30px] md:text-[40px] text-center mb-6 transition-all duration-300"
                style={{ fontFamily: '"Love Light", cursive' }}>
                {gender === "her" ? "For your queen" : "For your King"}
              </p>
              <Swiper
                spaceBetween={20}
                slidesPerView={3}
                breakpoints={{
                  480: { slidesPerView: 3 },
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 4 },
                }}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="w-full px-4"
              >
                {products.filter(product => product.productGender?.toLowerCase() === gender.toLowerCase()).slice(0, 6).map(product => (
                  <SwiperSlide key={product._id}>
                    <div className={`${gender === 'her' ? "bg-pink-300" : "bg-blue-300"} 
                        rounded-xl shadow-lg p-2 w-[100%] max-w-[250px] mx-auto 
                        h-[380px] flex flex-col items-center justify-between`}>
                      
                      <img
                        src={product.productImages?.length ? product.productImages?.[0] : ""}
                        alt={product.productTitle}
                        className="h-[160px] w-full object-cover rounded-md"
                      />
                      <h2 className="text-lg font-bold mt-2 text-white text-center">{product.productTitle}</h2>
                      <p className="text-white text-center text-sm">{product.productDescription}</p>
                      <p className="text-white text-center font-bold mt-1">₹{product.productPrice}</p>
                      <button className={`${gender === 'her' ? 
                          "mt-2 px-4 py-1 bg-pink-500" : 
                          "mt-2 px-4 py-1 bg-blue-500"} 
                          text-white rounded-full hover:opacity-90 transition text-sm mb-5`}>
                        Buy Now
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className='flex justify-center items-center mt-8'>
              <button className={`h-[40px] w-[160px] px-3 py-1 text-white rounded-full cursor-pointer transition 
                ${gender === 'her' ? 'bg-pink-400 hover:bg-pink-600' : 'bg-blue-400 hover:bg-blue-600'}`}>
                View All Products
              </button>
            </div>
          </div>

          <div className={`min-h-screen w-full px-4 py-8 sm:px-6 md:px-10 transition-all duration-300 
            ${gender === "her" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-800"}`}>

            <div>
              <h2 className='text-[32px] sm:text-[45px] md:text-[60px] text-center mb-2 transition-all duration-300'
                style={{ fontFamily: '"Love Light", cursive' }}>
                Special Edition
              </h2>
              <p className="text-[20px] sm:text-[30px] md:text-[40px] text-center mb-6 transition-all duration-300"
                style={{ fontFamily: '"Love Light", cursive' }}>
                {gender === "her" ? "For your queen" : "For your King"}
              </p>

              <Swiper
                spaceBetween={20}
                slidesPerView={3}
                breakpoints={{
                  480: { slidesPerView: 3 },
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 4 },
                }}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="w-full"
              >
                {products.filter(product =>
                  product.productGender?.toLowerCase() === gender.toLowerCase() &&
                  product.productCategory.toLowerCase() === 'special'
                ).map(product => (
                  <SwiperSlide key={product._id}>
                    <div className={`
                      ${gender === 'her' ? "bg-pink-300" : "bg-blue-300"} 
                      rounded-xl shadow-lg p-4 w-[90%] max-w-[250px] mx-auto 
                      h-[380px] flex flex-col items-center justify-between
                    `}>
                      <img
                        src={product.productImages && product.productImages.length
                          ? product.productImages[0]
                          : "Image could not be loaded"}
                        alt={product.productTitle}
                        className="h-[180px] w-full object-cover rounded-md"
                      />
                      <h2 className="text-lg font-bold mt-2 text-white text-center">{product.productTitle}</h2>
                      <p className="text-white text-center text-sm">{product.productDescription}</p>
                      <p className="text-white text-center font-bold mt-1">₹{product.productPrice}</p>
                      <button className={gender === 'her'
                        ? "mt-2 px-4 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition text-sm"
                        : "mt-2 px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-sm"}>
                        Shop Now
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          <div className='flex justify-center items-center mt-8'>
            <button className={`h-[40px] w-[160px] px-3 py-1 text-white rounded-full cursor-pointer transition 
              ${gender === 'her' ? 'bg-pink-400 hover:bg-pink-600' : 'bg-blue-400 hover:bg-blue-600'}`}>
              View All Products
            </button>
          </div>
          </div>

          <CustomizeForm/>
          <Footer/>




        </>
    )
}

export default Home