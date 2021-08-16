import React, { useState } from "react";
import "./Home.css";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import emailjs from 'emailjs-com';
import{ init } from 'emailjs-com';
import { spreadElement } from "@babel/types";

function Home() {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    var templateParams = {
        to_name: 'vaibhav.p2305@gmail.com',
        firstname: name,
        email: email,
        phone: phone,
        message: message,
        Subject: subject,
        from_name: name,
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents default refresh by the browser
        console.log(e.target)
        init("user_XFvwYuodBRSuuvb05H3bS");
        if (name != "" && email != "" && phone != "" && message != "" && subject != ""){
            emailjs.send('service_6bg1s07', 'template_dmd5sg7', templateParams)
            .then((response) => {
                alert("Message sent, we will get back to you shortly!");
            },
            (error) => {
                alert('An error occurred, please try again.', error.text);    
            });
        } else {
            alert("Please fill all the necessary information before submitting.");
        }
        document.getElementById("row_one_input1").value = "";
        document.getElementById("row_one_input2").value = "";
        document.getElementById("second_row_first").value = "";
        document.getElementById("second_row_second").value = "";
        document.getElementById("textArea").value = "";
    };

    return (
        <div className="Home">
            <div className="bot__container">
                <div className="home__title">
                    <h2>KW Housing</h2>
                    <div className="home__subtitle">
                    <h1>Housing Marketplace for Kitchener Waterloo Region</h1>
                    <div className="buttonContainer">
                            <Button variant="contained" type="primary" onClick={() => history.push("/browse-listing")}>
                                Browse Listings
                            </Button>
                            <Button variant="contained" type="primary" onClick={() => history.push("/new-listing")}>
                                Post Listing
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="features__container">
                <div className="features">
                    <div className = "features__wrapper">
                        <h2>SEARCH</h2>
                        <img src="https://img.icons8.com/material-outlined/120/ff7700/search-property.png"/>
                        <p>Search with ease according to the: price, start term, location and more!</p>
                    </div>
                    <div className = "features__wrapper">
                        <h2>POST</h2>
                        <img src="https://img.icons8.com/material-outlined/120/ff7700/add-property.png"/>
                        <p>Post your listing with our existing template in a matter of seconds!</p>
                    </div>
                    <div className = "features__wrapper">
                        <h2>CONNECT</h2>
                        <img src="https://img.icons8.com/ios/120/ff7700/people-working-together.png"/>
                        <p>Connect with sellers through a simple click!</p>
                    </div>
                </div>
            </div>
            <div className = "contact-us__container">
                <div className = "contact-us__wrapper">
                    <div className = "contact-us">
                        <h1 >Feel free to reach out to us!</h1>
                        <hr id = "line-break"/>
                        <p>Have a question for us? Fill out our contact form and we will get back to you as soon as possible!</p>
                        <form id = "row_one">
                            <input type="text" placeholder="Name" id= "row_one_input1" onChange={e=>setName(e.target.value)}/>
                            <input type="text" placeholder="Email"  id = "row_one_input2" onChange={e=>setEmail(e.target.value)}/>
                        </form>
                        <form id = "row_one" >
                            <input id = "second_row_first" type="text" placeholder="Phone" onChange={e=>setPhone(e.target.value)}/>
                            <input type="text" placeholder="Subject"  id = "second_row_second" onChange={e=>setSubject(e.target.value)}/>
                        </form>
                        <form id = "row_one3">
                            <textarea type="text" placeholder="Message" id= "textArea" onChange={e=>setMessage(e.target.value)}/>
                        </form>
                        <Button variant="contained" color="primary" type = "submit" onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default Home;
