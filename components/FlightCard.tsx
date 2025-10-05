import React from 'react';
import { type FlightDetails } from '../types';
import { PlaneIcon, StarIcon, BaggageIcon } from './IconComponents';

interface FlightCardProps {
  flight: FlightDetails;
  onSelectFlight: (flight: FlightDetails) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {halfStar && <StarIcon key="half" className="w-4 h-4 text-yellow-400 fill-current" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" />
        ))}
        <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
      </div>
    );
};

const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
};

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelectFlight }) => {
  const stopsText = flight.stops === 0 
    ? 'Direct' 
    : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;
  
  return (
    <div className="border border-gray-200 rounded-lg shadow-md bg-white overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-1 rounded">
                    <PlaneIcon className="w-5 h-5 text-booking-secondary" />
                </div>
                <span className="font-semibold text-gray-700">{flight.airline}</span>
                <span className="text-sm text-gray-500 hidden sm:inline-block">({flight.flightNumber}{flight.aircraftType && ` · ${flight.aircraftType}`})</span>
            </div>
            <StarRating rating={flight.airlineRating} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${flight.price}</p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-gray-800">
          <div className="text-center sm:text-left">
            <p className="text-2xl font-semibold">{flight.origin.time}</p>
            <p className="text-lg font-medium text-booking-primary">{flight.origin.code}</p>
            <p className="text-sm text-gray-500">{flight.origin.city}</p>
          </div>
          
          <div className="flex-1 px-2 text-center">
            <p className="text-sm text-gray-500 mb-1">{formatDuration(flight.duration)}</p>
            <div className="relative h-px bg-gray-300">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-gray-500 rounded-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-gray-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
                {stopsText}
                {flight.layover && (
                    <span className="hidden sm:inline"> &middot; {flight.layover.duration} in {flight.layover.airport}</span>
                )}
            </p>
          </div>
          
          <div className="text-center sm:text-right">
            <p className="text-2xl font-semibold">{flight.destination.time}</p>
            <p className="text-lg font-medium text-booking-primary">{flight.destination.code}</p>
            <p className="text-sm text-gray-500">{flight.destination.city}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
            <BaggageIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span>{flight.baggageAllowance}</span>
        </div>
      </div>
      <div className="bg-gray-50 p-4">
        <button 
          onClick={() => onSelectFlight(flight)}
          className="w-full bg-booking-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-booking-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-booking-secondary">
          Select Flight
        </button>
      </div>
    </div>
  );
};