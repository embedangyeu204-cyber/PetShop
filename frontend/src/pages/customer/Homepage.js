import React, { useState } from 'react';
import './Homepage.css';
import { FaGlobe } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // 👉 để điều hướng

const PetShop = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate("/customer-login"); // 👉 chuyển đến trang login
  };

  const pets = [
    {
      id: 1,
      name: 'Persian Cat',
      category: 'cats',
      description: 'Persians have long, silky coats and sweet, gentle temperaments.',
      image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=300&fit=crop',
      location: "Iran",
    },
    {
      id: 2,
      name: 'Dachshund Dog',
      category: 'dogs',
      description: 'Known for their long bodies and short legs, Dachshunds are loyal companions.',
      image: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400&h=300&fit=crop',
      location: "Germany",
    },
    {
      id: 3,
      name: 'Munchkin Cat',
      category: 'cats',
      description: 'Friendly, smart, and gentle — perfect for families.',
      image: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1c0c7?w=400&h=300&fit=crop',
      location: "USA",
    },
    {
      id: 4,
      name: 'Pug Dog',
      category: 'dogs',
      description: 'Charming and playful with a wrinkled face and curled tail.',
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop',
      location: "Mexico",
    }
  ];

  const filteredPets = activeTab === 'all'
    ? pets
    : pets.filter(pet => pet.category === activeTab);

  return (
    <div className="pet-shop">
      {/* 🐶 Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-label">Welcome to the website</p>
            <h1 className="hero-title">Care your pet with all love</h1>
            <p className="hero-description">
              Book exams, grooming, and vaccinations. Shop toys and food tailored to your pet.
            </p>

            <button className="btn-primary" onClick={handleBookingClick}>
              📅 Book a day to take care of your pet now
            </button>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=600&fit=crop"
              alt="Dog and cat at window"
            />
          </div>
        </div>
      </section>

      {/* 🏢 Our Company Section */}
      <section className="company-section">
        <div className="company-container">
          <h2 className="section-title">Our Company</h2>
          <div className="company-layout">
            <div className="company-info">
              <div className="info-block">
                <h3 className="info-title">About us</h3>
                <p className="info-text">
                  With years of experience and a qualified veterinary team, we protect your pets 
                  and guide nutrition for their care.
                </p>
              </div>
              
              <div className="info-block">
                <h3 className="info-title">About consulting</h3>
                <p className="info-text">
                  Different species need different environments. Our experts provide 
                  personalized plans to ensure your pet's well-being.
                </p>
              </div>

              <div className="service-cards">
                <div className="service-card">
                  <h4>Health check for your pet</h4>
                  <p>Regular checkups by our veterinary team.</p>
                  <div className="service-image">
                    <img 
                      src="https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=200&h=150&fit=crop" 
                      alt="Health check" 
                    />
                  </div>
                  <button className="btn-secondary">Read more</button>
                </div>
                
                <div className="service-card">
                  <h4>Spa</h4>
                  <p>Grooming and pet-friendly spa care.</p>
                  <div className="service-image">
                    <img 
                      src="https://images.unsplash.com/photo-1600077106724-946750eeaf3c?w=200&h=150&fit=crop" 
                      alt="Pet spa" 
                    />
                  </div>
                  <button className="btn-secondary">Read more</button>
                </div>
              </div>
            </div>

            <div className="company-image">
              <img 
                src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&h=700&fit=crop" 
                alt="Two cute cats" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🐾 Discovery Section */}
      <section className="discovery-section">
        <div className="discovery-container">
          <h2 className="section-title">Discovery</h2>
          
          {/* Tabs */}
          <div className="discovery-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`tab-btn ${activeTab === 'dogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('dogs')}
            >
              Dogs
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cats' ? 'active' : ''}`}
              onClick={() => setActiveTab('cats')}
            >
              Cats
            </button>
          </div>

          {/* Pet Cards */}
          <div className="discovery-grid">
            {filteredPets.map(pet => (
              <div key={pet.id} className="discovery-card">
                <div className="card-image">
                  <img src={pet.image} alt={pet.name} />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{pet.name}</h3>

                  <div className="card-location">
                    <FaGlobe className="location-icon" /> {pet.location}
                  </div>

                  <p className="card-text">{pet.description}</p>
                  <div className="card-actions">
                    <button className="btn-text">Learn More</button>
                    <button className="btn-text">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetShop;
