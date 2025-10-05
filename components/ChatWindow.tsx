import React, { useRef, useEffect } from 'react';
import { type Message, type FlightDetails } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSelectFlight: (flight: FlightDetails) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage, onSelectFlight }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onSelectFlight={onSelectFlight} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg p-3 max-w-lg">
                 <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                  </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-gray-200 p-4 bg-white">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
