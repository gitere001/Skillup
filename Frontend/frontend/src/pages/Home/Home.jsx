import React from 'react'
import Header from '../../components/Header/Header'
import './Home.css'
import Wrapper from '../../components/Wrapper/Wrapper'
import Choice from '../../components/Choice/Choice'
import PlayStore from '../../components/PlayStore/PlayStore'

const Home = () => {
  return (
    <div className='Home'>
        <Header/>
       
        <Wrapper/>
        <br />
        <Choice/>
        <PlayStore/>
    </div>
  )
}

export default Home