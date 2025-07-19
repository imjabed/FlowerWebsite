import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VerifyOtp () {
    const deployedurl = import.meta.env.VITE_BACKEND_URL;
    const localurl='http://localhost:5678';
    
    const [Otp, setOtp] = useState('')
    const Location = useLocation();
    const navigate = useNavigate();
    const email = Location.state?.email

    const [loading, setLoading] = useState(false);
    const handleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true);

        if (!email) { alert('No email found! Please signup again') 
            navigate('/signup')
            return;
        }
        try{
            const res = await axios.post(`${deployedurl}/api/auth/verify-otp`, { email, otp: Otp })

            setTimeout(() => {
                alert(res.data.message);
                navigate('/login');
            }, 600);

        }
        catch(err)
        {   
            setTimeout(() => {
            console.error(err);
            alert("OTP verification failed. Please try again.");
        }, 600); 


        }
        finally{
            setTimeout(() => {
            setLoading(false);
        }, 600); 
        }
    }  

    return(
    <>  
    <div className="flex h-screen justify-center items-center bg-gray-100">

        <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-6 bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-center font-bold text-pink-600 text-xl">Verify Your Email Address</h2>
            <p className="text-center text-sm text-pink-900">We have sent you an OTP of 6 digits to your email. Please enter the otp to complete verification</p>
            <input type="number" max={999999} placeholder="Please enter 6 digit otp" onChange={ (e)=>setOtp(e.target.value) } className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"/>
            <button type="submit" disabled={loading} className={`text-white rounded-lg py-3 transition duration-300 flex justify-center items-center gap-2 ${loading ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'}`}>
                    {loading ? (
                        <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Verifying Otp...
                        </>
                    ) : (
                        "Verify OTP"
                    )}
                </button>
        </form>
    </div>


    </>)
}

export default VerifyOtp;