import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-brand-bg to-brand-light py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-corinthia font-bold text-brand-primary mb-6 animate-fade-in">
          Welcome to Acir Cafe
          <span className="block text-brand-accent mt-2 text-4xl md:text-5xl font-inter font-light">Where Every Cup Tells a Story</span>
        </h1>
        <p className="text-xl text-brand-muted mb-8 max-w-2xl mx-auto animate-slide-up font-inter">
          Experience the finest coffee and authentic Filipino cuisine in a cozy atmosphere
        </p>
        <div className="flex justify-center">
          <a
            href="#coffee"
            className="bg-brand-primary text-white px-8 py-3 rounded-full hover:bg-brand-accent transition-all duration-300 transform hover:scale-105 font-medium font-inter"
          >
            Explore Menu
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;