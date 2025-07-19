import {Link, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    window.addEventListener('user-updated', updateUser);
    updateUser();
    return () => window.removeEventListener('user-updated', updateUser);
  }, []);
  const handleLogout = () =>{
    localStorage.removeItem('user')
    setUser(null);
    navigate('/')
    
  }
  return (
    <>
      <div className="flex justify-around py-3 items-center bg-pink-200">
        
        <div className='text-2xl text-center font-bold text-pink-600'>Ribbons Flower</div>

        <div className='flex justify-around items-center w-[500px]'>
          <Link to="/" className="hover:text-pink-900 transition duration-200 relative group"> Home
            <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-pink-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/products" className="hover:text-pink-900 transition duration-200 relative group">
            Shop
            <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-pink-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/about" className="hover:text-pink-900 transition duration-200 relative group">
            About Us
            <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-pink-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        <div className='flex'>
          <button className=''>
            {user ? (
                      <span className='flex'> 
                        <Link to='/profile' className='flex gap-3'>
                          <span className='text-pink-700 font-semibold cursor-pointer'>Hi, {user.name} </span>
                          <img src={user?.profilePicture? user.profilePicture : "/userIcon.png"} alt="UserIcon" className='rounded-full h-8 w-8 object-cover' /> 
                        </Link> 
                        <span> <button onClick={handleLogout} className="text-red-400 font-bold cursor-pointer ml-5 hover:text-red-800 transition duration-300">Logout</button></span>
                      </span>
                     ) 
                  : ( <Link to='/signup'>Sign up</Link>)}
          </button>
        </div>

      </div>



    </>
  );
}

export default Navbar;
