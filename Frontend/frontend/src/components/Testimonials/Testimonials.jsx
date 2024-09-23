import React from 'react'
import './Testimonials.css'

const Testimonials = () => {

    const slider = useRef();
    let tx = 0;

const slideForward = ()=> {
    if(tx > -50){
        tx -= 25;
    }
    slider.current.style.transform =   `translateX(${tx}%)`
}

const slideBackward = ()=> {
    if(tx < 0){
        tx -= 25;
    }
    slider.current.style.transform =   `translateX(${tx}%)`

}


  return (
    <div className='testimonials'>
        <img src="" alt="" onClick={slideForward} className='next-btn' />
        <img src="next" alt="" className='next-btn' />
        <img src="back" alt="" className='next-btn' />
        <div className="slider">
            <ul>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src="" alt="" />
                            <div>
                                <h3>something</h3>
                                <span>somethig ggg</span>
                            </div>
                        </div>
                        <p>
                            I got informative details
                        </p>
                    </div>
                </li>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src="" alt="" />
                            <div>
                                <h3>something</h3>
                                <span>somethig ggg</span>
                            </div>
                        </div>
                        <p>
                            I got informative details
                        </p>
                    </div>
                </li>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src="" alt="" />
                            <div>
                                <h3>something</h3>
                                <span>somethig ggg</span>
                            </div>
                        </div>
                        <p>
                            I got informative details
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Testimonials