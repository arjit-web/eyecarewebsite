const express = require('express');
const router = express.Router();
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Initialize Brevo API client (align with Appointment setup)
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// API endpoint to handle contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate environment variables
    if (!process.env.ADMIN_MAIL || !process.env.BREVO_API_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Email template for admin notification
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Query</title>
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
            background: #f9fafb;
            color: #111827;
            line-height: 1.6;
            padding: 20px;
          }
          
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
          
          .query-card {
            background: #f9fafb;
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
            flex-wrap: wrap;
            padding: 0.75rem;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #d1d5db;
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
            word-break: break-word;
            overflow-wrap: anywhere;
            max-width: 100%;
          }
          
          .action-section {
            background: #f9fafb;
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
            background: #4f46e5;
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
            .detail-item { flex-direction: column; align-items: flex-start; }
            .detail-label { min-width: auto; margin-bottom: 0.25rem; }
            .detail-value { width: 100%; word-break: break-word; overflow-wrap: anywhere; }
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
              <i class="fas fa-bell"></i> New Contact Query
            </div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="intro-text">
              <strong>Hello Admin,</strong><br>
              You have received a new contact query through your website. Please review the details below and respond to the sender promptly.
            </div>
            
            <!-- Query Details Card -->
            <div class="query-card">
              <h3 style="color: #111827; margin-bottom: 1rem; font-weight: 700;">
                <i class="fas fa-envelope" style="color: #4f46e5; margin-right: 8px;"></i>
                Contact Query Details
              </h3>
              
              <div class="detail-grid">
                <div class="detail-item">
                  <i class="fas fa-user detail-icon"></i>
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${name}</span>
                </div>
                
                <div class="detail-item">
                  <i class="fas fa-envelope detail-icon"></i>
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${email}</span>
                </div>
                
                <div class="detail-item">
                  <i class="fas fa-comment detail-icon"></i>
                  <span class="detail-label">Message:</span>
                  <span class="detail-value">${message}</span>
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
                <li>Contact the sender to address their query</li>
                <li>Review the message for any urgent requirements</li>
                <li>Update your CRM with the contact details</li>
                <li>Follow up within 24 hours</li>
              </ul>
            </div>
            
            <!-- Quick Contact -->
            <div class="contact-info">
              <div style="font-weight: 600; margin-bottom: 0.5rem;">Quick Contact Sender</div>
              <a href="mailto:${email}" class="whatsapp-link">
                <i class="fas fa-envelope"></i>
                Reply via Email
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-logo">Harshit Eye Care & Opticals</div>
            <div class="footer-tagline">Trusted eye care & eyewear since 2018</div>
            
   
            
            <div class="copyright">
              © ${new Date().getFullYear()} Harshit Eye Care & Opticals. All rights reserved.<br>
              This email was automatically generated from your contact form system.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email template for user confirmation
    const userEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Query Confirmation</title>
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
            background: #f9fafb;
            color: #111827;
            line-height: 1.6;
            padding: 20px;
          }
          
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
          
          .query-summary {
            background: #f9fafb;
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
            border-left: 4px solid #4f46e5;
            position: relative;
          }
          
          .query-summary::before {
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
          
          .query-details {
            display: grid;
            gap: 1rem;
          }
          
          .detail-row {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            padding: 0.75rem;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #d1d5db;
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
            word-break: break-word;
            overflow-wrap: anywhere;
            max-width: 100%;
          }
          
          .process-section {
            background: #f9fafb;
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
            background: #4f46e5;
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
            .query-summary { padding: 1.5rem; }
            .contact-card { padding: 1.5rem; }
            .detail-row { flex-direction: column; align-items: flex-start; }
            .detail-label { min-width: auto; margin-bottom: 0.25rem; }
            .detail-value { width: 100%; word-break: break-word; overflow-wrap: anywhere; }
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
              Contact Query Received
            </div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="greeting">
              Dear <strong>${name}</strong>,
            </div>
            
            <div class="intro-text">
              Thank you for reaching out to <strong>Harshit Eye Care & Opticals</strong>! We have successfully received your message and appreciate you taking the time to contact us.
            </div>
            
            <!-- Query Summary -->
            <div class="query-summary">
              <div class="summary-title">
                <i class="fas fa-envelope"></i>
                Your Message Summary
              </div>
              
              <div class="query-details">
                <div class="detail-row">
                  <i class="fas fa-user detail-icon"></i>
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${name}</span>
                </div>
                
                <div class="detail-row">
                  <i class="fas fa-envelope detail-icon"></i>
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${email}</span>
                </div>
                
                <div class="detail-row">
                  <i class="fas fa-comment detail-icon"></i>
                  <span class="detail-label">Message:</span>
                  <span class="detail-value">${message}</span>
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
                <li>Our team will review your message within 24 hours</li>
                <li>We'll respond to your query via email or phone</li>
                <li>For urgent inquiries, feel free to contact us via WhatsApp</li>
              </ol>
            </div>
            
            <!-- Contact Information -->
            <div class="contact-card">
              <div class="contact-title">
                <i class="fas fa-headset"></i>
                Need Immediate Assistance?
              </div>
              <div style="margin-bottom: 1rem; opacity: 0.9;">
                Our team is here to assist with any questions or concerns you may have.
              </div>
              <a href="https://wa.me/918896006599" class="whatsapp-btn" target="_blank">
                <i class="fab fa-whatsapp"></i>
                Chat with us on WhatsApp
              </a>
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
              <a href="https://wa.me/918896006599" target="_blank" title="WhatsApp">
                <i class="fab fa-whatsapp"></i>
              </a>
            </div>
            
            <div class="copyright">
              © ${new Date().getFullYear()} Harshit Eye Care & Opticals. All rights reserved.<br>
              This email was sent because you submitted a contact form on our website.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Configure email for admin (Brevo)
    const adminEmail = {
      sender: { email: "support@harshiteyecare.com", name: "Harshit Eye Care and Opticals" },
      to: [{ email: process.env.ADMIN_MAIL, name: "Admin" }],
      subject: `📧 New Contact Query from ${name}`,
      htmlContent: adminEmailHtml
    };

    // Configure email for user (Brevo)
    const userEmail = {
      sender: { email: "support@harshiteyecare.com", name: "Harshit Eye Care and Opticals" },
      to: [{ email: email, name: name }],
      subject: '✅ Contact Query Received - Harshit Eye Care',
      htmlContent: userEmailHtml
    };

    // Send both emails using Brevo API
    await Promise.all([
      apiInstance.sendTransacEmail(adminEmail),
      apiInstance.sendTransacEmail(userEmail)
    ]);

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Error sending contact query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

module.exports = router;