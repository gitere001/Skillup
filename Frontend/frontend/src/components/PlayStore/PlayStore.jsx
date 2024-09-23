import React from 'react'
import apps from '../../assets/apps.png'
import googlep from '../../assets/googlep.png'
import './PlayStore.css'

const PlayStore = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>Donwload our app <br />Skillup</p>
        <div className="app-download-platforms"></div>
        <img src={apps} alt="" />
        <img src={googlep} alt="" />

    </div>
  )
}

export default PlayStore