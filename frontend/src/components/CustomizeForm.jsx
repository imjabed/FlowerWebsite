import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function CustomizeForm(){
    const [flowerCount, setflowerCount] = useState(5);
    const [flowerColor, setflowerColor] = useState([]);
    const [wrapperColor, setwrapperColor] = useState('');
    const [selected, setSelected] = useState(false)
    const [selectedDecorations, setSelectedDecorations] = useState([]);
    const [total, setTotal] = useState(0)

    const flowerOptions = ['Red', 'Black', 'Pink'];
    const wrapperOptions = ['Red Wrapper', 'Black Wrapper', 'Pink Wrapper'];
    const decorationOptions = [
        { name: 'glitter', price: 10 },
        { name: 'butterfly stickers', price: 15 },
        { name: 'pearls', price: 20 },
        { name: 'ribbon', price: 10 }
    ];
    const toggleDecoration = (decorationName) => {
        setSelectedDecorations((prev) =>
            prev.includes(decorationName)
                ? prev.filter((item) => item !== decorationName) 
                : [...prev, decorationName]             
        );
    };
    const toggleFlowerColor = (color) => {
        setflowerColor(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color) 
                : [...prev, color]               
        );
    };
    const navigate = useNavigate();
    const handleAddToCart = async () => {
        const userId = localStorage.getItem('userId');
        const customData = {
            userId,
            flowerCount,
            flowerColor,
            wrapperColor,
            selectedDecorations,
            makingCostFree: selected,
            totalPrice: total,
        };
        if (flowerColor.length === 0) {
            alert("Please select at least one flower color.");
            return; }
        if (!wrapperColor) {
        alert("Please select a wrapper color.");
        return;
        }
        if (!selected) {
            const confirmProceed = window.confirm("Are you sure you want to miss ₹99 off?");
            if (!confirmProceed) return;
        }


        try {
            await axios.post('http://localhost:5678/api/cart/custom', customData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            });
            alert('Custom bouquet added to cart!');
            console.log("Sending customData to cart:", customData);
            navigate('/orderpage', {
                state: {
                    items: [customData],
                    totalAmount: total
                }
                });

        } catch (err) {
            console.error("Error adding to cart:", err);
            alert('Failed to add to cart');
        }
        };

    useEffect(()=>{
        const flowerCost = flowerCount * 30;
        const wrappersNeeded = Math.ceil(flowerCount / 5);
        const wrappercost = wrappersNeeded * 20;
        const making = selected? 0 : 99;
        const decorationCost = selectedDecorations.reduce((acc, name) => {
            const item = decorationOptions.find(d => d.name === name);
            return acc + (item ? item.price : 0);
        }, 0);
        const rawTotal = flowerCost + wrappercost + decorationCost + making + 99;
        
        setTotal(rawTotal);
    }, [flowerCount,wrapperColor, selected, selectedDecorations])

    return(
        <>
        <div className='bg-pink-200 p-10'>
            <div className='p-7 rounded-3xl max-w-xl mx-auto shadow-xl space-y-3 border-2 border-rose-300 bg-cover bg-opacity-10 '
             style={{ backgroundImage: `url('./f.jpg')`,  backgroundColor: "rgba(255, 255, 255, 0.7)", backgroundBlendMode: "overlay", }}>
                
                <h2 className="text-2xl font-extrabold text-center text-rose-700 tracking-wider">Gift Your Own Bouquet</h2>

                <div>
                    <h3 className="text-lg font-semibold text-rose-800 mb-3">How many flowers you'd like to add? 🌹</h3>
                    <div className="flex flex-wrap gap-3">
                        {[5,10,15,20,25].map(num => (
                            <button
                                key={num}
                                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 ${
                                    flowerCount === num
                                        ? 'bg-pink-500 text-white scale-105'
                                        : 'bg-white text-pink-700 border border-pink-300 hover:bg-pink-100'
                                }`}
                                onClick={() => setflowerCount(num)}
                            >
                                {num} 🌸
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-rose-800 mb-3">Flower Colours</h3>
                    <div className="flex flex-wrap gap-4">
                        {flowerOptions.map(color => (
                            <label key={color} className="inline-flex items-center gap-2 text-rose-700">
                                <input
                                    type="checkbox"
                                    onChange={() => toggleFlowerColor(color)}
                                    checked={flowerColor.includes(color)}
                                    className="accent-pink-500 scale-110"
                                />
                                {color}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <select
                        value={wrapperColor}
                        onChange={(e) => setwrapperColor(e.target.value)}
                        className="w-full p-2 border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 bg-white text-rose-800"
                    >
                        <option value="">🌷 Select Wrapper</option>
                        {wrapperOptions.map(color => 
                            <option key={color} value={color}>{color}</option>
                        )}
                    </select>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-rose-800 mb-3">Making Cost</h3>
                    <div className='flex items-center justify-start gap-10'>
                        <p className="px-3 py-2 w-18 text-center rounded-full text-sm font-medium shadow-md transition-all duration-200 ">
                        <span className={`${selected ? 'line-through text-gray-400' : 'text-rose-800 font-bold'}`}>₹99</span>
                        </p>
                        <button className={`px-3 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200  w-30
                            ${selected ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-white text-pink-600 border border-pink-300 hover:bg-pink-100'}`}
                            onClick={() => setSelected(!selected)}
                        >
                            🎁 Free
                        </button>

                    </div>

                </div>

                <div>
                    <h3 className="text-lg font-semibold text-rose-800 mb-3">Extra Decorations</h3>
                    <div className="space-y-3">
                        {decorationOptions.map(({name, price}) => (
                            <label key={name} className="flex items-center gap-3 text-rose-700">
                                <input
                                    type="checkbox"
                                    checked={selectedDecorations.includes(name)}
                                    onChange={() => toggleDecoration(name)}
                                    className="accent-pink-500 scale-110"
                                />
                                <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
                                {name}
                                </span>
                                <span className="text-xs text-rose-500 ml-2">(₹{price})</span>

                            </label>
                        ))}
                    </div>
                </div>

                <div className="text-lg text-right text-rose-700 border-t pt-2 border-rose-300">
                    Regular Value : <del>₹{total+49}</del>  <br />
                    Now Only: ₹{total}
                </div>

                <div>
                    <button onClick={handleAddToCart} className='px-3 py-2 mb-2 rounded-full text-sm font-medium shadow-md transition-all duration-200  w-full cursor-pointer bg-pink-500 text-white hover:bg-pink-600'>Add to Cart</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default CustomizeForm;
