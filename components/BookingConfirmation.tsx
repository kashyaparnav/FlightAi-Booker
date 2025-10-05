import React from 'react';
import { type FlightDetails } from '../types';
import { PlaneIcon } from './IconComponents';

interface BookingConfirmationProps {
  flight: FlightDetails;
  onConfirm: () => void;
  onCancel: () => void;
}

const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
};


export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ flight, onConfirm, onCancel }) => {
  return (
    <div className="p-6 md:p-8 bg-booking-light flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-booking-primary text-center">Confirm Your Flight</h2>
        <p className="text-center text-gray-600">Please review the details below before proceeding.</p>

        <div className="border border-gray-200 rounded-lg bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1 rounded">
                  <PlaneIcon className="w-5 h-5 text-booking-secondary" />
              </div>
              <span className="font-semibold text-gray-700">{flight.airline}</span>
              <span className="text-sm text-gray-500">({flight.flightNumber})</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">${flight.price}</p>
              <p className="text-sm text-gray-500">per person</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-800">
            <div className="text-left">
              <p className="text-xl font-semibold">{flight.origin.time}</p>
              <p className="font-medium text-booking-primary">{flight.origin.code}</p>
              <p className="text-sm text-gray-500">{flight.origin.city}</p>
            </div>
            <div className="flex-1 px-2 text-center">
              <p className="text-sm text-gray-500 mb-1">{formatDuration(flight.duration)}</p>
              <div className="relative h-px bg-gray-300">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-gray-500 rounded-full"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-gray-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Direct</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">{flight.destination.time}</p>
              <p className="font-medium text-booking-primary">{flight.destination.code}</p>
              <p className="text-sm text-gray-500">{flight.destination.city}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={onCancel}
            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="w-full bg-booking-accent text-booking-primary font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-booking-accent">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};