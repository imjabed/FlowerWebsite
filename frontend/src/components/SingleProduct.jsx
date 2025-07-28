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

        <div className="h-[60dvh] w-full md:relative md:h-[100dvh] md:overflow-hidden">
          {/* Background Image */}
          <div className="w-full h-full">
            {product.productImages && product.productImages.length > 0 && (
            <img
              src={product.productImages?.[currentImageIndex].url || "fallback.jpg"}
              alt="Product"
              className="w-full h-full object-cover object-[80%] md:object-center"
            />

            )}
          </div>

          {/* Text Content Overlay */}
          <div className="md:bg-transparent   bg-pink-300 md:mt-0 mt-5 md:absolute md:inset-0 px-6 py-0 md:px-20 md:py-10 flex flex-col md:justify-center md:z-30 max-w-[700px]">
            <h2 className="text-[42px] sm:text-[64px] lg:text-[70px] xl:text-[85px] 2xl:text-[154px] font-extrabold leading-tight break-words" style={{ color: textcolor }}>
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
          {/* <div className="absolute inset-0 bg-black/20 z-10"></div>  */}
        </div>

        <div className="mt-[450px] md:mt-0">
          <section className="flex justify-around items-center px-5 md:px-10 py-10">
              <div className="flex flex-col justify-center items-cente gap-2   md:h-24 md:w-24 h-12 w-12"> <img src="/delivery.png" alt="" /> <p className="text-center md:text-[16px] text-[12px]">Free Delivery</p></div>
              <div className="flex flex-col justify-center items-center gap-2  md:h-24 md:w-24 h-12 w-12"> <img src="/gift.png" alt=""  /><p className="text-center md:w-96 md:text-[16px] text-[12px]">Gift Wrap</p></div>
              <div className="flex flex-col justify-center items-center gap-2   md:h-24 md:w-24 h-12 w-12"> <img src="/cod.png" alt=""/> <p className="text-center md:w-96 md:text-[16px] text-[12px] w-22">Cash On Delivery</p></div>
              {/* <div className="flex flex-col justify-center items-center gap-2   md:h-24 md:w-24 h-12 w-12"> <img src="/return.png" alt="" />Return Available</div> */}
              <div className="flex flex-col justify-center items-center gap-2 md:h-24 md:w-24 h-12 w-12"> <img src="/trusted.png" alt="" /> <p className="md:w-96 md:text-center md:text-[16px] text-[12px] w-22" >Trusted by 879+ Customers </p></div>
          </section>
        </div>
            
        <div className="w-full flex md:flex-row flex-col justify-around bg-pink-300 mt-5">
          <section className="relative px-10 text-center md:text-left md:px-30 z-50">
            <h2 className="text-[40px] md:text-[120px] font-bold">Single Flower</h2>
            <p className="text-[12px] md:text-[20px] font-bold">A single flower is made of </p>
          </section>
            <img src="/SR.png" alt="" className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] mw-10"/>
        </div>

        <div className="w-full flex md:flex-row flex-col justify-around bg-pink-200 mt-5">
          <section className="relative px-10 text-center md:text-left md:px-30 z-50">
            <h2 className="text-[40px] md:text-[120px] font-bold">Bouquet Details</h2>
            <p className="text-[12px] md:text-[20px] font-bold">A bouquet flower is made of </p>
          </section>
            <img src="/B.png" alt="" className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] max-w-[400px]"/>
        </div>

      <Footer/>
        </>
    )
}

export default SingleProduct;