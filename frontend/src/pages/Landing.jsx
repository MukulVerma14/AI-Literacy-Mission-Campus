import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import millionmindsLogo from '../assets/millionminds-logo.png';

const Landing = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const mailtoUrl = `mailto:info@millionminds.in?subject=${encodeURIComponent(`AILMC Inquiry from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoUrl;
  };
  const tracks = [
    {
      title: 'MasterClass',
      hours: '30 hours',
      color: 'border-track-blue text-track-blue bg-blue-50/50',
      description: '20 live in-person sessions of 90 minutes each. Hands-on learning with GenAI tools, Prompt Engineering, and real-life use cases. Conducted by GenZ tech mentors.',
      badgeColor: 'bg-primary text-white'
    },
    {
      title: 'Self-Practice',
      hours: '30 hours',
      color: 'border-track-green text-track-green bg-green-50/50',
      description: 'Structured self-practice assignments covering Prompt Engineering, Productivity Enhancement, Creativity Tools, and Work-life Application scenarios.',
      badgeColor: 'bg-success text-white'
    },
    {
      title: 'Capstone',
      hours: '10 hours',
      color: 'border-track-orange text-track-orange bg-orange-50/50',
      description: 'A comprehensive all-encompassing project to review and demonstrate your overall AI learning. Your proof of becoming AI-native.',
      badgeColor: 'bg-track-orange text-white'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="bg-darkbg text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 flex items-center justify-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent">
            AI Literacy Mission @ Campus
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto mb-8">
            70 hours. 3 tracks. One certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=MENTEE"
              className="px-8 py-3 rounded-lg text-base font-bold bg-primary text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/30"
            >
              Join as Mentee
            </Link>
            <Link
              to="/register?role=MENTOR"
              className="px-8 py-3 rounded-lg text-base font-bold bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-md"
            >
              Apply as Mentor
            </Link>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Our Learning Tracks
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            A comprehensive, rigorous training program designed to equip university students with production-grade AI skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracks.map((track, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-8 border-t-4 ${track.color.split(' ')[0]} shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">{track.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${track.badgeColor}`}>
                    {track.hours}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {track.description}
                </p>
              </div>
              <div className="mt-8 border-t border-slate-100 pt-6">
                <Link
                  to={`/register?role=MENTEE`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-blue-600 transition-colors"
                >
                  Enroll in this track &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-extrabold text-primary mb-2">1:1 Mentorship</div>
              <p className="text-slate-400 text-sm">Learn directly from verified college mentors and industry practitioners who guide your coding journey.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-extrabold text-success mb-2">70h Practical Learning</div>
              <p className="text-slate-400 text-sm">30 hours of lectures, 30 hours of personal practice labs, and a 10-hour capstone build phase.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-extrabold text-warning mb-2">Industry Verified</div>
              <p className="text-slate-400 text-sm">Graduate with a public certificate and verified credentials ready for career placement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About The Mission Section */}
      <section id="about-mission" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column (text) */}
            <div>
              <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">
                OUR MISSION
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Training One Million GenZ Students in AI — Free of Cost
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                <p>
                  Early adoption of AI skills enables individuals to explore 
                  AI-driven new jobs while remaining relevant in their existing 
                  vocations. As an emerging and fast-growing economy, India needs 
                  AI training at a much larger scale — all pervasive, wherever the 
                  impact of AI is going to be greater. Learning programmes need to 
                  be unleashed to train citizens at mass scale to become true 
                  AI natives.
                </p>
                <p>
                  Our vision is to train One Million GenZ students and young 
                  Indian working professionals about the Fundamentals of AI and 
                  the working knowledge of Gen AI tools for real-life productivity 
                  enhancement — completely free of cost.
                </p>
                <p>
                  The initial pilot has 50 mentors training 500 individuals. 
                  Over a 3-year horizon, the mentor collective will grow to 5,000 
                  mentors covering 100+ cities, with capacity to train 2.5 lakh 
                  mentees per annum. Mentors are young, tech-savvy GenZ students 
                  from engineering colleges who voluntarily train people from all 
                  walks of life.
                </p>
              </div>
            </div>

            {/* Right Column (stats grid) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">1 Million+</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">Target Learners</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">5,000+</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">Mentors by Year 3</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">Cities Covered</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">Free</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">Cost to Learners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">
              PROCESS
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A structured, mentor-led journey from AI novice to AI native.
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-4 gap-8 overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 snap-x snap-mandatory scrollbar-thin">
            {/* Step 1 */}
            <div className="flex-shrink-0 w-80 md:w-auto snap-center bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <span className="text-3xl mb-3" role="img" aria-label="Register">📝</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Register</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sign up as a Mentee. Share your background, current role, and what you want to achieve with AI.
              </p>
              <div className="hidden md:flex absolute top-16 -right-6 w-12 h-12 items-center justify-center text-slate-300 text-xl font-bold z-10">
                →
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex-shrink-0 w-80 md:w-auto snap-center bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <span className="text-3xl mb-3" role="img" aria-label="Join a Cohort">🤝</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Join a Cohort</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse mentor-led cohorts in your city. Groups of 10–12 mentees for focused, personalised learning.
              </p>
              <div className="hidden md:flex absolute top-16 -right-6 w-12 h-12 items-center justify-center text-slate-300 text-xl font-bold z-10">
                →
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex-shrink-0 w-80 md:w-auto snap-center bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <span className="text-3xl mb-3" role="img" aria-label="Complete 70 Hours">🧠</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Complete 70 Hours</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                30 hrs MasterClass + 30 hrs Self-Practice + 10 hrs Capstone project. Track every hour in your dashboard.
              </p>
              <div className="hidden md:flex absolute top-16 -right-6 w-12 h-12 items-center justify-center text-slate-300 text-xl font-bold z-10">
                →
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex-shrink-0 w-80 md:w-auto snap-center bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <span className="text-3xl mb-3" role="img" aria-label="Get Certified">🏆</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Get Certified</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Earn your AILMC certificate — graded, verified, and powered by Millionminds. Your proof of becoming AI-native.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Content Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">
              CURRICULUM
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              What You Will Learn
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A 30-hour hands-on Master Class programme supplemented by 30 hours of Self-Practice and a 10-hour Capstone Project — structured for real-life AI application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Fundamentals</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Understand the current AI landscape, its impact on daily life in 2026 and beyond — personal, professional, and societal. Learn why and how to start using AI tools to derive real benefits.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🛠️</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Getting Started with AI Tools</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discover and download the most useful GenAI tools. Understand paid vs free versions, key features, and which tools match your specific needs and interest areas.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Prompt Engineering</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Master the Art & Science of Prompt Engineering. Learn to craft prompts that generate faster, more productive, and accurate responses from AI systems.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hands-on GenAI Tool Practice</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Deep-dive into 5 GenAI tools over 10 dedicated sessions. Build a real-life use case library with your own data across productivity, creativity, and work situations.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Self-Practice Assignments (30 hrs)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Reinforce learning through structured self-practice: Prompt Engineering (5 hrs), Productivity Enhancement (5 hrs), Creativity Tools (5 hrs), and Work-life Applications (15 hrs).
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Capstone Project (10 hrs)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A comprehensive final assignment reviewing your overall learning journey. Track your AI impact and plan your continued growth beyond the programme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Millionminds Section */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-xl px-4 py-2 inline-block mb-6 shadow-sm">
            <img src={millionmindsLogo} className="h-10 w-auto" alt="Millionminds Logo" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">About Millionminds</h2>
          <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
            <p>
              Millionminds is a skilling platform dedicated to fostering 
              tech upskilling, innovation, entrepreneurship, and employability 
              amongst campus students across India. We bridge the gap between 
              what employers seek from campus freshers and what students 
              actually learn — creating real-world readiness through 
              hands-on experiences.
            </p>
            <p>
              Our programmes span AI literacy, career upskilling, job 
              placements, internships, and industry R&D projects — all 
              delivered in partnership with domain experts, mentors, and 
              campus institutions.
            </p>
            <p className="text-primary font-semibold italic text-lg mt-4 block">
              Skilling Platform: Harnessing Unexplored Talent. A Change Agent.
            </p>
          </div>
          <a
            href="https://www.millionminds.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors inline-block shadow-md hover:shadow-primary/20"
          >
            Visit Millionminds &rarr;
          </a>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">
              CONTACT
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Have questions about AILMC? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Left Column (Contact details) */}
            <div className="flex flex-col gap-6 justify-center">
              {/* Card 1 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xl animate-pulse" role="img" aria-label="Website">🌐</span>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Website</span>
                  <a
                    href="https://www.millionminds.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium text-sm sm:text-base"
                  >
                    www.millionminds.in
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xl animate-pulse" role="img" aria-label="Email">📧</span>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</span>
                  <a
                    href="mailto:info@millionminds.in"
                    className="text-primary hover:underline font-medium text-sm sm:text-base"
                  >
                    info@millionminds.in
                  </a>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xl animate-pulse" role="img" aria-label="Platform">📍</span>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Platform</span>
                  <span className="text-slate-900 font-medium text-sm sm:text-base">
                    AI Literacy Mission @ Campus
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5">
                    Powered by Millionminds UpSkill Academy
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (Form) */}
            <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-sm">
              <div>
                <label htmlFor="fullName" className="sr-only">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="emailAddress" className="sr-only">Email Address</label>
                <input
                  id="emailAddress"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">Your Message</label>
                <textarea
                  id="message"
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 text-sm resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white rounded-lg py-3 font-semibold hover:bg-blue-600 transition-colors shadow-md text-sm mt-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 */}
          <div>
            <div className="bg-white rounded-lg px-2 py-1 inline-block mb-3">
              <img src={millionmindsLogo} alt="Millionminds" className="h-8 w-auto" />
            </div>
            <p className="text-slate-300 font-semibold text-sm">AI Literacy Mission @ Campus</p>
            <p className="text-slate-500 text-xs mt-2">&copy; 2026 Millionminds. All rights reserved.</p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about-mission" className="text-slate-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <Link to="/register?role=MENTEE" className="text-slate-400 hover:text-white transition-colors">
                  Register as Mentee &rarr;
                </Link>
              </li>
              <li>
                <Link to="/register?role=MENTOR" className="text-slate-400 hover:text-white transition-colors">
                  Apply as Mentor &rarr;
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Login &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Programme</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>MasterClass &mdash; 30 Hours</li>
              <li>Self-Practice &mdash; 30 Hours</li>
              <li>Capstone Project &mdash; 10 Hours</li>
              <li>Certificate of Completion</li>
              <li>Powered by Millionminds</li>
            </ul>
          </div>
        </div>

        {/* Bottom Academy Info */}
        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 text-center">
          <p className="text-slate-600 text-xs">
            Built with ❤️ for India's AI future &middot; Millionminds UpSkill Academy
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
