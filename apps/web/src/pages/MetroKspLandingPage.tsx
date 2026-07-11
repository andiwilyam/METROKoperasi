import React from 'react';
import '../components/landingMetroKSP/metroksp.css';
import { metroKspData } from '../components/landingMetroKSP/defaultData';
import Navbar from '../components/landingMetroKSP/Navbar';
import HeroSection from '../components/landingMetroKSP/HeroSection';
import FeaturesGrid from '../components/landingMetroKSP/FeaturesGrid';
import TeamGrid from '../components/landingMetroKSP/TeamGrid';
import TestimonialSlider from '../components/landingMetroKSP/TestimonialSlider';
import PricingTable from '../components/landingMetroKSP/PricingTable';
import ContactFooter from '../components/landingMetroKSP/ContactFooter';

export default function MetroKspLandingPage() {
  const d = metroKspData;
  return (
    <div className="metroksp">
      <Navbar settings={d.settings} />
      <HeroSection hero={d.hero} />
      <FeaturesGrid features={d.features} />
      <TeamGrid team={d.team} />
      <TestimonialSlider testimonials={d.testimonials} />
      <PricingTable pricing={d.pricing} />
      <ContactFooter contact={d.contact} settings={d.settings} />
    </div>
  );
}
