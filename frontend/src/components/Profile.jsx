import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
function Profile() {
  const deployedurl = import.meta.env.VITE_BACKEND_URL;
  const localurl='http://localhost:5678';
  
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored) {
      setUser(stored);
      setFormData({ name: stored.name, phone: stored.phone });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    if (file) data.append("profilePicture", file);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(`${deployedurl}/api/user/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Profile Updated");
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      console.error("Update error:", err);
      alert("Profile update failed");
    }
  };

  return (
    <>
    <Navbar/>
    <div className='flex h-screen justify-around items-start mt-10'>

      <div className="flex flex-col justify-center items-around gap-10 bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md h-115">
      <p className='text-center font-bold text-xl text-pink-600'> Hey, {user.name}</p>

      <button className="bg-pink-500 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 cursor-pointer">
        My Profile
      </button>
      
      <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 cursor-pointer">
        Orders
      </button>
      
      <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 cursor-pointer">
        Wishlist
      </button>
      
      <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 cursor-pointer">
        Rewards
      </button>
  
      </div>

      <div className="flex flex-col justify-center bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md">
        <div className='flex flex-col items-center gap-2'>
          <h2 className='text-center font-bold text-xl text-pink-600'>Your Profile</h2>
          {user.profilePicture && (
            <img
              src={user?.profilePicture? user.profilePicture : "/userIcon.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full mt-4 "
            />
          )}     
        </div>
        <div className='flex flex-col gap-4 mt-5 mb-5'>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p> 
        </div>
 

        <h2 className="text-center font-bold text-xl text-pink-600 mb-3">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter name"
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone"
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
          <p className='text-center'>Profile Picture</p>
          <input type="file" onChange={e => setFile(e.target.files[0])} className='cursor-pointer' />
          <button type="submit" className="bg-pink-600 text-white py-2 rounded cursor-pointer hover:bg-pink-700 transition duration-300">Update</button>
        </form>
      </div>
    </div>

    </>
  );
}

export default Profile;
