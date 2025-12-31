'use client';

import { MapPin, Mail, Phone, Clock, Send, MessageCircle, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacy: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error' | null, message: string}>({ type: null, message: '' });
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const parent = e.target.parentElement;
    if (parent) {
      parent.classList.add('ring-2', 'ring-primary/50');
      parent.classList.add('ring-offset-2');
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const parent = e.target.parentElement;
    if (parent) {
      parent.classList.remove('ring-2', 'ring-primary/50', 'ring-offset-2');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
      <div className="container py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <motion.span 
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: '#BBDEFB', color: '#0D47A1', borderColor: '#BBDEFB' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="h-2 w-2 rounded-full bg-primary/70 mr-2 animate-pulse"></span>
            We're here for you
          </motion.span>
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-display"
            style={{ color: '#0D47A1' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: '#0D47A1' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Have questions or need assistance? Our team is ready to help. Reach out through the form below or connect with us through our contact information.
          </motion.p>
        </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <motion.div 
            className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/30 shadow-sm"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  Contact Information
                </h2>
              </div>
              <p className="text-muted-foreground/90 leading-relaxed">
                We're here to help and answer any questions you might have. Our team is ready to assist you with any inquiries.
              </p>
              
              <div className="pt-4 space-y-1">
                <div className="flex items-center text-muted-foreground/90 text-sm">
                  <Clock className="h-4 w-4 mr-2 text-primary/80" />
                  <span>Response time: Usually within 24 hours</span>
                </div>
                <div className="flex items-center text-muted-foreground/90 text-sm">
                  <Mail className="h-4 w-4 mr-2 text-primary/80" />
                  <span>Email: info@churchname.org</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 p-6 border border-border/30 shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ y: -3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary/20 group-hover:to-primary/10 transition-colors duration-300">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-200">Our Location</h3>
                <p className="mt-1.5 text-sm text-muted-foreground/90 leading-relaxed">
                  123 Church Street<br />
                  City, State ZIP
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-sm font-medium hover:underline transition-colors duration-200"
                  style={{ color: '#0D47A1' }}
                >
                  View on map
                  <svg className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 p-6 border border-border/30 shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ y: -3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 text-green-500 group-hover:from-green-500/20 group-hover:to-green-500/10 transition-colors duration-300">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-200">Call Us</h3>
                <p className="mt-1.5 text-sm text-muted-foreground/90 leading-relaxed">
                  +1 (555) 123-4567
                </p>
                <a 
                  href="tel:+15551234567"
                  className="mt-3 inline-flex items-center text-sm font-medium hover:underline transition-colors duration-200"
                  style={{ color: '#0D47A1' }}
                >
                  Call now
                  <svg className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 p-8 border border-border/30 shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ y: -3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-purple-500 group-hover:from-purple-500/20 group-hover:to-purple-500/10 transition-colors duration-300">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-200">Service Hours</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/20 group-hover:border-purple-500/20 transition-colors duration-300">
                  <span className="text-sm font-medium text-foreground/80">Sunday</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-purple-500">8:00 AM - 12:00 PM</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/10 text-purple-500">Main Service</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/20 group-hover:border-purple-500/20 transition-colors duration-300">
                  <span className="text-sm font-medium text-foreground/80">Wednesday</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-purple-500">6:30 PM - 8:00 PM</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/10 text-purple-500">Bible Study</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/20 group-hover:border-purple-500/20 transition-colors duration-300">
                  <span className="text-sm font-medium text-foreground/80">Friday</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-purple-500">7:00 PM - 9:00 PM</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/10 text-purple-500">Prayer Meeting</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border/20">
                <p className="text-xs text-muted-foreground/80 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Office hours: Monday-Friday, 9:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Send className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold">Send Us a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative">
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1.5 text-muted-foreground">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 focus:outline-none transition-all duration-200"
                        style={{ borderColor: '#0D47A1' }}
                        placeholder="John"
                      />
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.35 }}
                >
                  <div className="relative">
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1.5 text-muted-foreground">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 focus:outline-none transition-all duration-200"
                        style={{ borderColor: '#0D47A1' }}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-muted-foreground">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 focus:outline-none transition-all duration-200"
                      style={{ borderColor: '#0D47A1' }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.45 }}
              >
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium mb-1.5 text-muted-foreground">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 focus:outline-none transition-all duration-200"
                      style={{ borderColor: '#0D47A1' }}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  <label htmlFor="subject" className="block text-sm font-medium mb-1.5 text-muted-foreground">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 focus:outline-none appearance-none transition-all duration-200"
                      style={{ borderColor: '#0D47A1' }}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="prayer">Prayer Request</option>
                      <option value="visitor">I'm New Here</option>
                      <option value="giving">Giving/Donations</option>
                      <option value="volunteer">Volunteer Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-6">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.55 }}
              >
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1.5 text-muted-foreground">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 focus:outline-none transition-all duration-200 resize-none"
                      style={{ borderColor: '#0D47A1' }}
                      placeholder="Type your message here..."
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.6 }}
                className="flex items-start"
              >
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    required
                    checked={formData.privacy as boolean}
                    onChange={handleChange}
                    className="h-4 w-4 border-border rounded bg-background/50"
                    style={{ accentColor: '#0D47A1', borderColor: '#0D47A1' }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="privacy" className="text-muted-foreground">
                    I agree to the <a href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</a> and 
                    <a href="/terms" className="text-primary hover:underline font-medium ml-1">Terms of Service</a>.
                  </label>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.65 }}
              >
                <button
                  type="submit"
                  className="group w-full flex justify-center items-center py-3.5 px-6 rounded-xl font-medium shadow-sm hover:shadow-md focus:outline-none transition-all duration-300"
                  style={{ backgroundColor: '#BBDEFB', color: '#0D47A1', borderColor: '#BBDEFB' }}
                >
                  <span>Send Message</span>
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden h-96 bg-muted">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256241844!2d-73.98784468459375!3d40.75798597932698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Church Location"
        ></iframe>
      </div>

      {/* Additional Contact Options */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Other Ways to Connect</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">Prayer Line</h3>
            <p className="text-muted-foreground text-sm">
              Call our 24/7 prayer line to receive prayer or leave a prayer request.
            </p>
            <p className="mt-2 font-medium">(123) 456-7891</p>
          </div>

          <div className="bg-card p-6 rounded-lg text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">Prayer Requests</h3>
            <p className="text-muted-foreground text-sm">
              Send us your prayer requests and our prayer team will intercede for you.
            </p>
            <a
              href="mailto:prayer@churchname.org"
              className="mt-2 inline-block text-primary font-medium hover:underline"
            >
              prayer@churchname.org
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Text Updates</h3>
            <p className="text-muted-foreground text-sm">
              Text "JOIN" to 12345 to receive important church updates and announcements.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Standard messaging rates may apply.
            </p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-24 rounded-2xl overflow-hidden border border-border/50"
      >
        <div className="aspect-w-16 aspect-h-9 w-full h-[400px] bg-muted/30 flex items-center justify-center">
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 mx-auto text-primary/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Our Location</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              123 Church Street, City, State ZIP
            </p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 text-primary hover:underline font-medium"
            >
              View on Google Maps
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
