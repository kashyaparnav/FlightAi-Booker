import React from 'react';
import { PlaneIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-booking-primary text-white p-4 shadow-md flex items-center">
      <PlaneIcon className="h-8 w-8 mr-3" />
      <h1 className="text-2xl font-bold tracking-tight">AI Flight Booker</h1>
    </header>
  );
};
