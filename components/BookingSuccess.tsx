import React from 'react';
import { type FlightDetails } from '../types';
import { CheckCircleIcon } from './IconComponents';

interface BookingSuccessProps {
  flight: FlightDetails;
  onReturn: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ flight, onReturn }) => {
  return (
    <div className="p-6 md:p-8 bg-booking-light flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8 text-center space-y-4 animate-fade-in">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold text-booking-primary">Booking Confirmed!</h2>
        <p className="text-gray-600">Your flight from {flight.origin.city} to {flight.destination.city} has been successfully booked.</p>
        <div className="text-left border-t border-b border-gray-200 py-4 my-4 space-y-1">
          <p><span className="font-semibold text-gray-800">Airline:</span> <span className="text-gray-600">{flight.airline} ({flight.flightNumber})</span></p>
          <p><span className="font-semibold text-gray-800">Departure Date:</span> <span className="text-gray-600">{new Date(flight.date).toDateString()}</span></p>
          <p><span className="font-semibold text-gray-800">Total Price:</span> <span className="text-gray-600">${flight.price}</span></p>
        </div>
        <button 
          onClick={onReturn}
          className="w-full bg-booking-secondary text-white font-bold py-3 px-4 rounded-md hover:bg-booking-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-booking-secondary">
          Book Another Flight
        </button>
      </div>
    </div>
  );
};