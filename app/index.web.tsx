import React, {Fragment} from "react";
import './style.css'
import { ScrollView } from "react-native";
export const Index: React.FC = () => {
  return (
    <ScrollView>
    <div style={{backgroundColor: '#ffffff'}}>
      <nav className="navbar container">
        <div className="logo">NestQuest.</div>
        <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#download" className="btn btn-primary nav-btn">Download</a></li>
        </ul>
      </nav>

      <header className="hero">
          <div className="container hero-grid">
              <div className="hero-text">
                  <h1>Find your dream home without the headache.</h1>
                  <p>Discover properties you'll love with AI-powered matching, instant alerts, and immersive virtual tours. The smartest way to buy or rent.</p>
                  <div className="store-buttons">
                      <a href="#" className="store-btn">
                          <i className="fab fa-apple"></i>
                          <div className="btn-text">
                              <span>Download on the</span>
                              <span>App Store</span>
                          </div>
                      </a>
                      <a href="#" className="store-btn">
                          <i className="fab fa-google-play"></i>
                          <div className="btn-text">
                              <span>GET IT ON</span>
                              <span>Google Play</span>
                          </div>
                      </a>
                  </div>
                  <div className="trust-badges">
                    <p><i className="fas fa-star"></i> 4.9/5 Stars on App Store based on 10k+ reviews</p>
                  </div>
              </div>
              <div className="hero-image">
                  <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="NestQuest App Interface showing a luxury home"/>
              </div>
          </div>
      </header>

      <section id="features" className="features section-padding">
          <div className="container">
              <div className="section-header">
                  <h2>Why choose NestQuest?</h2>
                  <p>We've redesigned the house-hunting process around you.</p>
              </div>
              <div className="feature-grid">
                  <div className="feature-card">
                      <i className="fas fa-bolt feature-icon"></i>
                      <h3>Instant Alerts</h3>
                      <p>Beat the competition. Get notified the second a home matching your criteria hits the market.</p>
                  </div>
                  <div className="feature-card">
                      <i className="fas fa-vr-cardboard feature-icon"></i>
                      <h3>3D Virtual Tours</h3>
                      <p>Walk through homes from your couch. Save time by only visiting the ones you truly love in person.</p>
                  </div>
                  <div className="feature-card">
                      <i className="fas fa-brain feature-icon"></i>
                      <h3>Smart Matching</h3>
                      <p>Stop endless scrolling. Our algorithm learns what you like and delivers curated listings daily.</p>
                  </div>
              </div>
          </div>
      </section>

      <section id="reviews" className="reviews section-padding bg-light">
          <div className="container">
              <div className="section-header">
                  <h2>Trusted by thousands of movers.</h2>
              </div>
              <div className="review-grid">
                  <div className="review-card">
                      <p className="review-text">"The virtual tours changed everything. We found our new apartment in 3 days without taking time off work. Highly recommend!"</p>
                      <div className="reviewer">
                          <img src="https://i.pravatar.cc/150?img=32" alt="Sarah J."/>
                          <div>
                              <h4>Sarah J.</h4>
                              <span>Rented in Chicago</span>
                          </div>
                      </div>
                  </div>
                  <div className="review-card">
                      <p className="review-text">"The alerts are actually instant. I put in an offer on my dream house 20 minutes after it was listed. Thanks NestQuest!"</p>
                      <div className="reviewer">
                          <img src="https://i.pravatar.cc/150?img=12" alt="Mark D." />
                          <div>
                              <h4>Mark D.</h4>
                              <span>Bought in Austin</span>
                          </div>
                      </div>
                  </div>
                  <div className="review-card desktop-only">
                      <p className="review-text">"So much better than the cluttered websites. The interface is clean, easy to use, and the AI suggestions were spot on."</p>
                      <div className="reviewer">
                          <img src="https://i.pravatar.cc/150?img=47" alt="Anita R."/>
                          <div>
                              <h4>Anita R.</h4>
                              <span>Bought in Seattle</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section id="download" className="cta-section section-padding">
          <div className="container cta-content">
              <h2>Ready to make your move?</h2>
              <p>Join over 200,000 people finding their home with NestQuest today.</p>
              <div className="store-buttons center-buttons">
                  <a href="#" className="store-btn store-btn-light">
                      <i className="fab fa-apple"></i>
                      <div className="btn-text">
                          <span>Download on the</span>
                          <span>App Store</span>
                      </div>
                  </a>
                  <a href="#" className="store-btn store-btn-light">
                      <i className="fab fa-google-play"></i>
                      <div className="btn-text">
                          <span>GET IT ON</span>
                          <span>Google Play</span>
                      </div>
                  </a>
              </div>
          </div>
      </section>

      <footer>
          <div className="container footer-content">
              <div className="footer-logo">NestQuest.</div>
              <ul className="footer-links">
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Contact</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
              </ul>
              <div className="social-links">
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
              </div>
          </div>
          <div className="container copyright">
              <p>&copy; 2023 NestQuest Real Estate. All rights reserved.</p>
          </div>
      </footer>
    </div>
    </ScrollView>
  )
}

export default Index;