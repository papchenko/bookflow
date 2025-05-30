import Logo from '../../assets/logo.png';
import { PiPaperPlaneRightBold } from 'react-icons/pi';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { footerLinks } from '../../Data';
import ScrollLink from '../link/ScrollLink';
import { Link } from 'react-scroll';
import { animateScroll } from 'react-scroll';

import './footer.scss';

const Footer = () => {
  const scrollTop = () => {
    animateScroll.scrollToTop();
  };

  return (
    <footer className="footer section">
      <div className="footer-container container grid">
        <div>
          <Link to="/" onCkick={scrollTop} className="footer-logo">
            <img src={Logo} alt="" className="footer-logo-img" />
          </Link>
          <p className="footer-description">
          We are many variations of passages available but the majority have suffered alteration some form by injected humour words believable.
          </p>
          <p className="footer-newsletter">Subscribe Our Newsletter</p>
          <form action="" className="footer-form">
            <FaEnvelope className='footer-form-icon' />
            <input type="email" placeholder='Your Email' className="footer-input" />
            <button className="footer-button button">Subscribe <PiPaperPlaneRightBold className='button-icon' /></button>
          </form>
        </div>
        <div className="footer-group grid">
            <div>
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links grid">
                {footerLinks.map((footerLink, index) => {
                  return (
                    <li className="nav-item" key={index}>
                         <ScrollLink to={footerLink} name={footerLink} className="footer-link" />
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <h3 className="footer-title">Opening Hours</h3>
              <ul className="footer-opening grid">
                <li className="opening-item">
                  <span>Week</span>
                  <span>09:00 AM - 20:00 PM</span>
                </li>
                <li className="opening-item">
                  <span>Sun</span>
                  <span>09:30 AM - 21:00 PM</span>
                </li>
                <li className="opening-item">
                  <span>Mon</span>
                  <span>10:00 AM - 22:00 PM</span>
                </li>
                <li className="opening-item">
                  <span>Tue</span>
                  <span>10:30 AM - 21:00 PM</span>
                </li>
                <li className="opening-item">
                  <span>Sat</span>
                  <span className='closed'>Closed</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="footer-title">Get In Touch</h3>
              <ul className="footer-contact grid">
                <div className="footer-item">
                  <span className="footer-icon">
                    <FaMapMarkerAlt />
                  </span>
                  <div>
                    <h3 className="footer-subtitle">Our Address</h3>
                    <p className="footer-info">25/AB Milford Road, New York, USA</p>
                  </div>
                </div>
                <div className="footer-item">
                  <span className="footer-icon">
                    <FaPhoneAlt />
                  </span>
                  <div>
                    <h3 className="footer-subtitle">Call Us</h3>
                    <p className="footer-info">+2 123 654 7898</p>
                  </div>
                </div>
                <div className="footer-item">
                  <span className="footer-icon">
                    <FaEnvelope />
                  </span>
                  <div>
                    <h3 className="footer-subtitle">Mail Us</h3>
                    <p className="footer-info">info@example.com</p>
                  </div>
                </div>
              </ul>
            </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <span className="footer-copy">&#169; Copyright 2025 <span className='closed'>Restrou</span> All Rights Reserved.</span>
        <div className="footer-social">
          <a href="/" target='_blank' className="footer-social-link">
            <FaFacebookF />
          </a>
          <a href="/" target='_blank' className="footer-social-link">
          <FaTwitter />
          </a>
          <a href="/" target='_blank' className="footer-social-link">
          <FaLinkedinIn />
          </a>
          <a href="/" target='_blank' className="footer-social-link">
          <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  )
}
export default Footer