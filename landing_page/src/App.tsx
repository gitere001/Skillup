import React, { useState } from 'react';
import { BookOpen, Users, Layout, ChevronRight, Menu, X, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-[#1A1A1A] px-6 py-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold">SkillUp</span>
            <span className="text-[#FF6B6B] text-2xl font-bold">KE</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#courses" className="text-gray-300 hover:text-white transition-colors">Featured Courses</a>
            <button className="px-6 py-2 bg-[#FF6B6B] text-white rounded-full font-semibold hover:bg-[#ff5252] transition-colors">
              Login
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-[#1A1A1A] py-4 px-6 space-y-4 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <a href="#" className="block text-gray-300 hover:text-white transition-colors">Home</a>
          <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About</a>
          <a href="#courses" className="block text-gray-300 hover:text-white transition-colors">Featured Courses</a>
          <button className="w-full px-6 py-2 bg-[#FF6B6B] text-white rounded-full font-semibold hover:bg-[#ff5252] transition-colors">
            Login
          </button>
        </div>

        <div className="h-1 w-full absolute bottom-0 left-0 bg-gradient-to-r from-[#BE0027] via-black to-[#00A562] animate-gradient"></div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
                Empower Your Future<br />
                in Kenya's Digital Age
              </h1>
              <p className="text-xl text-gray-600">
                Connect with Kenya's top experts or share your expertise with eager learners.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-[#FF6B6B] text-white rounded-full font-semibold hover:bg-[#ff5252] transition-colors flex items-center justify-center group">
                Register as Expert
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center group">
                Start Learning
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative">
            <img
              src="../hero-image.webp"
              alt="Tech education in Kenya"
              className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform">
            <Users className="w-12 h-12 text-[#FF6B6B] mb-4" />
            <h3 className="text-4xl font-bold text-[#1A1A1A]">500+</h3>
            <p className="text-gray-600 mt-2">Local Experts</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform">
            <BookOpen className="w-12 h-12 text-[#FF6B6B] mb-4" />
            <h3 className="text-4xl font-bold text-[#1A1A1A]">1000+</h3>
            <p className="text-gray-600 mt-2">Active Learners</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform">
            <Layout className="w-12 h-12 text-[#FF6B6B] mb-4" />
            <h3 className="text-4xl font-bold text-[#1A1A1A]">50+</h3>
            <p className="text-gray-600 mt-2">Categories</p>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">About SkillUpKE</h2>
            <p className="text-gray-600 text-lg">
              We're bridging the gap between Kenya's top industry experts and ambitious learners.
              Our platform facilitates knowledge transfer, skill development, and professional growth
              in the digital age, contributing to Kenya's technological advancement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <img
              src="https://plus.unsplash.com/premium_photo-1707155466311-3083ff39a3ab?auto=format&fit=crop&q=80"
              alt="Collaborative learning"
              className="rounded-2xl shadow-lg h-[400px] object-cover"
            />
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To empower Kenyans with the digital skills needed for the future workforce,
                  creating opportunities for both learners and experts to grow together.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To become Kenya's leading platform for digital skills development,
                  fostering a community of lifelong learners and expert mentors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Courses Section */}
        <div id="courses" className="py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-16">Featured Courses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Web Development",
                description: "Master modern web development with practical projects",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
                price: "KSH 15,000"
              },
              {
                title: "Data Science",
                description: "Learn data analysis and machine learning fundamentals",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
                price: "KSH 20,000"
              },
              {
                title: "Digital Marketing",
                description: "Develop effective digital marketing strategies",
                image: "../digital-marketing.jpg",
                price: "KSH 12,000"
              }
            ].map((course, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#FF6B6B] font-semibold">{course.price}</span>
                    <button className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-sm hover:bg-gray-800 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <span className="text-white text-2xl font-bold">SkillUp</span>
                <span className="text-[#FF6B6B] text-2xl font-bold">KE</span>
              </div>
              <p className="text-gray-400">
                Empowering Kenyans with digital skills for a better future.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#courses" className="text-gray-400 hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Become an Expert</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-[#FF6B6B]" />
                  <span className="text-gray-400">info@skillupke.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-[#FF6B6B]" />
                  <span className="text-gray-400">+254 700 000 000</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[#FF6B6B]" />
                  <span className="text-gray-400">Nairobi, Kenya</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SkillUpKE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;