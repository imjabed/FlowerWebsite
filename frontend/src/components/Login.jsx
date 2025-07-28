import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import axios from "axios"


function Login(){
    const deployedurl = import.meta.env.VITE_BACKEND_URL;
    const localurl='http://localhost:5678';
    const [formData,setFormdata] = useState({})
    const navigate = useNavigate()
    const handleChange = (e) =>{ setFormdata({...formData, [e.target.name]:e.target.value})}
    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${deployedurl}/api/auth/login`, formData);
            localStorage.setItem("user", JSON.stringify(res.data.user)); 
            localStorage.setItem("userId", res.data.user.id);          
            localStorage.setItem("token", res.data.token);

            alert('Login Successful');
            navigate('/');
        } catch(err) {
            console.error(err);
            alert('Login Failed');
        }
    }

    return(
        <>  
        <div className="flex h-screen justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-6 bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md">
                <h2 className="text-2xl text-center font-bold text-pink-600">Login</h2>
                <input type="email" placeholder="Enter email address" name="email" onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"/>
                <input type="password" placeholder="Enter password" name="password" onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"/>
                <button type="submit" className="text-white bg-pink-600 rounded-lg py-3 hover:bg-pink-700 transition duration-300 cursor-pointer">Login</button>
                <p className="text-sm"> Don't have an account? <Link to='/signup' className="font-bold text-pink-600">Sign up here</Link> </p>

            </form>
        </div>

        </>
    )
}

export default Login