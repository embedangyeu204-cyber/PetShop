import React, { useState } from 'react';
import './Discoverypage.css';

const Discovery = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="discovery-container">
      {/* Hero Section */}
      <section className="discovery-hero">
        <div className="discovery-hero-container">
          <div className="discovery-hero-content">
            <div className="discovery-label">Discovery</div>
            <h1>Explore pet care tips, guides, and community picks</h1>
            <p>Find expert articles, products we love, and nearby experiences to keep your pets happy and healthy.</p>
            
            <div className="discovery-tabs">
              <button 
                className={`discovery-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <i className="bi bi-grid-3x3-gap"></i> All
              </button>
              <button 
                className={`discovery-tab ${activeTab === 'guides' ? 'active' : ''}`}
                onClick={() => setActiveTab('guides')}
              >
                <i className="bi bi-book"></i> Guides
              </button>
              <button 
                className={`discovery-tab ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <i className="bi bi-bag"></i> Products
              </button>
              <button 
                className={`discovery-tab ${activeTab === 'nearby' ? 'active' : ''}`}
                onClick={() => setActiveTab('nearby')}
              >
                <i className="bi bi-geo-alt"></i> Nearby
              </button>
            </div>
          </div>
          
          <div className="discovery-hero-images">
            <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=250&fit=crop" alt="Pet 1" />
            <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=250&fit=crop" alt="Pet 2" />
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=250&fit=crop" alt="Pet 3" />
            <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=250&fit=crop" alt="Pet 4" />
          </div>
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="discovery-section">
        <div className="discovery-container-inner">
          <h2 className="discovery-section-title">Editor's Picks</h2>
          
          <div className="discovery-picks-grid">
            <div className="discovery-pick-card">
              <div className="discovery-pick-header">
                <i className="bi bi-patch-check"></i>
                <span>Best Chews for Teething Pups</span>
              </div>
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop" alt="Teething pups" />
              <div className="discovery-pick-info">
                <span className="pick-time">5 min read</span>
                <span className="pick-tag">Updated weekly</span>
              </div>
              <button className="discovery-pick-btn">
                <i className="bi bi-book"></i> Read guide
              </button>
            </div>

            <div className="discovery-pick-card">
              <div className="discovery-pick-header">
                <i className="bi bi-scissors"></i>
                <span>Home Grooming Essentials</span>
              </div>
              <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop" alt="Grooming" />
              <div className="discovery-pick-info">
                <span className="pick-time">7 min read</span>
                <span className="pick-tag">Checklist</span>
              </div>
              <button className="discovery-pick-btn">
                <i className="bi bi-book"></i> Read guide
              </button>
            </div>

            <div className="discovery-pick-card">
              <div className="discovery-pick-header">
                <i className="bi bi-heart-pulse"></i>
                <span>Vaccination Timeline by Age</span>
              </div>
              <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=250&fit=crop" alt="Vaccination" />
              <div className="discovery-pick-info">
                <span className="pick-time">3 min read</span>
                <span className="pick-tag">Vet verified</span>
              </div>
              <button className="discovery-pick-btn">
                <i className="bi bi-calendar"></i> View timeline
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Pet-Friendly Spots */}
      <section className="discovery-section discovery-section-gray">
        <div className="discovery-container-inner">
          <h2 className="discovery-section-title">Nearby Pet-Friendly Spots</h2>
          
          <div className="discovery-nearby-grid">
            <div className="discovery-map-card">
              <div className="discovery-map-header">
                <i className="bi bi-map"></i>
                <span>Explore the map</span>
              </div>
              <div className="discovery-map-placeholder">
                <img src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.4194,37.7749,12,0/600x400@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazk4M2RmMHIwMDAwM29xZ2R4ZGFiNGVmIn0.example" alt="Map" />
              </div>
              <div className="discovery-map-tags">Popular: Parks, Cafés, Clinics</div>
              <div className="discovery-map-actions">
                <button className="discovery-map-btn-outline">
                  <i className="bi bi-geo-alt"></i> View details
                </button>
                <button className="discovery-map-btn-primary">
                  <i className="bi bi-arrow-right"></i> Get directions
                </button>
              </div>
            </div>

            <div className="discovery-parks-card">
              <div className="discovery-parks-header">
                <i className="bi bi-fire"></i>
                <span>This week's top parks</span>
              </div>
              <div className="discovery-parks-list">
                <div className="discovery-park-item">
                  <div className="discovery-park-icon">
                    <i className="bi bi-tree"></i>
                  </div>
                  <div className="discovery-park-info">
                    <div className="discovery-park-name">Willow Creek Dog Park</div>
                    <div className="discovery-park-meta">Fenced • Water stations • 1.2 mi</div>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </div>

                <div className="discovery-park-item">
                  <div className="discovery-park-icon">
                    <i className="bi bi-cup-hot"></i>
                  </div>
                  <div className="discovery-park-info">
                    <div className="discovery-park-name">Paws & Beans Café</div>
                    <div className="discovery-park-meta">Pet-friendly patio • 0.5 mi</div>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </div>

                <div className="discovery-park-item">
                  <div className="discovery-park-icon">
                    <i className="bi bi-hospital"></i>
                  </div>
                  <div className="discovery-park-info">
                    <div className="discovery-park-name">CityVet 24/7 Clinic</div>
                    <div className="discovery-park-meta">Emergency • 1.8 mi</div>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides & How-tos */}
      <section className="discovery-section">
        <div className="discovery-container-inner">
          <h2 className="discovery-section-title">Guides & How-tos</h2>
          
          <div className="discovery-guides-grid">
            <div className="discovery-guide-card">
              <div className="discovery-guide-header">
                <i className="bi bi-calendar-week"></i>
                <span>Feeding schedule by breed</span>
              </div>
              <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=250&fit=crop" alt="Feeding" />
              <div className="discovery-guide-info">
                <span className="guide-time">8 min read</span>
                <span className="guide-tag">Nutrition</span>
              </div>
              <div className="discovery-guide-actions">
                <button className="discovery-guide-btn-outline">
                  <i className="bi bi-book"></i> Read
                </button>
                <button className="discovery-guide-btn-primary">
                  <i className="bi bi-download"></i> Download PDF
                </button>
              </div>
            </div>

            <div className="discovery-guide-card">
              <div className="discovery-guide-header">
                <i className="bi bi-heart-pulse"></i>
                <span>First aid basics at home</span>
              </div>
              <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=250&fit=crop" alt="First aid" />
              <div className="discovery-guide-info">
                <span className="guide-time">6 min read</span>
                <span className="guide-tag">Health</span>
              </div>
              <div className="discovery-guide-actions">
                <button className="discovery-guide-btn-outline">
                  <i className="bi bi-book"></i> Read
                </button>
                <button className="discovery-guide-btn-primary">
                  <i className="bi bi-calendar-check"></i> Book a vet
                </button>
              </div>
            </div>

            <div className="discovery-guide-card">
              <div className="discovery-guide-header">
                <i className="bi bi-award"></i>
                <span>Crate training in 7 days</span>
              </div>
              <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=250&fit=crop" alt="Training" />
              <div className="discovery-guide-info">
                <span className="guide-time">10 min read</span>
                <span className="guide-tag">Behavior</span>
              </div>
              <div className="discovery-guide-actions">
                <button className="discovery-guide-btn-outline">
                  <i className="bi bi-book"></i> Read
                </button>
                <button className="discovery-guide-btn-primary">
                  <i className="bi bi-calendar-event"></i> Book training
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="discovery-footer">
        <div className="discovery-container-inner">
          <h3>Want tailored tips?</h3>
          <p>Log in to see content for your pet's age, breed, and needs.</p>
        </div>
      </section>
    </div>
  );
};

export default Discovery;