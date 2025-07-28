import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { TruckIcon, CheckBadgeIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const deployedurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const res = await axios.get(`${deployedurl}/api/order/myorders?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.orders || []);
      } catch (e) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, [deployedurl]);

  // Optionally remove status section if not needed for now

  return (
    <>
      <Navbar />
      <div className='w-full flex justify-center mt-10'>
        <div className='bg-white w-[1080px] h-full py-10 px-10'>
          <h2 className='mb-5'>My Orders</h2>
          <hr className='mb-5' />
          {orders.length === 0 ? (
            <div>No Orders Found</div>
          ) : (
            orders.map(order => (
              <div key={order._id} className='bg-pink-200 mb-8 rounded-lg'>
                <div className='flex justify-between w-full px-5 py-2'>
                  {/* Status icons skipped for now */}
                  <div className='flex flex-col'>
                    <p className='capitalize text-[16px]'>{order.status || "Placed"}</p>
                    <p className='text-[12px]'>
                      Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                  <p>Order No: {order.orderNumber || order._id}</p>
                </div>
                <hr />
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className='flex justify-between w-full px-5 py-2'>
                    <img
                      src={item.productId?.image || "/Flower.jpg"}
                      alt=""
                      className='h-40 w-30'
                    />
                    <div className='flex flex-col justify-center'>
                      <p>{item.productId?.productTitle || `Custom Bouquet (${item.flowerCount} flowers)`}</p>
                      <p>Colour: {item.selectedColor || item.wrapperColor || ''}</p>
                      <p>Price: ₹{item.price || item.totalPrice}</p>
                      <p>Payment Mode: {order.paymentMode || "N/A"}</p>
                      <p>Payment Status: {order.paymentStatus || "N/A"}</p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-5'>
                      <button className='bg-pink-800 px-4 py-2 text-white font-semibold cursor-pointer hover:bg-pink-900 transition duration-300'>
                        Buy it Again
                      </button>
                      <button className='bg-pink-800 px-4 py-2 text-white cursor-pointer hover:bg-pink-900 transition duration-300'>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default MyOrders;
