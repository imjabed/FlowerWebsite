import { useState } from "react"
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom'
import Navbar from './Navbar'

function Signup(){
    const deployedurl = import.meta.env.VITE_BACKEND_URL;
    const localurl='http://localhost:5678';

    const [formData,setformData] = useState({name:"", email:"", password:"", phone:""});
    const handleChange = (e) => { setformData({...formData, [e.target.name]:e.target.value})}
    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
        setloading(true);
        try{
            await axios.post(`${deployedurl}/api/auth/signup`, formData);
            navigate('/verifyotp', { state: { email: formData.email } });
        }
        catch(err)
        {
            alert("Signup failed. " + (err.response?.data?.message || ""));
        }
        finally {
        setloading(false); 
        }
    }

    const [loading, setloading] = useState(false)
    return(<>
    <Navbar/>
    <div className="flex h-screen justify-center items-center bg-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-6 bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-2xl text-center font-bold text-pink-600">Sign Up</h2>
            <input type="text" placeholder="Enter your name" onChange={handleChange} name="name" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"/>
            <input type="email" placeholder="Enter your email address" onChange={handleChange} name="email" required className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"/>
            <input type="password" placeholder="Enter a password"onChange={handleChange} name="password" required className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"/>
            <input type="number" placeholder="Phone Number (Optional)" onChange={handleChange} name="phone" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500" />
            {/* <button type="submit" className="text-white bg-pink-600 rounded-lg py-3 hover:bg-pink-700 transition duration-300 cursor-pointer">Send Otp</button> */}
            
            <button type="submit" disabled={loading} className={`text-white bg-pink-600 rounded-lg py-3 transition duration-300 cursor-pointer flex justify-center items-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-pink-700'}`} >
            {loading ? (
                <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending OTP...
                </>
            ) : (
                "Send Otp"
            )}
            </button>

            <p className="text-sm">Already have an accoount? <Link to='/login' className="font-bold text-pink-600">Login here</Link></p>
        </form>
    </div>
    


    </>)
}

export default Signup