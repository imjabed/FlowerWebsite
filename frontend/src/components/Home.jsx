import Navbar from './Navbar'
import Footer from './Footer'

import { useState,useEffect } from "react";
import axios from 'axios';

// Animations 
import useLenis from './useLenis'

import GenderToggle from "./GenderToggle"; 
import CustomizeForm from './CustomizeForm';

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
            <div className="h-[600px] w-full px-4 text-center md:text-left banner" style={{ backgroundColor: gender === 'her' ? '#ffe6f0' : '#d0e8ff' }}>
                <GenderToggle onToggle={(selected) => setGender(selected)} />
                
                <div className='flex flex md:flex-row items-center justify-center gap-8'>
                    <div className="max-w-md">
                        <h3 className={`text-3xl md:text-4xl font-bold mb-4 ${gender === 'her' ? "text-pink-500" : "text-blue-500"}`}>
                        Beautiful Flower Ribbon Bouquets
                        </h3>
                        <p className="text-gray-600 mb-6">
                        Surprise your loved ones with handcrafted floral beauty wrapped in elegant ribbons.
                        </p>
                        <button
                        className={`rounded-[40px] px-6 py-3 text-lg font-semibold shadow-md transition duration-300 hover:scale-105 ${
                            gender === "her" ? "bg-pink-500 text-white" : "bg-blue-500 text-white"
                        }`}
                        >
                        Gift Now
                        </button>
                    </div>

                    <div className="flex-shrink-0">
                        <img
                        src={gender === "her" ? "./Flower.jpg" : "./Flower2.png"}
                        alt="Flower Ribbon Bouquet"
                        className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] object-cover rounded-xl shadow-lg"
                        />
                    </div>
                </div>
            </div>

            <div className={`h-screen w-full p-10 transition-all duration-300 ${gender === "her" ? "bg-pink-200 text-pink-600" : "bg-blue-200 text-blue-800"}`}>
                
                <h2 className='text-[40px] mb-4 text-center transition-all duration-300'>Premium Collections</h2>
                <h2 className="text-xl mb-4 text-center transition-all duration-300">    
                            {gender === "her" ? "For your queen" : "For your King"}
                </h2>

                <div className='flex flex-wrap justify-center gap-20'>
              {products.filter(product => product.productGender?.toLowerCase() === gender.toLowerCase()).slice(0,3).map(product => (
                <div key={product._id} className={gender === 'her' ? 
                  "bg-pink-300 rounded-xl shadow-lg p-4 w-[250px] h-[380px] flex flex-col items-center justify-between"
                  :"bg-blue-300 rounded-xl shadow-lg p-4 w-[250px] h-[380px] flex flex-col items-center justify-between"}>
                  <img
                    src={ product.productImages && product.productImages.length ? `${deployedurl}/uploads/products/${product.productImages[0]}` : "No Images Found"}
                    alt={product.productTitle}
                    className="h-[180px] w-full object-cover rounded-md"
                  />
                  <h2 className="text-lg font-bold mt-2 text-white text-center">{product.productTitle}</h2>
                  <p className="text-white text-center text-sm">{product.productDescription}</p>
                  <p className="text-white text-center font-bold mt-1">₹{product.productPrice}</p>
                  <button className={gender === 'her' ? 
                  "mt-2 px-4 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition text-sm"
                  : "mt-2 px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-sm"}>Shop Now</button>
                  
                </div>
                
              
              
              ))}
                </div>

            </div>

            <div className={`flex flex-col justify-center gap-20 items-center h-screen w-full p-10 transition-all duration-300 ${gender === "her" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-800"}`}>


                <div className=''> 
                  <h2 className='text-[40px] mb-4 text-center transition-all duration-300'>Special Edition</h2>
                  <h2 className="text-xl mb-4 text-center transition-all duration-300">{gender === "her" ? "For your queen" : "For your King"}</h2>
                  <div className='flex flex-wrap justify-center gap-20'>
                    {products.filter(product =>
                    { return product.productGender?.toLowerCase() === gender.toLowerCase() && product.productCategory.toLowerCase() === 'special'
                    }).map(product => (

                      <div key={product._id} className={gender === 'her' ? 
                        "bg-pink-300 rounded-xl shadow-lg p-4 w-[250px] h-[380px] flex flex-col items-center justify-between"
                        :"bg-blue-300 rounded-xl shadow-lg p-4 w-[250px] h-[380px] flex flex-col items-center justify-between"}>
                        <img
                          src={ product.productImages && product.productImages.length ? `${deployedurl}/uploads/products/${product.productImages[0]}` : "No Images Found"}
                          alt={product.productTitle}
                          className="h-[180px] w-full object-cover rounded-md"
                        />
                        <h2 className="text-lg font-bold mt-2 text-white text-center">{product.productTitle}</h2>
                        <p className="text-white text-center text-sm">{product.productDescription}</p>
                        <p className="text-white text-center font-bold mt-1">₹{product.productPrice}</p>
                          
                        <button className={ gender === 'her' ? "mt-2 px-4 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition text-sm"
                        : "mt-2 px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-sm" } >Shop Now</button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button className={`h-[40px] w-[160px] px-3 py-1 text-white rounded-full cursor-pointer transition 
                                    ${ gender === 'her' ? 'bg-pink-400 hover:bg-pink-600' : 'bg-blue-400 hover:bg-blue-600'}`}>
                  View All Products
                </button>


            </div>

     
            <CustomizeForm/>
            



            <Footer/>
        </>
    )
}

export default Home