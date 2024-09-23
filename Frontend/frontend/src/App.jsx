import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import PlayStore from "./components/PlayStore/PlayStore";
import Login from "./components/Login/Login";
import Register  from "./components/Register/Register";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <Login setShowLogin={setShowLogin} /> : <></>}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register setShowLogin={setShowLogin} />} />
          <Route path="/login" element={<Login setShowLogin={setShowLogin}/>}/>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
