import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Order() {
  const deployedurl = import.meta.env.VITE_BACKEND_URL;
  const localurl='http://localhost:5678';
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountedamount, setdiscountedamount] =useState(0);
  const [baseTotalAmount, setBaseTotalAmount] = useState(0);

  const [paymentMode, setPaymentMode] = useState('cashondelivery');

  const [coupon, setCoupon] = useState([]);
  const [couponCode, setcouponCode] = useState("")
  
  useEffect(() => {
    const fetchcoupons = async () => {
      try {
        const res = await axios.get(`${deployedurl}/api/coupon/showcoupon`);
        setCoupon(res.data);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };

    fetchcoupons();
  }, []);

  const handleCouponApply = () => {
    if(cartItems.length === 0) { return alert("Please add atleast one product to apply coupon")}

    if (appliedCoupon) return alert("Coupon already applied.");

    const couponFound = coupon.find((c) => c.code.toLowerCase() === couponCode.toLowerCase());
    if (!couponFound) return alert("Invalid Coupon");
    if (!couponFound.isActive) return alert("Expired Coupon");


    let discount = 0;
    if (couponFound.discountType === 'amount') {
      discount = Number(couponFound.discountValue);
    } else if (couponFound.discountType === 'percentage') {
      discount = (baseTotalAmount * Number(couponFound.discountValue)) / 100;
    }

    const roundedDiscount = Math.round(discount);
    const newTotal = Math.max(0, baseTotalAmount - roundedDiscount);

    setAppliedCoupon(couponFound);
    setdiscountedamount(roundedDiscount);
    setTotalAmount(newTotal);

    alert(`Coupon applied! You saved ₹${roundedDiscount}`);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    alternativeContact: '',
    houseno: '',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${deployedurl}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cart = res.data.cart || {};
        const combined = [
          ...(cart.items || []),
          ...(cart.customItems || []),
        ];

        setCartItems(combined);

        const total = combined.reduce((acc, item) => {
          const cost = item.price && item.quantity
            ? item.price * item.quantity
            : item.totalPrice || 0;
          return acc + cost;
        }, 0);

        setBaseTotalAmount(total);
        setTotalAmount(total);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };

    fetchCart();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = async (indexToRemove) => {
    const itemToRemove = cartItems[indexToRemove];
    const token = localStorage.getItem('token');

    try {
      if (itemToRemove.productId) {
        // It's a regular product
        await axios.delete(`${deployedurl}/api/cart/item/${itemToRemove._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // It's a custom bouquet
        await axios.delete(`${deployedurl}/api/cart/custom/${itemToRemove._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Update UI
      const updatedItems = cartItems.filter((_, index) => index !== indexToRemove);
      updateCartTotals(updatedItems);
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Could not remove item.');
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const orderData = {
        userId,
        items: cartItems,
        totalAmount,
        paymentMode,
        deliveryAddress: formData,
      };
      const res = await axios.post(`${deployedurl}/api/order/place`, orderData);

      if (res.data.success) {
        alert("Order placed successfully!");
        navigate('/thank-you');
      } else {
        alert("Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Something went wrong while placing the order.");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setTotalAmount(baseTotalAmount);
    setdiscountedamount(0);
    if(cartItems.length === 0) { setTotalAmount(0)}
  };

  const updateCartTotals = (updatedCart) => {
  const total = updatedCart.reduce((acc, item) => {
    const cost = item.price && item.quantity
      ? item.price * item.quantity
      : item.totalPrice || 0;
    return acc + cost;
  }, 0);

  setCartItems(updatedCart);
  setBaseTotalAmount(total);
  if (appliedCoupon) {
    let discount = appliedCoupon.discountType === 'amount'
      ? Number(appliedCoupon.discountValue)
      : (total * Number(appliedCoupon.discountValue)) / 100;
    const roundedDiscount = Math.round(discount);
    setTotalAmount(Math.max(0, total - roundedDiscount));
    setdiscountedamount(roundedDiscount);
  } else {
    setTotalAmount(total);
    setdiscountedamount(0);
  }
  };



  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
        <form onSubmit={handleOrder} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Delivery Details</h2>

          <input type="text" name="name" placeholder="Name" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="contact" placeholder="Contact Number" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="alternativeContact" placeholder="Alternate Contact" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="houseno" placeholder="House No." onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="address" placeholder="Full Address" onChange={handleChange} className="w-full p-2 border rounded" rows={3} />
          <input type="text" name="city" placeholder="City" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="pincode" placeholder="Pincode" required onChange={handleChange} className="w-full p-2 border rounded" />

          <div className="flex gap-6 mt-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMode"
                value="cashondelivery"
                checked={paymentMode === 'cashondelivery'}
                onChange={() => setPaymentMode('cashondelivery')}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMode"
                value="online"
                checked={paymentMode === 'online'}
                onChange={() => setPaymentMode('online')}
              />
              Pay Online
            </label>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-3 rounded-lg mt-4"
            disabled={cartItems.length === 0}
          >
            Place Order (₹{totalAmount})
          </button>
        </form>
      </div>
      <div className="bg-white shadow-lg p-6 rounded-xl border border-rose-200">
        <h2 className="text-3xl font-bold text-rose-600 mb-6">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item, idx) => (
              <li key={idx} className="flex justify-between items-start bg-pink-50 p-4 rounded-xl shadow-sm">
                <div className="text-sm">
                  <h4 className="font-bold">
                    {item.productId?.productTitle || `Custom Bouquet (${item.flowerCount} flowers)`}
                  </h4>

                  {item.productId ? (
                    <>
                      <p>Flowers Color: {item.selectedColor}</p>
                      <p>Wrapper: Best fit</p>
                      <p>Decorations: Glitter, Ribbon</p>
                      <p>Making Cost: Free</p>
                      <div className='flex items-center gap-2'>
                        <p>Quantity: {item.quantity || 1}</p> 
                        
                        <button className='bg-blue-400 w-10 rounded-full' onClick={() => {
                          const updatedCart = [...cartItems];
                          updatedCart[idx].quantity = (updatedCart[idx].quantity || 1) + 1;
                          updateCartTotals(updatedCart);
                          }}
                        > + </button>

                        <button
                          className='bg-blue-400 w-10 rounded-full  disabled:opacity-50'
                           disabled={(item.quantity || 1) <= 1}
                          onClick={() => {
                          const updatedCart = [...cartItems];
                          updatedCart[idx].quantity = (updatedCart[idx].quantity || 1) - 1;
                          updateCartTotals(updatedCart);
                          }}
                        >
                          -
                        </button>


                      </div>
                      <p className="font-semibold text-rose-700">₹{item.price}</p>
                    </>
                  ) : (
                    <>
                      <p>Wrapper: {item.wrapperColor}</p>
                      <p>Colors: {item.flowerColor?.join(', ')}</p>
                      <p>Decorations: {item.selectedDecorations?.join(', ') || 'None'}</p>
                      <p>Making Cost: {item.makingCostFree ? 'Free' : '99 Tip'}</p>
                      <p className="font-semibold text-rose-700">₹{item.totalPrice}</p>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4 mt-6">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setcouponCode(e.target.value)}
            disabled={appliedCoupon}
            placeholder="Enter Coupon Code"
            className={`px-4 py-2 border rounded-lg w-2/3 focus:outline-none focus:ring-2 focus:ring-rose-300 ${
              appliedCoupon ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
            }`}
          />

          <button
            type="button"
            onClick={handleCouponApply}
            disabled={!!appliedCoupon}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-200 ${
              appliedCoupon
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-pink-600'
            }`}
          >
            {appliedCoupon ? ( <i>Applied</i>) : ('Apply')}
          </button>
        </div>


        <div className="mt-6 border-t pt-4 text-right space-y-2">
          <h3 className="text-xl font-bold text-rose-700">
            Total:{' '}
            {appliedCoupon ? (
              <>
                <del className="text-gray-500">₹{totalAmount + discountedamount} 🛒</del>
              </>
            ) : (
              <>₹{totalAmount + discountedamount} 🛒</>
            )}
          </h3>

          {appliedCoupon && (
            <>
              <div className="flex justify-end items-center gap-2 text-green-700 text-sm">
                <span>
                  🎁<i> {couponCode}</i> applied
                </span>
              
                <button
                  onClick={removeCoupon}
                  className="bg-red-500 hover:bg-pink-600 text-white rounded-full px-2 py-1 text-xs"
                >
                  Remove ❌
                </button>
              </div>
              <h3 className="text-xl font-bold text-green-700">
                Total: ₹{totalAmount} 🛒
              </h3>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Order;
