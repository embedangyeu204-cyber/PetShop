import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Servicepage.css';

export default function ServicePage() {
  return (
    <div className="service-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-label">Services</div>
            <h1 className="hero-title">Everything your pet needs, in one place</h1>
            <p className="hero-description">
              Book vet visits, grooming, vaccinations, and more. Simple scheduling, 
              transparent pricing, and caring professionals.
            </p>
            <button className="btn-appointment">
              <i className="bi bi-calendar"></i>
              Book an appointment
            </button>
          </div>
          
          <div className="hero-images">
            <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=350&fit=crop" alt="Pet grooming" />
            <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=350&fit=crop" alt="Dog" />
            <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=350&fit=crop" alt="Vet consultation" />
            <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=350&fit=crop" alt="Cat" />
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Popular Services</h2>
          
          <div className="services-grid">
            {/* Wellness Checkup */}
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&h=300&fit=crop" alt="Wellness Checkup" />
              <div className="service-card-content">
                <div className="service-header">
                  <i className="bi bi-check-circle service-icon"></i>
                  <h3 className="service-title">Wellness Checkup</h3>
                </div>
                <div className="service-info">30-45 min&nbsp;&nbsp;&nbsp;From $49</div>
                <div className="service-actions">
                  <button className="btn-outline">Details</button>
                  <button className="btn-primary">Book</button>
                </div>
              </div>
            </div>

            {/* Grooming & Spa */}
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=300&fit=crop" alt="Grooming & Spa" />
              <div className="service-card-content">
                <div className="service-header">
                  <i className="bi bi-scissors service-icon"></i>
                  <h3 className="service-title">Grooming & Spa</h3>
                </div>
                <div className="service-info">60-90 min&nbsp;&nbsp;&nbsp;From $39</div>
                <div className="service-actions">
                  <button className="btn-outline">Details</button>
                  <button className="btn-primary">Book</button>
                </div>
              </div>
            </div>

            {/* Vaccinations */}
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&h=300&fit=crop" alt="Vaccinations" />
              <div className="service-card-content">
                <div className="service-header">
                  <i className="bi bi-heart-pulse service-icon"></i>
                  <h3 className="service-title">Vaccinations</h3>
                </div>
                <div className="service-info">15-30 min&nbsp;&nbsp;&nbsp;From $29</div>
                <div className="service-actions">
                  <button className="btn-outline">Details</button>
                  <button className="btn-primary">Book</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Booking Works */}
      <section className="section section-white">
        <div className="container">
          <h2 className="section-title">How Booking Works</h2>
          
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">
                <i className="bi bi-clipboard-check"></i>
              </div>
              <h3 className="step-title">Choose a service</h3>
              <p className="step-description">
                Select wellness, grooming, vaccinations, or training
              </p>
            </div>

            <div className="step">
              <div className="step-icon">
                <i className="bi bi-calendar-event"></i>
              </div>
              <h3 className="step-title">Pick date & time</h3>
              <p className="step-description">
                See real-time availability and duration
              </p>
            </div>

            <div className="step">
              <div className="step-icon">
                <i className="bi bi-person-plus"></i>
              </div>
              <h3 className="step-title">Assign a pet</h3>
              <p className="step-description">
                Attach an existing pet or add a new one in seconds
              </p>
            </div>

            <div className="step">
              <div className="step-icon">
                <i className="bi bi-credit-card"></i>
              </div>
              <h3 className="step-title">Confirm & pay</h3>
              <p className="step-description">
                Instant confirmation and reminders before your visit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Veterinarians */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Meet Our Veterinarians</h2>
          
          <div className="vets-grid">
            {/* Dr. Lee */}
            <div className="vet-card">
              <div className="vet-profile">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop" alt="Dr. Lee" className="vet-avatar" />
                <div>
                  <div className="vet-name">Dr. Lee</div>
                  <div className="vet-rating">⭐ 4.9 • Canine specialist</div>
                </div>
              </div>
              <div className="vet-actions">
                <button className="btn-outline">
                  <i className="bi bi-chat"></i>
                  Ask a question
                </button>
                <button className="btn-primary">Book with Dr. Lee</button>
              </div>
            </div>

            {/* Dr. Gomez */}
            <div className="vet-card">
              <div className="vet-profile">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" alt="Dr. Gomez" className="vet-avatar" />
                <div>
                  <div className="vet-name">Dr. Gomez</div>
                  <div className="vet-rating">⭐ 4.9 • Feline care</div>
                </div>
              </div>
              <div className="vet-actions">
                <button className="btn-outline">
                  <i className="bi bi-chat"></i>
                  Ask a question
                </button>
                <button className="btn-primary">Book with Dr. Gomez</button>
              </div>
            </div>

            {/* Dr. Patel */}
            <div className="vet-card">
              <div className="vet-profile">
                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop" alt="Dr. Patel" className="vet-avatar" />
                <div>
                  <div className="vet-name">Dr. Patel</div>
                  <div className="vet-rating">⭐ 4.8 • Surgery & rehab</div>
                </div>
              </div>
              <div className="vet-actions">
                <button className="btn-outline">
                  <i className="bi bi-chat"></i>
                  Ask a question
                </button>
                <button className="btn-primary">Book with Dr. Patel</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <div className="container">
          <h2>Ready to book?</h2>
          <p>Pick a service and secure your spot in under a minute.</p>
        </div>
      </section>
    </div>
  );
}