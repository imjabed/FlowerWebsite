import {Link, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);
  const [showmenu, setshowmenu] =useState(false)

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
      <div className="md:flex justify-around py-3 items-center bg-pink-200 ">
        <div className='flex justify-center relative'>
          <div className='text-[40px] tracking-wider md:text-2xl text-center font-bold text-pink-600 companytitle'>Mijory</div>
          <button className='absolute right-4 text-2xl font-bold text-pink-600 h-8 w-8 md:hidden' onClick={()=>setshowmenu(!showmenu)}> 
            ☰
            {/* <img src="/flowermenuicon.png" alt="flower Menu"/>  */}
          </button>
        </div>


        <div className='hidden md:flex justify-around items-center w-[500px]' >
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
        <div className='hidden md:flex'>
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


        {showmenu && (
          <div
          className={`fixed top-0 right-0 h-full w-[40vw] bg-pink-200 z-50 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
            showmenu ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setshowmenu(false)} className="text-xl text-pink-600">
              {/* <img src="/flowermenuicon.png" alt="flower Menu"/>  */}
              ✖

            </button>
          </div>
          <div className="flex flex-col items-start px-6 gap-4">
            <Link to="/" onClick={() => setshowmenu(false)} className="bg-pink-300 w-full text-center  hover:text-pink-900">Home</Link>
            <Link to="/products" onClick={() => setshowmenu(false)} className="bg-pink-300 w-full text-center hover:text-pink-900">Shop</Link>
            <Link to="/about" onClick={() => setshowmenu(false)} className="bg-pink-300 w-full text-center text-[15px] hover:text-pink-900">About Us</Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setshowmenu(false)} className="hover:text-pink-900">Hi, {user.name}</Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setshowmenu(false);
                  }}
                  className="text-red-500 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/signup" onClick={() => setshowmenu(false)} className="hover:text-pink-900">Sign Up</Link>
            )}
          </div>
        </div>
        )}





      </div>
    </>
  );
}

export default Navbar;
