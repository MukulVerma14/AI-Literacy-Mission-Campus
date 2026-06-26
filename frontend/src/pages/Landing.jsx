import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const tracks = [
    {
      title: 'MasterClass',
      hours: '30 hours',
      color: 'border-track-blue text-track-blue bg-blue-50/50',
      description: 'Expert-led sessions introducing fundamental and advanced generative AI concepts, LLMs, prompting, and deployment architectures.',
      badgeColor: 'bg-primary text-white'
    },
    {
      title: 'Self-Practice',
      hours: '30 hours',
      color: 'border-track-green text-track-green bg-green-50/50',
      description: 'Hands-on practice labs, writing custom agents, interacting with APIs, and fine-tuning prompt templates on local systems.',
      badgeColor: 'bg-success text-white'
    },
    {
      title: 'Capstone',
      hours: '10 hours',
      color: 'border-track-orange text-track-orange bg-orange-50/50',
      description: 'Build a production-grade AI application addressing a real-world problem and demo it to your cohort peer group.',
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
    </div>
  );
};

export default Landing;
