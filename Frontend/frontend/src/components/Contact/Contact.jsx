import React from 'react'
import './Contact.css'

const Contact = () => {
  return (
    <div className='contact'>
        <div className="contact-col">
            <h3>Send us a message <img src="" alt="" /></h3>
            <p>Feel free to reach out through contact form or find our contact
                information below, Your feedback, questions, and suggestions are
                important to us as wee strive to provide exceptional service to our platform
            </p>
            <ul>
                <li><img src="{mail_icon}" alt="" />Contact@GreatStack.dev</li>
                <li><img src="{phone_icon}" alt="" />+254700000000</li>
                <li><img src="{location_icon}" alt="" />Nairobi</li>
            </ul>
        </div>
        <div className="contact-col">
            <form action="">
                <label htmlFor="">Your name</label>
                <input type="text" name='name' placeholder='Enter your name' required />
                <label htmlFor="">Phone Number</label>
                <input type="tel" name='phone' placeholder='Enter your mobile number' required/>
                <label htmlFor="">Write your messages here</label>
                <textarea name="message" id="" rows="6" placeholder='Enter your message' required>

                </textarea>
                <button type='submit' className='btn dark-btn'>
                    Submit now
                    <img src={white_arrow} alt=""/>
                </button>
            </form>
            <span>{result}</span>
        </div>
    </div>
  )
}

export default Contact