import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import { ShoppingCartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';



import Navbar from './Navbar';
import Footer from './Footer';
 
function SingleProduct(){
    const deployedurl = import.meta.env.VITE_BACKEND_URL;
    const localurl='http://localhost:5678';

    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [textcolor, setTextcolor] = useState('white');
    const [selectedColor, setSelectedColor] = useState('');


    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const nextImage = () => {
      if (product && product.productImages && product.productImages.length > 0) {
        setCurrentImageIndex((prevIndex) =>
          (prevIndex + 1) % product.productImages.length
        );
      }
    };

    const navigate = useNavigate();

    const token = localStorage.getItem("token"); 
    const handleAddToCart = async () => {
      try {
        console.log("TOKEN: ", token);
        console.log("Adding product to cart:", {
          productId: product._id,
          quantity: 1,
          selectedColor: selectedColor,
        });
        if(!selectedColor) { return alert("Please choose atleast one colour!")}
        await axios.post(`${deployedurl}/api/cart/add`, {
          productId: product._id,
          quantity: 1,
          selectedColor: selectedColor,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert("Added to cart!");
      } catch (err) {
        console.error(err);
        alert("Error adding to cart");
      }
    };

    const handleBuyNow = async () => {
      try {
        if(!selectedColor) { return alert("Please choose atleast one colour!")}
        await handleAddToCart(); 
        navigate("/orderpage");   
      } catch (err) {
        alert("Could not complete action");
      }
    };

    useEffect(()=>{
        fetch(`${deployedurl}/api/products/show/${id}`)
        .then((res)=>res.json())
        .then((data)=>setProduct(data))
        .catch((err)=>console.error(err))
    },[id]);
    if(!product) return <div>Loading...</div>

    return(
        <>
        <Navbar/>
        {/* <div className="relative w-full">
            <div className="absolute px-30 z-50" >
                <h2 className="text-[154px] font-bold" style={{ color: textcolor}}>{product.productTitle}</h2>
                <p className="text-[25px] r-0 max-w-[800px]">{product.productDescription}</p>
                
                <div className="flex gap-10 py-5 cursor-pointer ">

                  <div className="flex flex-col justify-items items-center font-bold" onClick={()=>{setTextcolor('#b91c1c'), setCurrentImageIndex(0),  setSelectedColor('Red'); }}>
                    <div className="h-10 w-10 bg-red-900 rounded-full border-4 border-white transform transition-transform duration-300 hover:scale-115"></div> 
                    <p className="text-red-900" >Red</p>
                  </div>

                  <div className="flex flex-col justify-items items-center font-bold"onClick={()=>{setTextcolor('#000000'), setCurrentImageIndex(1), setSelectedColor('Black'); }}>
                    <div className="h-10 w-10 bg-black rounded-full border-4 border-white transform transition-transform duration-300 hover:scale-115"></div> 
                    <p className="text-black" >Black</p>
                  </div>


                  <div className="flex flex-col justify-items items-center font-bold" onClick={()=>{setTextcolor('pink'), setCurrentImageIndex(2),  setSelectedColor('Pink'); }}>
                    <div className="h-10 w-10 bg-pink-600 rounded-full border-4 border-white transform transition-transform duration-300 hover:scale-115"></div> 
                    <p className="text-pink-600" >Pink</p>
                  </div>            


                </div>

                <p className="font-bold text-gray-400 text-[30px]"> <del>₹{product.productPrice + 250}</del> /-</p>
                <p className="font-bold text-red-600 text-[30px]">₹{product.productPrice} /- </p>
                
                <div className="flex flex-col gap-5 py-5 font-bold">
                  <button onClick={handleBuyNow} className="bg-blue-700 text-white px-10 py-3 w-[280px] rounded-[10px] flex justify-center items-center gap-2 cursor-pointer transition duration-300 hover:bg-blue-900">
                    <ShoppingCartIcon className="h-5 w-5" />
                    Buy Now
                  </button>
                  <button onClick={handleAddToCart} className="bg-blue-800 text-white px-10 py-3 w-[280px] rounded-[10px] flex justify-center items-center gap-2 cursor-pointer transition duration-300 hover:bg-blue-900">
                    <ShoppingBagIcon className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
            </div>
            <div className="h-full w-full flex items-center justify-center">
            {product.productImages && product.productImages.length > 0 && (
                <img
                src={
                  product.productImages?.[currentImageIndex] || "fallback.jpg"
                  // `${deployedurl}/uploads/products/${product.productImages[currentImageIndex]}` 
                }
                alt=""
                className="w-full h-screen object-cover mx-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]  "
                />
            )}
            <button onClick={nextImage}className="absolute right-4 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-all">
                More Variants
            </button>
            </div>
        </div> */}

<div className="relative w-full h-[100dvh] overflow-hidden">
  {/* Background Image */}
  <div className="w-full h-full">
    {product.productImages && product.productImages.length > 0 && (
    <img
      src={product.productImages?.[currentImageIndex] || "fallback.jpg"}
      alt="Product"
      className="w-full h-full object-cover object-[80%] md:object-center"
    />

    )}
  </div>

  {/* Text Content Overlay */}
  <div className="hidden md:absolute md:inset-0 md:px-6 md:px-20 md:py-10 md:flex md:flex-col md:justify-center md:z-30 md:max-w-[700px]">
    <h2 className="text-[42px] sm:text-[64px] lg:text-[90px] xl:text-[130px] 2xl:text-[154px] font-extrabold leading-tight break-words" style={{ color: textcolor }}>
      {product.productTitle}
    </h2>
    <p className="text-[18px] md:text-[22px] max-w-[800px] text-white/90 mt-4">{product.productDescription}</p>

    {/* Color Selectors */}
    <div className="flex gap-6 py-6 cursor-pointer">
      {[
        { name: "Red", color: "#b91c1c", bg: "bg-red-900", index: 0 },
        { name: "Black", color: "#000000", bg: "bg-black", index: 1 },
        { name: "Pink", color: "pink", bg: "bg-pink-600", index: 2 },
      ].map((clr, i) => (
        <div
          key={clr.name}
          onClick={() => {
            setTextcolor(clr.color);
            setCurrentImageIndex(clr.index);
            setSelectedColor(clr.name);
          }}
          className="flex flex-col items-center font-bold"
        >
          <div className={`h-10 w-10 ${clr.bg} rounded-full border-4 border-white transform transition-transform duration-300 hover:scale-110`}></div>
          <p className={`text-[14px] mt-1`} style={{ color: clr.color }}>{clr.name}</p>
        </div>
      ))}
    </div>

    {/* Pricing */}
    <p className="font-bold text-gray-300 text-[20px] sm:text-[24px]"><del>₹{product.productPrice + 250}</del> /-</p>
    <p className="font-bold text-red-500 text-[26px] sm:text-[30px]">₹{product.productPrice} /-</p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 py-5 font-bold">
      <button
        onClick={handleBuyNow}
        className="bg-blue-700 text-white px-8 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-900 transition-all w-full sm:w-[280px]"
      >
        <ShoppingCartIcon className="h-5 w-5" />
        Buy Now
      </button>
      <button
        onClick={handleAddToCart}
        className="bg-blue-800 text-white px-8 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-900 transition-all w-full sm:w-[280px]"
      >
        <ShoppingBagIcon className="h-5 w-5" />
        Add to Cart
      </button>
    </div>
  </div>
  
  <div className="md:hidden absolute inset-0 px-6 py-4 flex flex-col justify-center z-30 max-w-[700px]">
    <h2 className="text-[42px] sm:text-[64px] lg:text-[90px] xl:text-[130px] 2xl:text-[154px] font-extrabold leading-tight break-words" style={{ color: textcolor }}>
      {product.productTitle}
    </h2>
    <p className="text-[18px] md:text-[22px] max-w-[800px] text-white/90 mt-4">{product.productDescription}</p>

    {/* Color Selectors */}
    <div className="flex gap-6 py-6 cursor-pointer">
      {[
        { name: "Red", color: "#b91c1c", bg: "bg-red-900", index: 0 },
        { name: "Black", color: "#000000", bg: "bg-black", index: 1 },
        { name: "Pink", color: "pink", bg: "bg-pink-600", index: 2 },
      ].map((clr, i) => (
        <div
          key={clr.name}
          onClick={() => {
            setTextcolor(clr.color);
            setCurrentImageIndex(clr.index);
            setSelectedColor(clr.name);
          }}
          className="flex flex-col items-center font-bold"
        >
          <div className={`h-10 w-10 ${clr.bg} rounded-full border-4 border-white transform transition-transform duration-300 hover:scale-110`}></div>
          <p className={`text-[14px] mt-1`} style={{ color: clr.color }}>{clr.name}</p>
        </div>
      ))}
    </div>

    {/* Pricing */}
    <p className="font-bold text-gray-300 text-[20px] sm:text-[24px]"><del>₹{product.productPrice + 250}</del> /-</p>
    <p className="font-bold text-red-500 text-[26px] sm:text-[30px]">₹{product.productPrice} /-</p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 py-5 font-bold">
      <button
        onClick={handleBuyNow}
        className="bg-blue-700 text-white px-8 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-900 transition-all w-full sm:w-[280px]"
      >
        <ShoppingCartIcon className="h-5 w-5" />
        Buy Now
      </button>
      <button
        onClick={handleAddToCart}
        className="bg-blue-800 text-white px-8 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-900 transition-all w-full sm:w-[280px]"
      >
        <ShoppingBagIcon className="h-5 w-5" />
        Add to Cart
      </button>
    </div>
  </div>

  {/* Next Image Button */}
  <button
    onClick={nextImage}
    className="absolute bottom-4 right-4 z-40 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-all"
  >
    More Variants
  </button>

  {/* Optional Overlay (darken image) */}
  <div className="absolute inset-0 bg-black/20 z-10"></div>
</div>

        <section className="flex justify-around items-center px-10 py-10">
            <div className="flex flex-col justify-center items-cente gap-2"> <img src="/delivery.png" alt="" height={'100px'} width={'100px'} />Free Delivery</div>
            <div className="flex flex-col justify-center items-center gap-2"> <img src="/gift.png" alt="" height={'100px'} width={'100px'} />Gift Special One</div>
            <div className="flex flex-col justify-center items-center gap-2"> <img src="/cod.png" alt="" height={'100px'} width={'100px'} />Cash On Delivery</div>
            {/* <div className="flex flex-col justify-center items-center gap-2"> <img src="/return.png" alt="" height={'100px'} width={'100px'} />Return Available</div> */}
            <div className="flex flex-col justify-center items-center gap-2"> <img src="/trusted.png" alt="" height={'100px'} width={'100px'} />Trusted by 8347+ Customers</div>
        </section>

        <div>
  
        </div>
            
        <div className="w-full flex justify-around bg-pink-300 mt-5">
          <section className="relative px-30 z-50">
            <h2 className="text-[120px] font-bold">Single Flower</h2>
            <p className="text-[20px] font-bold">A single flower is made of </p>
          </section>
            <img src="/SR.png" alt="" className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] mw-10"/>
        </div>

        <div className="w-full flex justify-around bg-pink-200 mt-5">
          <section className="relative px-30 z-50">
            <h2 className="text-[100px] font-bold">Bouquet Details</h2>
            <p className="text-[20px] font-bold">A bouquet flower is made of </p>
          </section>
            <img src="/B.png" alt="" className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] max-w-[400px]"/>
        </div>

 
      <Footer/>
        </>
    )
}

export default SingleProduct;