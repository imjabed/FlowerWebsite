import {Link, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HomeIcon, ShoppingBagIcon, UsersIcon, ArrowRightOnRectangleIcon, ClipboardDocumentListIcon, UserCircleIcon,EnvelopeIcon } from "@heroicons/react/24/outline";

<HomeIcon className="h-6 w-6 text-white" />

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
          <div className={`fixed top-0 right-0 h-full w-[60vw] bg-pink-200 z-50 shadow-xl flex flex-col md:hidden ${
            showmenu ? 'translate-x-0' : 'translate-x-full'
          }`}>

          <div className="flex justify-end p-4">
            <button onClick={() => setshowmenu(false)} className="text-xl text-pink-600">
              {/* <img src="/flowermenuicon.png" alt="flower Menu"/>  */}
              ✖
            </button>
          </div>

          <div className="flex flex-col items-start px-6 gap-4">
            {user ? (
                      <div>
                      <div className='flex justify-between items-center'> 
                        <Link to='/profile' className='flex gap-3'>
                          <span className='text-pink-700 font-semibold text-[18px] '>Hi, {user.name.split(' ')} </span>
                          <img src={ user?.profilePicture ? `${user.profilePicture}?v=${user.updatedAt || Date.now()}` : "/userIcon.png"}
                            alt="UserIcon" className='rounded-full h-7 w-7 object-cover border border-black/40' /> 
                        </Link> 

                      </div>
                      <div className='text-pink-700 font-semibold text-[14px]'>{user.email} </div>
                    </div>
                      
                     ) 
                  : ( <Link to='/signup'>Sign up</Link>)}
          </div>

          <hr className="mx-4 my-4 text-pink-600" />

          <div className='flex flex-col gap-5 mt-4'>

            <div className='flex gap-2 mx-10'>
              <HomeIcon className="h-6 w-6 text-pink-500" />
              <Link to="/" onClick={() => setshowmenu(false)} className="text-pink-600 text-[18px]"> Home</Link>
            </div>
            <div className='flex gap-2 mx-10'>
              <UserCircleIcon className="h-6 w-6 text-pink-500" />
              <Link to="/about" onClick={() => setshowmenu(false)} className="text-pink-600 text-[18px]">My Profile</Link>
            </div>
            <div className='flex gap-2 mx-10'>
              <ClipboardDocumentListIcon  className="h-6 w-6 text-pink-500" />
              <Link to="/products" onClick={() => setshowmenu(false)} className="text-pink-600 text-[18px]">My Orders</Link>
            </div>

            
            <div className='flex gap-2 mx-10'>
              <ShoppingBagIcon className="h-6 w-6 text-pink-500" />
              <Link to="/products" onClick={() => setshowmenu(false)} className="text-pink-600 text-[18px]">Products</Link>
            </div>
            <div className='flex gap-2 mx-10'>
              <EnvelopeIcon  className="h-6 w-6 text-pink-500" />
              <Link to="/about" onClick={() => setshowmenu(false)} className="text-pink-600 text-[18px]">Contact Us</Link>
            </div>

            <div className='flex gap-2 mx-10'>
              <UsersIcon className="h-6 w-6 text-pink-500" />
              <Link to="/about" onClick={() => setshowmenu(false)} className="text-pink-600 text-[18px]">About Us</Link>
            </div>
          </div>

          <hr className="mx-4 my-4 mt-77 text-pink-600" />

          <div className='flex items-center gap-2 mx-10'>
            <ArrowRightOnRectangleIcon  className="h-6 w-6 text-pink" />      
            <button onClick={handleLogout} className="text-red-400 font-bold text-[20px]">Logout</button>
          </div>


          </div>
        )}





      </div>
    </>
  );
}

export default Navbar;
