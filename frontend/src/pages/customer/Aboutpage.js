import React from 'react';
import './Aboutpage.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-container">
          <div className="about-hero-content">
            <div className="about-label">About</div>
            <h1>We care for pets and the people who love them</h1>
            <p>From wellness checkups to spa days and a curated shop, our mission is to make pet care simple, joyful, and trustworthy.</p>
            <button className="about-btn">
              <i className="bi bi-book"></i>
              Learn about our mission
            </button>
          </div>
          <div className="about-hero-images">
            <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=250&fit=crop" alt="Pet 1" />
            <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=250&fit=crop" alt="Pet 2" />
            <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=250&fit=crop" alt="Pet 3" />
            <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=250&fit=crop" alt="Pet 4" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="about-container-inner">
          <h2 className="about-section-title">Our Mission</h2>
          <div className="about-mission-grid">
            <div className="about-mission-card">
              <div className="about-mission-icon">❤️</div>
              <h3>Compassionate Care</h3>
              <p>Professional veterinary services with gentle handling and clear communication.</p>
            </div>
            <div className="about-mission-card">
              <div className="about-mission-icon">✨</div>
              <h3>Delightful Experiences</h3>
              <p>From booking to checkout, we design every step to be easy and reassuring.</p>
            </div>
            <div className="about-mission-card">
              <div className="about-mission-icon">🛒</div>
              <h3>Curated Products</h3>
              <p>Healthy food, safe toys, and essentials recommended by our veterinarian.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-container-inner">
          <h2 className="about-section-title">Our Story</h2>
          <div className="about-timeline">
            <div className="about-timeline-row">
              <div className="about-timeline-year">2018</div>
              <div className="about-timeline-text">Opened our first boutique clinic and shop with a small team and big dreams.</div>
            </div>
            <div className="about-timeline-row">
              <div className="about-timeline-year">2020</div>
              <div className="about-timeline-text">Launched online booking, chat with vets, and home delivery for essentials.</div>
            </div>
            <div className="about-timeline-row">
              <div className="about-timeline-year">2023</div>
              <div className="about-timeline-text">Expanded services to include spa, grooming, and full vaccination programs.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="about-container-inner">
          <h2 className="about-section-title">Our Values</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon">🛡️</div>
              <h3>Safety First</h3>
              <p>Strict hygiene, vetted products, and medical standards you can trust.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">❤️</div>
              <h3>Empathy</h3>
              <p>We treat every pet like family and every owner like a partner.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">⏱️</div>
              <h3>Reliability</h3>
              <p>Transparent pricing, punctual appointments, and proactive reminders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="about-container-inner">
          <h2 className="about-section-title">Meet the Team</h2>
          <div className="about-team-grid">
            <div className="about-team-card">
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face" alt="Dr. Nguyen" className="about-team-avatar" />
              <div className="about-team-name">Dr. Nguyen</div>
              <div className="about-team-role">Chief Veterinarian</div>
              <button className="about-team-btn">
                <i className="bi bi-person"></i>
                View profile
              </button>
            </div>
            <div className="about-team-card">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" alt="Alex Kim" className="about-team-avatar" />
              <div className="about-team-name">Alex Kim</div>
              <div className="about-team-role">Grooming Lead</div>
              <button className="about-team-btn">
                <i className="bi bi-scissors"></i>
                View profile
              </button>
            </div>
            <div className="about-team-card">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" alt="Priya Patel" className="about-team-avatar" />
              <div className="about-team-name">Priya Patel</div>
              <div className="about-team-role">Customer Success</div>
              <button className="about-team-btn">
                <i className="bi bi-chat"></i>
                Message
              </button>
            </div>
            <div className="about-team-card">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Marco Rossi" className="about-team-avatar" />
              <div className="about-team-name">Marco Rossi</div>
              <div className="about-team-role">Operations</div>
              <button className="about-team-btn">
                <i className="bi bi-info-circle"></i>
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-container-inner">
          <h2>Ready to get started?</h2>
          <p>Book an appointment or explore our shop curated by vets.</p>
        </div>
      </section>
    </div>
  );
};

export default About;