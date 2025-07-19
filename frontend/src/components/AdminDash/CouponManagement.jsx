import { useState, useEffect } from "react";
import axios from "axios";

function CouponManagement() {
    const [coupons, setCoupons] = useState([]);
    const [form, setForm] = useState({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: "",
    category: "",
    gender: "Him",
    isActive: true,
    });

    const fetchCoupons = async () => {
    try {
        const res = await axios.get("http://localhost:5678/api/coupon/showcoupon");
        setCoupons(res.data);
    } catch (err) {
        console.error("Error fetching coupons:", err);
        setCoupons([]);
    }
    };

    useEffect(() => {
    fetchCoupons();
    }, []);

  const handleCreateCoupon = async () => {
    try {
      if (form.code.length < 4) {
        return alert("Coupon code should be atleast 4 digit code");
      }
      if (form.discountValue <= 0) {
        return alert("Please enter discount value")
      }
      if (form.discountType==='percentage' && form.discountValue > 100)  {
        return alert("Percentage Cannot Exceed 100%")
      }
      if(!form.category) { form.category = 'all'}
      await axios.post("http://localhost:5678/api/coupon/addcoupon", form);
      fetchCoupons();
      setForm({ name: "", code: "", discountType: "amount", discountValue: "", category: "", gender: "Him", isActive: true,});
    } catch (err) {
      alert("Error creating coupon: " + err.response.data.error);
    }
  };

  const toggleStatus = async (id) => {
    await axios.patch(`http://localhost:5678/api/coupon/${id}`);
    fetchCoupons();
  };

  const deleteCoupon = async (id) => {
    await axios.delete(`http://localhost:5678/api/coupon/${id}`);
    fetchCoupons();
  };

  return (
    <div className="flex flex-col justify-center items-center px-10 py-10 gap-5">
      <h2 className="text-2xl font-bold bg-pink-100 px-2 py-2 rounded-md">Coupon Management</h2> 

      <div className="h-[400px] w-[700px] rounded-2xl bg-cover relative shadow-2xl" style={{backgroundImage:"url('/couponcover.jpg')"}}>
              <h2 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-lg font-bold border border-pink-800 px-4 py-2 rounded-xl shadow-2xl">Create a Coupon</h2>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] flex flex-wrap gap-3">
                  <input type="text" placeholder="Coupon Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white-100 rounded-lg px-2 py-2 w-[150px] border border-pink-800"/>
                  <input type="text" placeholder="Coupon Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="bg-white-100 rounded-lg px-2 py-2 w-[150px] border border-pink-800"/>  
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}className="bg-white-100 rounded-lg px-2 py-2 w-[150px] border border-pink-900">
                    <option value="amount">₹ Amount</option>
                    <option value="percentage">% Percentage</option>
                  </select>
                  <input type="number" placeholder="Discount Value" value={form.discountValue} onChange={(e)=>setForm({ ...form, discountValue: e.target.value })}className="bg-white-100 rounded-lg px-2 py-2 w-[150px] border border-pink-800"/>
                  <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-white-100 rounded-lg px-2 py-2 w-[150px] border border-pink-800"/>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="bg-white-100 rounded-lg px-2 py-2 w-[150px] border border-pink-800">
                    <option value="Him">For Him</option>
                    <option value="Her">For Her</option>
                  </select>
                  <label className="bg-white-100 rounded-lg px-2 py-2 w-[150px] border border-pink-800">
                    <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}>Status  : {form.isActive ? "Activated" : "Deactivated"}
                    </button>
                  </label>
                  <button onClick={handleCreateCoupon}className="bg-blue-600 text-white border-0 font-bold rounded-lg px-2 py-2">Create new Coupon</button>

              </div>
      </div>

      <h2 className="">All Coupons</h2>
      <div className="">
        <table className="min-w-[700px] w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Value</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td className="p-2 border">{coupon.name}</td>
                <td className="p-2 border">{coupon.code}</td>
                <td className="p-2 border">{coupon.discountType}</td>
                <td className="p-2 border">{coupon.discountValue}</td>
                <td className="p-2 border">{coupon.category}</td>
                <td className="p-2 border">{coupon.gender}</td>
                <td className="p-2 border flex justify-center items-center gap-2">
                  {coupon.isActive? 'Enabled ' : 'Disabled '}
                  <input
                    type="checkbox"
                    checked={coupon.isActive}
                    onChange={() => toggleStatus(coupon._id)}
                  /> 
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-400">
                  No coupons added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CouponManagement;
