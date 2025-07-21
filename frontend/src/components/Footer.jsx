
function Footer(){
    return(
        <>
            <div className="flex justify-evenly items-center p-10">

                <div className="flex flex-col items-center gap-4">
                    <img src="./logo.png" alt="" height={'100px'}  width={'100px'} />
                    Mijory
                </div>

                <div>
                    <ul>
                        <li>Shop Now</li>
                        <li>Customize Order</li>
                        <li>Career with us</li>
                        <li>About Us</li>
                    </ul>
                </div>

                <div>
                    <ul>
                        <li>Delivery Policy</li>
                        <li>Return Policy</li>
                        <li>Terms and Conditions</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                <div> 
                    <img src="./instagramLogo" alt="Instagram" />
                    <img src="./instagramLogo" alt="Website" />
                    <img src="./instagramLogo" alt="Whatsapp Store" />

                </div>
            </div>
        </>
    )
}

export default Footer;