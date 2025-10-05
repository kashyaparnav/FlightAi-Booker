import { GoogleGenAI, type Chat, Type, type FunctionDeclaration, GenerateContentResponse, type Tool, type FunctionCall } from '@google/genai';
import { type FlightDetails, type MultiCityFlightGroup, type FlightLeg } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const findFlightsFunctionDeclaration: FunctionDeclaration = {
  name: 'findFlights',
  description: 'Finds available flights based on a series of flight legs provided by the user for one-way, round-trip, or multi-city journeys.',
  parameters: {
    type: Type.OBJECT,
    properties: {
        legs: {
            type: Type.ARRAY,
            description: 'An array of flight legs for the journey. For a simple one-way trip, this will have one leg. For a round trip, it will have two legs.',
            items: {
                type: Type.OBJECT,
                properties: {
                    origin: { 
                        type: Type.STRING, 
                        description: 'The departure city or airport for this leg, e.g., "New York" or "JFK".' 
                    },
                    destination: { 
                        type: Type.STRING, 
                        description: 'The arrival city or airport for this leg, e.g., "London" or "LHR".' 
                    },
                    departureDate: { 
                        type: Type.STRING, 
                        description: 'The desired date of departure for this leg, in YYYY-MM-DD format.' 
                    }
                },
                required: ['origin', 'destination', 'departureDate']
            }
        }
    },
    required: ['legs'],
  },
};

const tools: Tool[] = [{ functionDeclarations: [findFlightsFunctionDeclaration] }];

const mockFlightSearch = (legs: FlightLeg[]): { multiCityFlights: MultiCityFlightGroup[] } => {
  console.log(`Searching for a multi-city trip with ${legs.length} legs...`);
  
  const multiCityFlights: MultiCityFlightGroup[] = legs.map((leg, index) => {
    console.log(`Leg ${index + 1}: From ${leg.origin} to ${leg.destination} on ${leg.departureDate}`);
    // For variety, let's slightly change the mock data for each leg
    const priceOffset = 50 * index;
    const durationOffset = 15 * index;

    return {
      leg,
      flights: [
        {
          airline: 'Gemini Airlines',
          flightNumber: `GA-78${index}`,
          origin: { city: leg.origin, code: 'JFK', time: '08:30' },
          destination: { city: leg.destination, code: 'LHR', time: '20:30' },
          duration: 480 + durationOffset,
          price: 675 + priceOffset,
          date: leg.departureDate,
          stops: 0,
          baggageAllowance: '1 carry-on, 1 checked bag',
          airlineRating: 4.7,
          aircraftType: 'Boeing 787',
        },
        {
          airline: 'React Airways',
          flightNumber: `RA-12${index}`,
          origin: { city: leg.origin, code: 'JFK', time: '14:00' },
          destination: { city: leg.destination, code: 'LHR', time: '02:00' },
          duration: 480 + durationOffset,
          price: 720 + priceOffset,
          date: leg.departureDate,
          stops: 0,
          baggageAllowance: '1 carry-on',
          airlineRating: 4.5,
          aircraftType: 'Airbus A320',
        },
        {
          airline: 'Gemini Airlines',
          flightNumber: `GA-45${index}`,
          origin: { city: leg.origin, code: 'JFK', time: '10:00' },
          destination: { city: leg.destination, code: 'LHR', time: '23:30' },
          duration: 570 + durationOffset,
          price: 550 + priceOffset,
          date: leg.departureDate,
          stops: 1,
          layover: { duration: '1h 30m', airport: 'CDG' },
          baggageAllowance: '1 carry-on',
          airlineRating: 4.2,
          aircraftType: 'Boeing 737',
        },
      ]
    };
  });
  
  return { multiCityFlights };
};

export const initializeChat = (): Chat => {
  const currentDate = new Date().toISOString().split('T')[0];
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      tools: tools,
      systemInstruction: `You are a friendly and efficient flight booking assistant. Your goal is to help users find flights by identifying their origin, destination, and desired dates for each leg of their journey.

- For **one-way** trips, you need an origin, destination, and a departure date.
- For **round trips**, you need an origin, a destination, a departure date, and a return date. You must model this as two separate legs: one for the outbound flight and one for the return flight.
- For **multi-city** trips, you will need to get the details for each leg of the journey.

**Date Handling Rules:**
- You must always resolve dates to a specific 'YYYY-MM-DD' format before calling the tool.
- The current date is ${currentDate}.
- If the user provides a relative date (e.g., 'tomorrow', 'next Friday'), calculate the absolute date based on the current date.
- **Validation:** You must ensure all departure dates are not in the past. For round trips, the return date must be after the departure date. If the user provides an invalid date, you must ask them for a valid one.

Use the findFlights tool only when you have all the necessary information for all legs. When presenting flight options, be concise and let the formatted flight cards display the main details.`,
    },
  });
};

export const sendMessageToAI = async (chat: Chat, message: string): Promise<{ text: string; multiCityFlights?: MultiCityFlightGroup[] }> => {
  let response: GenerateContentResponse = await chat.sendMessage({ message });

  const functionCalls = response.functionCalls;
  if (functionCalls && functionCalls.length > 0) {
    const fc = functionCalls[0];
    if (fc.name === 'findFlights') {
      const { legs } = fc.args as { legs: FlightLeg[] };
      const { multiCityFlights } = mockFlightSearch(legs);
      
      response = await chat.sendMessage({
        message: [
          {
            functionResponse: {
              name: 'findFlights',
              response: { flights: multiCityFlights }, // The tool returns the whole structure
            },
          },
        ],
      });
      return { text: response.text, multiCityFlights };
    }
  }

  return { text: response.text };
};