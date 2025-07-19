import { useState } from "react";

function GenderToggle({ onToggle }) {
  const [isForHer, setIsForHer] = useState(true);

  const handleToggle = () => {
    const newValue = !isForHer;
    setIsForHer(newValue);
    onToggle(newValue ? "her" : "him");
  };

  return (
    <div className="flex justify-center py-6">

        <div onClick={handleToggle} className={`w-16 h-8 rounded-full flex items-center px-1 cursor-pointer transition-all duration-300 
            ${isForHer ? "bg-pink-500" : "bg-blue-500" }`}> 
        
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 
                ${ isForHer ? "translate-x-0" : "translate-x-8"}`}>
                  { isForHer ? <div className="flex justify-center items-center h-6 font-bold text-pink-600">💖</div>
                   : <div className="flex justify-center items-center  h-6 font-bold text-blue-600">💙</div> }
            </div>
        </div>
    </div>
  );
}

export default GenderToggle;
