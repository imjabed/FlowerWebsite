import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import Navbar from './Navbar';

import axios from "axios";

function Products({ gender }) {
  const deployedurl = import.meta.env.VITE_BACKEND_URL;
  const localurl='http://localhost:5678';

  const [products, setProducts] = useState({});
  const token = localStorage.getItem("token");


  useEffect(() => {
        axios.get(`${deployedurl}/api/products/show`, {
                headers: {
                Authorization: `Bearer ${token}`
                }
            })
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

  const cardClass = gender === "her"
    ? "bg-pink-300"
    : "bg-blue-300 text-white";

  return (
    <>
    <Navbar/>
      {Object.keys(products).map(category => (
        <div key={category} className="my-10 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center capitalize">{category}</h2>

          <div className="flex flex-wrap justify-center gap-10">
            {products[category].map(product => (
              <div
                key={product._id}
                className={`${cardClass} rounded-xl shadow-lg p-4 w-[250px] h-[380px] flex flex-col items-center justify-between`}
              >
                <img
                  src={
                    product.productImages?.length
                      ? `${deployedurl}/uploads/products/${product.productImages[0]}`
                      : "No Images Found"
                  }
                  alt={product.productTitle}
                  className="h-[180px] w-full object-cover rounded-md"
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
            ))}
          </div>

        </div>
      ))}
    </>
  );
}

export default Products;
