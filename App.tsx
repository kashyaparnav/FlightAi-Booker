import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type Message, type FlightDetails } from './types';
import { initializeChat, sendMessageToAI } from './services/geminiService';
import { type Chat } from '@google/genai';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { BookingConfirmation } from './components/BookingConfirmation';
import { BookingSuccess } from './components/BookingSuccess';
import { BookingForm } from './components/BookingForm';

type BookingStep = 'chat' | 'confirm' | 'form' | 'success';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);

  // Updated state for booking flow
  const [bookingStep, setBookingStep] = useState<BookingStep>('chat');
  const [selectedFlight, setSelectedFlight] = useState<FlightDetails | null>(null);

  useEffect(() => {
    chatRef.current = initializeChat();
    setMessages([
      {
        id: 'initial-message',
        sender: 'bot',
        text: "Hello! I'm your AI flight booking assistant. How can I help you today? You can search for one-way, round-trip, or even multi-city flights. For example, try 'Find a round-trip flight from New York to London, departing next Friday and returning the following Sunday'.",
      },
    ]);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (chatRef.current) {
        const { text: botText, multiCityFlights } = await sendMessageToAI(chatRef.current, text);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botText,
          multiCityFlights: multiCityFlights,
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Handlers for the booking flow
  const handleSelectFlight = (flight: FlightDetails) => {
    setSelectedFlight(flight);
    setBookingStep('confirm');
  };

  const handleProceedToPayment = () => {
    if (selectedFlight) {
        setBookingStep('form');
    }
  };
  
  const handleCompleteBooking = () => {
    if (selectedFlight) {
        // In a real app, you would process payment here.
        console.log('Booking completed for:', selectedFlight);
        setBookingStep('success');
    }
  };

  const handleReturnToChat = () => {
    setSelectedFlight(null);
    setBookingStep('chat');
    // Optionally, reset chat
    setMessages([
      {
        id: 'return-message',
        sender: 'bot',
        text: "How else can I help you?",
      },
    ]);
  };
  
  const handleBackToConfirmation = () => {
    setBookingStep('confirm');
  }

  const renderContent = () => {
    switch(bookingStep) {
        case 'confirm':
            if (!selectedFlight) return null;
            return <BookingConfirmation flight={selectedFlight} onConfirm={handleProceedToPayment} onCancel={handleReturnToChat} />;
        case 'form':
            if (!selectedFlight) return null;
            return <BookingForm flight={selectedFlight} onCompleteBooking={handleCompleteBooking} onBack={handleBackToConfirmation} />;
        case 'success':
            if (!selectedFlight) return null;
            return <BookingSuccess flight={selectedFlight} onReturn={handleReturnToChat} />;
        case 'chat':
        default:
            return <ChatWindow
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onSelectFlight={handleSelectFlight}
            />;
    }
  };

  return (
    <div className="bg-booking-light font-sans w-screen h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-2xl flex flex-col">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
