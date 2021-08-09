import React from 'react';
import "./Footer.css";

function Footer() {
    return (
        <div className = "footer">
            <hr id = "footer__divider"/>
            {/* Social thing */}
            <div className="footer-content">
                <div className="footer-section">
                    <img src="https://img.icons8.com/ios/80/ff7700/phone.png"/>
                    <h3 id = "footerInfo">(647) 545 9580</h3>
                </div>
                <div className="footer-section">
                    <img src="https://img.icons8.com/ios/80/ff7700/envelope.png"/>
                    <h3 id = "footerInfo">kwhousing@gmail.com</h3>
                </div>
                <div className="footer-section">
                    <img src="https://img.icons8.com/ios/80/ff7700/address.png"/>
                    <h3 id = "footerInfo"> 75 University Ave W, Waterloo, ON N2L 3C5</h3>
                </div>
            </div>
            {/* Instagram icons and copyright */}
            <div className="footer-socials">
                <img src="https://img.icons8.com/ios/30/ff7700/facebook.png"/>
                <spreadElement>   </spreadElement>
                <img src="https://img.icons8.com/ios/30/ff7700/instagram.png"/>
                <spreadElement>   </spreadElement>
                <img src="https://img.icons8.com/ios/30/ff7700/twitter.png"/>
                <spreadElement>   </spreadElement>
                <img src="https://img.icons8.com/ios/30/ff7700/youtube.png"/>
            </div>
            <div className="footer-bottom">
                &copy; kwhousing.ca | Designed by CP317 Team 3
            </div>
        </div>
    )
}

export default Footer;
