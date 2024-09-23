import React from "react"
import "./about.css"
import book2 from '../../../public/ebok.jpg'
import { homeAbout } from '../../../data'
import Wrapper from '../../components/Wrapper/Wrapper'

const AboutCard = () => {
  return (
    <>
      <section className='aboutHome'>
        <div className='container flexSB'>
          <div className='left row'>
            <img src={book2} alt='' />
          </div>
          <div className='right row'>
         
            <div className='items'>
              {homeAbout.map((val) => {
                return (
                  <div className='item flexSB'>
                    <div className='img'>
                      <img src={val.cover} alt='' />
                    </div>
                    <div className='text'>
                      <h2>{val.title}</h2>
                      <p>{val.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutCard