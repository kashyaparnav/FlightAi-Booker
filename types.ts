export type Sender = 'user' | 'bot';

export interface FlightDetails {
  airline: string;
  flightNumber: string;
  origin: {
    city: string;
    code: string;
    time: string;
  };
  destination: {
    city: string;
    code: string;
    time: string;
  };
  duration: number; // Duration in minutes
  price: number;
  date: string;
  stops: number;
  layover?: {
    duration: string;
    airport: string;
  };
  baggageAllowance: string;
  airlineRating: number;
  aircraftType?: string;
}

export interface FlightLeg {
  origin: string;
  destination: string;
  departureDate: string;
}

export interface MultiCityFlightGroup {
  leg: FlightLeg;
  flights: FlightDetails[];
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  multiCityFlights?: MultiCityFlightGroup[];
}