const express = require('express');
const nodemailer = require('nodemailer');

const app = express.Router();

// Middleware
app.use(express.json());




// Nodemailer configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your app password
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// API endpoint to handle appointment booking
app.post('/api/book-appointment', async (req, res) => {
  try {
    const { name, phone, email, service, date, time } = req.body;
    
    // Validation
    if (!name || !phone || !email || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Format date and time
    const appointmentDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Email template for admin - matching website theme
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Appointment Request</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background: #f4f5f7;
            color: #1f2937;
            line-height: 1.6;
            padding: 20px;
          }
          
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          }
          
          .header {
            background: #4f46e5;
            color: #ffffff;
            padding: 2rem;
            text-align: center;
            position: relative;
          }
          
          .header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 20px solid #4f46e5;
          }
          
          .logo {
            font-weight: 700;
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          
          .header-subtitle {
            opacity: 0.9;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }
          
          .notification-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 25px;
            display: inline-block;
            font-weight: 600;
          }
          
          .content {
            padding: 2rem;
            background: #ffffff;
          }
          
          .intro-text {
            color: #4b5563;
            margin-bottom: 1.5rem;
            font-size: 1rem;
          }
          
          .appointment-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-left: 4px solid #4f46e5;
          }
          
          .detail-grid {
            display: grid;
            gap: 1rem;
          }
          
          .detail-item {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          
          .detail-icon {
            color: #4f46e5;
            font-size: 1.1rem;
            width: 24px;
            margin-right: 12px;
          }
          
          .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 120px;
          }
          
          .detail-value {
            color: #1f2937;
            font-weight: 500;
          }
          
          .action-section {
            background: #f3f4f6;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
          
          .action-title {
            font-weight: 700;
            color: #111827;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
          }
          
          .action-title i {
            margin-right: 8px;
            color: #4f46e5;
          }
          
          .action-list {
            list-style: none;
            padding: 0;
          }
          
          .action-list li {
            padding: 0.5rem 0;
            display: flex;
            align-items: center;
            color: #4b5563;
          }
          
          .action-list li::before {
            content: '✓';
            background: #4f46e5;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            margin-right: 10px;
            font-weight: bold;
          }
          
          .contact-info {
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
            margin: 1.5rem 0;
          }
          
          .whatsapp-link {
            color: #ffffff;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 25px;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
          }
          
          .whatsapp-link:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }
          
          .whatsapp-link i {
            margin-right: 8px;
          }
          
          .footer {
            background: #1f2937;
            color: #f9fafb;
            padding: 2rem;
            text-align: center;
          }
          
          .footer-logo {
            font-weight: 700;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }
          
          .footer-tagline {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }
          
          .footer-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 1rem 0;
          }
          
          .footer-links a {
            color: #d1d5db;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s;
          }
          
          .footer-links a:hover {
            color: #ffffff;
          }
          
          .copyright {
            color: #6b7280;
            font-size: 0.85rem;
            margin-top: 1rem;
            border-top: 1px solid #374151;
            padding-top: 1rem;
          }
          
          @media (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 1.5rem; }
            .detail-grid { grid-template-columns: 1fr; }
            .footer-links { flex-wrap: wrap; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo">Harshit Eye Care & Opticals</div>
            <div class="header-subtitle">Professional Eye Care Services</div>
            <div class="notification-badge">
              <i class="fas fa-bell"></i> New Appointment Request
            </div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="intro-text">
              <strong>Hello Admin,</strong><br>
              You have received a new appointment request through your website. Please review the details below and contact the patient for confirmation.
            </div>
            
            <!-- Appointment Details Card -->
            <div class="appointment-card">
              <h3 style="color: #111827; margin-bottom: 1rem; font-weight: 700;">
                <i class="fas fa-calendar-check" style="color: #4f46e5; margin-right: 8px;"></i>
                Appointment Details
              </h3>
              
              <div class="detail-grid">
                <div class="detail-item">
                  <i class="fas fa-user detail-icon"></i>
                  <span class="detail-label">Patient Name:</span>
                  <span class="detail-value">${name}</span>
                </div>
                
                <div class="detail-item">
                  <i class="fas fa-phone detail-icon"></i>
                  <span class="detail-label">Phone Number:</span>
                  <span class="detail-value">${phone}</span>
                </div>
                
                <div class="detail-item">
                  <i class="fas fa-envelope detail-icon"></i>
                  <span class="detail-label">Email Address:</span>
                  <span class="detail-value">${email}</span>
                </div>
                
                <div class="detail-item">
                  <i class="fas fa-stethoscope detail-icon"></i>
                  <span class="detail-label">Service Type:</span>
                  <span class="detail-value">${service}</span>
                </div>
                
                <div class="detail-item">
                  <i class="fas fa-calendar detail-icon"></i>
                  <span class="detail-label">Preferred Date:</span>
                  <span class="detail-value">${appointmentDate}</span>
                </div>
                
                <div class="detail-item">
                  <i class="fas fa-clock detail-icon"></i>
                  <span class="detail-label">Preferred Time:</span>
                  <span class="detail-value">${time}</span>
                </div>
              </div>
            </div>
            
            <!-- Action Items -->
            <div class="action-section">
              <div class="action-title">
                <i class="fas fa-tasks"></i>
                Next Steps
              </div>
              <ul class="action-list">
                <li>Contact the patient to confirm availability</li>
                <li>Check your schedule for the requested time slot</li>
                <li>Send appointment confirmation to the patient</li>
                <li>Prepare any necessary documentation</li>
              </ul>
            </div>
            
            <!-- Quick Contact -->
            <div class="contact-info">
              <div style="font-weight: 600; margin-bottom: 0.5rem;">Quick Contact Patient</div>
              <a href="https://wa.me/91${phone.replace(/\D/g, '')}" class="whatsapp-link" target="_blank">
                <i class="fab fa-whatsapp"></i>
                Message on WhatsApp
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-logo">Harshit Eye Care & Opticals</div>
            <div class="footer-tagline">Trusted eye care & eyewear since 2018</div>
            
            <div class="footer-links">
              <a href="#">Dashboard</a>
              <a href="#">Appointments</a>
              <a href="#">Patients</a>
              <a href="#">Settings</a>
            </div>
            
            <div class="copyright">
              © ${new Date().getFullYear()} Harshit Eye Care & Opticals. All rights reserved.<br>
              This email was automatically generated from your appointment booking system.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email template for patient confirmation - matching website theme
    const patientEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background: #f4f5f7;
            color: #1f2937;
            line-height: 1.6;
            padding: 20px;
          }
          
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          }
          
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
            color: #ffffff;
            padding: 2rem;
            text-align: center;
            position: relative;
          }
          
          .header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 20px solid #4338ca;
          }
          
          .logo {
            font-weight: 700;
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          
          .header-subtitle {
            opacity: 0.9;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }
          
          .success-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            display: inline-flex;
            align-items: center;
            font-weight: 600;
            font-size: 1rem;
          }
          
          .success-badge i {
            margin-right: 8px;
            font-size: 1.1rem;
          }
          
          .content {
            padding: 2rem;
            background: #ffffff;
          }
          
          .greeting {
            color: #1f2937;
            margin-bottom: 1rem;
            font-size: 1.1rem;
          }
          
          .intro-text {
            color: #4b5563;
            margin-bottom: 2rem;
            font-size: 1rem;
            line-height: 1.7;
          }
          
          .appointment-summary {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
            border-left: 4px solid #4f46e5;
            position: relative;
          }
          
          .appointment-summary::before {
            content: '';
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #10b981;
            border-radius: 50%;
            border: 3px solid #ffffff;
          }
          
          .summary-title {
            color: #111827;
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            font-size: 1.2rem;
          }
          
          .summary-title i {
            margin-right: 10px;
            color: #4f46e5;
            font-size: 1.3rem;
          }
          
          .appointment-details {
            display: grid;
            gap: 1rem;
          }
          
          .detail-row {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          
          .detail-icon {
            color: #4f46e5;
            font-size: 1.1rem;
            width: 24px;
            margin-right: 12px;
          }
          
          .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 100px;
          }
          
          .detail-value {
            color: #1f2937;
            font-weight: 500;
          }
          
          .process-section {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
          }
          
          .process-title {
            color: #111827;
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            font-size: 1.1rem;
          }
          
          .process-title i {
            margin-right: 10px;
            color: #4f46e5;
          }
          
          .process-steps {
            list-style: none;
            padding: 0;
            counter-reset: step-counter;
          }
          
          .process-steps li {
            counter-increment: step-counter;
            padding: 1rem 0;
            display: flex;
            align-items: flex-start;
            color: #4b5563;
            border-bottom: 1px solid #d1d5db;
            position: relative;
          }
          
          .process-steps li:last-child {
            border-bottom: none;
          }
          
          .process-steps li::before {
            content: counter(step-counter);
            background: #4f46e5;
            color: white;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            margin-right: 15px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          
          .contact-card {
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            margin: 2rem 0;
          }
          
          .contact-title {
            font-weight: 700;
            font-size: 1.2rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .contact-title i {
            margin-right: 10px;
          }
          
          .whatsapp-btn {
            color: #ffffff;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            padding: 1rem 2rem;
            border-radius: 25px;
            transition: all 0.3s ease;
            margin-top: 1rem;
            font-size: 1.1rem;
          }
          
          .whatsapp-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }
          
          .whatsapp-btn i {
            margin-right: 10px;
            font-size: 1.2rem;
          }
          
          .footer {
            background: #1f2937;
            color: #f9fafb;
            padding: 2rem;
            text-align: center;
          }
          
          .footer-logo {
            font-weight: 700;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }
          
          .footer-tagline {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }
          
          .social-links {
            margin: 1.5rem 0;
          }
          
          .social-links a {
            color: #d1d5db;
            font-size: 1.4rem;
            margin: 0 12px;
            text-decoration: none;
            transition: color 0.3s;
          }
          
          .social-links a:hover {
            color: #6366f1;
          }
          
          .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin: 1.5rem 0;
            flex-wrap: wrap;
          }
          
          .footer-links a {
            color: #d1d5db;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s;
          }
          
          .footer-links a:hover {
            color: #ffffff;
          }
          
          .copyright {
            color: #6b7280;
            font-size: 0.85rem;
            margin-top: 1.5rem;
            border-top: 1px solid #374151;
            padding-top: 1.5rem;
          }
          
          @media (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 1.5rem; }
            .appointment-summary { padding: 1.5rem; }
            .contact-card { padding: 1.5rem; }
            .footer-links { flex-direction: column; gap: 0.5rem; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo">Harshit Eye Care & Opticals</div>
            <div class="header-subtitle">Professional Eye Care Services</div>
            <div class="success-badge">
              <i class="fas fa-check-circle"></i>
              Appointment Request Received
            </div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="greeting">
              Dear <strong>${name}</strong>,
            </div>
            
            <div class="intro-text">
              Thank you for choosing <strong>Harshit Eye Care & Opticals</strong>! We have successfully received your appointment request and are excited to provide you with the best eye care service. Your vision and comfort are our top priority.
            </div>
            
            <!-- Appointment Summary -->
            <div class="appointment-summary">
              <div class="summary-title">
                <i class="fas fa-calendar-check"></i>
                Your Appointment Summary
              </div>
              
              <div class="appointment-details">
                <div class="detail-row">
                  <i class="fas fa-stethoscope detail-icon"></i>
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${service}</span>
                </div>
                
                <div class="detail-row">
                  <i class="fas fa-calendar detail-icon"></i>
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${appointmentDate}</span>
                </div>
                
                <div class="detail-row">
                  <i class="fas fa-clock detail-icon"></i>
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${time}</span>
                </div>
                
                <div class="detail-row">
                  <i class="fas fa-phone detail-icon"></i>
                  <span class="detail-label">Contact:</span>
                  <span class="detail-value">${phone}</span>
                </div>
              </div>
            </div>
            
            <!-- Process Steps -->
            <div class="process-section">
              <div class="process-title">
                <i class="fas fa-route"></i>
                What Happens Next?
              </div>
              
              <ol class="process-steps">
                <li>Our experienced team will review your appointment request within 24 hours</li>
                <li>We'll contact you via phone call or WhatsApp to confirm your preferred time slot</li>
                <li>You'll receive a final confirmation with detailed instructions and our clinic address</li>
                <li>On your appointment day, arrive 10 minutes early for a smooth check-in process</li>
              </ol>
            </div>
            
            <!-- Contact Information -->
            <div class="contact-card">
              <div class="contact-title">
                <i class="fas fa-headset"></i>
                Need Assistance?
              </div>
              <div style="margin-bottom: 1rem; opacity: 0.9;">
                Our friendly team is here to help with any questions or concerns you may have about your upcoming appointment.
              </div>
              <a href="https://wa.me/918896005699" class="whatsapp-btn" target="_blank">
                <i class="fab fa-whatsapp"></i>
                Chat with us on WhatsApp
              </a>
            </div>
            
            <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #0284c7; color: #0c4a6e; margin-top: 2rem;">
              <strong><i class="fas fa-info-circle" style="margin-right: 8px;"></i>Important Note:</strong><br>
              Please bring any previous eye test reports or prescription glasses to your appointment. This helps us provide you with the most accurate assessment and personalized care.
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-logo">Harshit Eye Care & Opticals</div>
            <div class="footer-tagline">Trusted eye care & eyewear since 2018</div>
            
            <div class="social-links">
              <a href="https://facebook.com" target="_blank" title="Facebook">
                <i class="fab fa-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" title="Instagram">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" title="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="https://wa.me/918896005699" target="_blank" title="WhatsApp">
                <i class="fab fa-whatsapp"></i>
              </a>
            </div>
            
            <div class="footer-links">
              <a href="#">About Us</a>
              <a href="#">Eye Testing</a>
              <a href="#">Our Services</a>
              <a href="#">Shop</a>
              <a href="#">Contact</a>
            </div>
            
            <div class="copyright">
              © ${new Date().getFullYear()} Harshit Eye Care & Opticals. All rights reserved.<br>
              <strong>Payment Options:</strong> UPI • Paytm • Credit Card<br>
              This email was sent because you requested an appointment through our website.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin email
      subject: `🗓️ New Appointment Request - ${name}`,
      html: adminEmailHtml
    };

    // Send confirmation email to patient
    const patientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Appointment Request Received - Harshit Eye Care',
      html: patientEmailHtml
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(patientMailOptions)
    ]);

    res.json({
      success: true,
      message: 'Appointment booked successfully! We will contact you soon.'
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment. Please try again.'
    });
  }
});







module.exports = app;