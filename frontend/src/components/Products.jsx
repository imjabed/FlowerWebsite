import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import Navbar from './Navbar';
import GenderToggle from "./GenderToggle";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import axios from "axios";

function Products() {
  const deployedurl = import.meta.env.VITE_BACKEND_URL;
  const localurl='http://localhost:5678';
  
  const [gender, setGender] = useState("her");
  const [products, setProducts] = useState({});
  const token = localStorage.getItem("token");
  const cardClass = gender === "her" ? "bg-pink-300" : "bg-blue-300";
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
      axios.get(`${deployedurl}/api/products/show`, { headers: { Authorization: `Bearer ${token}`}})
      .then(res => {

        const grouped = res.data.reduce((acc, product) => {
          const category = product.productCategory || "Others";
 
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
              return acc;
            }, {}); 
        setProducts(grouped);

      })
      .catch(err => console.log(err));
  }, []);
  return (
    <>
    <Navbar/>

      <div className="flex justify-around gap-1">

        <div className="max-w-[400px] bg-white flex flex-col px-10 py-10 sticky top-0 max-h-screen overflow-y-auto">

          <div className="flex flex-col">
            <p className="text-[20px]">Filter by</p>
            <hr className="mt-2"/>
            <div className="flex flex-col mt-4 px-4"> 
              <p className="px-2">Gender</p> 
              <hr className="mt-2 text-pink-200" />
              <div className="flex items-center gap-4">
                <p className="text-[14px]">Bouquets for {" "} 
                  <span className={ gender==="her"? "text-pink-400" : "text-blue-400"} style={{fontFamily:"Love Light", fontSize:'28px', fontWeight:'bold'}}>{gender}</span> 
                </p>
                <GenderToggle onToggle={(selected) => setGender(selected)} />
              </div>
            </div>

            <div className="flex gap-2 px-4"> <input type="checkbox" name="filterby" id="vs"/>  <label htmlFor="vs">Valentines Special</label> </div>
            <div className="flex gap-2 px-4"> <input type="checkbox" name="filterby" id="as"/>  <label htmlFor="as">Anniversary Special</label> </div>
            <div className="flex gap-2 px-4"> <input type="checkbox" name="filterby" id="bs"/>  <label htmlFor="bs">Birthday Special</label> </div>
            <div className="flex gap-2 px-4"> <input type="checkbox" name="filterby" id="se"/>  <label htmlFor="se">Special Edition</label> </div>
          </div>

          <div className="flex flex-col mt-5">
            <p className="text-[20px] ">Sort by</p>
            <hr className="mt-2 mb-2"/>
            <div className="px-4 flex flex-col gap-1">
              <div> <input type="radio" name="sortby" value="lth" id="lth" onChange={(e) => setSortBy(e.target.value)}/>  <label htmlFor="lth"> Price Low to High</label> </div>
              <div> <input type="radio" name="sortby" value="htl" id="htl" onChange={(e) => setSortBy(e.target.value)}/>  <label htmlFor="htl"> Price High to Low</label> </div>
              <div> <input type="radio" name="sortby" value="pop" id="pop" onChange={(e) => setSortBy(e.target.value)}/>  <label htmlFor="pop"> Popularity</label> </div>
            </div>
          </div>
        </div> 

        <div>
          {Object.keys(products).map(category => {
            
            const FilteredProductsbyGender = products[category].filter(
              product => product.productGender.toLowerCase() === gender.toLowerCase()
            );
            const sortedProducts = [...FilteredProductsbyGender];
            if (sortBy === 'lth') {
              sortedProducts.sort((a, b) => a.productPrice - b.productPrice);
            } else if (sortBy === 'htl') {
              sortedProducts.sort((a, b) => b.productPrice - a.productPrice);
            }

            return (
              <div className="w-full" key={category}> 
                <div className={`${cardClass} py-10 flex flex-col justify-center gap-5 w-[1200px]`}>
                  <h2 className="text-2xl text-pink-600 mb-6 text-center capitalize">Ribbon {category}</h2>
                  <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="w-full"
                    breakpoints={{
                      480: { slidesPerView: 1 },
                      640: { slidesPerView: 2 },
                      768: { slidesPerView: 4 }, 
                      1024: { slidesPerView: 4 },
                    }}
                  >
                    {sortedProducts.map(product => (
                      <SwiperSlide key={product._id}>
                        <div className="w-[250px] mx-auto shadow-lg p-4 h-[350px] flex flex-col items-center justify-between bg-white">
                          <img
                            src={product.productImages?.[0]?.url || "fallback.jpg"}
                            alt={product.productTitle}
                            className="h-[180px] w-full object-cover"
                          />
                          <h2 className="text-lg font-bold mt-2 text-center">{product.productTitle}</h2>
                          <p className="text-center text-sm">{product.productDescription}</p>
                          <p className="text-center font-bold mt-1">₹{product.productPrice}</p>
                          <Link to={`/product/${product._id}`}>
                            <button className="mt-2 px-4 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition text-sm">
                              Shop Now
                            </button>
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}

export default Products;
