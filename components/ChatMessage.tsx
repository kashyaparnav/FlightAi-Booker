import React, { useState, useMemo } from 'react';
import { type Message, type FlightDetails } from '../types';
import { UserIcon, BotIcon, ArrowRightIcon } from './IconComponents';
import { FlightCard } from './FlightCard';
import { FilterControls, type StopsFilter, type TimeOfDayFilter } from './FilterControls';

interface ChatMessageProps {
  message: Message;
  onSelectFlight: (flight: FlightDetails) => void;
}

const getTimeOfDay = (time: string): TimeOfDayFilter => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon';
  return 'Evening';
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectFlight }) => {
  const isBot = message.sender === 'bot';
  const hasMultiCityFlights = message.multiCityFlights && message.multiCityFlights.length > 0;

  // State for filters
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [stopsFilter, setStopsFilter] = useState<StopsFilter>('Any');
  const [departureTimeFilter, setDepartureTimeFilter] = useState<TimeOfDayFilter>('Any');
  const [maxDuration, setMaxDuration] = useState<number>(1440); // Max 24h in minutes

  // Set initial max values from flight data
  const { initialMaxPrice, initialMaxDuration } = useMemo(() => {
    if (hasMultiCityFlights) {
      const allFlights = message.multiCityFlights!.flatMap(group => group.flights);
      if (allFlights.length === 0) return { initialMaxPrice: 1000, initialMaxDuration: 1440 };
      
      const maxP = Math.ceil(Math.max(...allFlights.map(f => f.price)) / 100) * 100;
      const maxD = Math.ceil(Math.max(...allFlights.map(f => f.duration)));
      setMaxPrice(maxP);
      setMaxDuration(maxD);
      return { initialMaxPrice: maxP, initialMaxDuration: maxD };
    }
    return { initialMaxPrice: 1000, initialMaxDuration: 1440 };
  }, [message.multiCityFlights, hasMultiCityFlights]);
  
  const filteredFlightGroups = useMemo(() => {
    if (!hasMultiCityFlights) return [];
    return message.multiCityFlights!.map(group => ({
      ...group,
      flights: group.flights.filter(flight => {
        // Price filter
        if (flight.price > maxPrice) return false;
        // Stops filter
        if (stopsFilter === 'Direct' && flight.stops !== 0) return false;
        if (stopsFilter === '1 Stop+' && flight.stops === 0) return false;
        // Departure time filter
        if (departureTimeFilter !== 'Any' && getTimeOfDay(flight.origin.time) !== departureTimeFilter) return false;
        // Duration filter
        if (flight.duration > maxDuration) return false;
        
        return true;
      })
    }));
  }, [message.multiCityFlights, hasMultiCityFlights, maxPrice, stopsFilter, departureTimeFilter, maxDuration]);


  return (
    <div className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-booking-primary flex-shrink-0 flex items-center justify-center text-white">
          <BotIcon className="w-5 h-5" />
        </div>
      )}
      <div className={`flex flex-col w-full max-w-2xl ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-4 py-3 rounded-lg shadow-sm ${
            isBot ? 'bg-gray-100 text-gray-800 rounded-tl-none' : 'bg-booking-secondary text-white rounded-br-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        {hasMultiCityFlights && (
          <div className="mt-4 space-y-6 w-full">
            <FilterControls
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              stopsFilter={stopsFilter}
              setStopsFilter={setStopsFilter}
              departureTimeFilter={departureTimeFilter}
              setDepartureTimeFilter={setDepartureTimeFilter}
              maxDuration={maxDuration}
              setMaxDuration={setMaxDuration}
              initialMaxPrice={initialMaxPrice}
              initialMaxDuration={initialMaxDuration}
            />
            {filteredFlightGroups.map((group, index) => (
                <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="font-bold text-booking-primary">Leg {index + 1}</span>
                        <span className="font-semibold text-gray-700">{group.leg.origin}</span>
                        <ArrowRightIcon className="w-5 h-5 text-gray-500" />
                        <span className="font-semibold text-gray-700">{group.leg.destination}</span>
                        <span className="text-sm text-gray-600 ml-auto">{new Date(group.leg.departureDate).toDateString()}</span>
                    </div>
                    {group.flights.length > 0 ? (
                        group.flights.map((flight, flightIndex) => (
                            <FlightCard key={flightIndex} flight={flight} onSelectFlight={onSelectFlight} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <p>No flights match your current filters for this leg.</p>
                        </div>
                    )}
                </div>
            ))}
          </div>
        )}
      </div>
       {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-gray-600">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};