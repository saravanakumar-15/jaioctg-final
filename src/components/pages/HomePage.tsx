import React from 'react';
import { LandingPage } from './LandingPage';

interface HomePageProps {
  setCurrentView: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentView }) => {
  return <LandingPage setCurrentView={setCurrentView} />;
};
