import React, { useState } from 'react';
import { type FlightDetails } from '../types';

interface BookingFormProps {
  flight: FlightDetails;
  onCompleteBooking: () => void;
  onBack: () => void;
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            id={id}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-booking-secondary'}`}
            {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);


export const BookingForm: React.FC<BookingFormProps> = ({ flight, onCompleteBooking, onBack }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const [errors, setErrors] = useState<Partial<typeof formData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<typeof formData> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
        if (!formData.email.trim()) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required.';
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required.';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            onCompleteBooking();
        }
    };

    return (
        <div className="p-6 md:p-8 bg-booking-light flex flex-col items-center justify-center h-full overflow-y-auto">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8 space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-booking-primary text-center">Enter Your Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold text-gray-800 px-2">Passenger Info</legend>
                        <div className="space-y-4">
                            <FormInput id="fullName" name="fullName" label="Full Name" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                            <FormInput id="email" name="email" label="Email Address" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} error={errors.email} />
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold text-gray-800 px-2">Payment Details</legend>
                        <div className="space-y-4">
                           <FormInput id="cardNumber" name="cardNumber" label="Card Number" type="text" placeholder="•••• •••• •••• ••••" value={formData.cardNumber} onChange={handleChange} error={errors.cardNumber} />
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <FormInput id="expiryDate" name="expiryDate" label="Expiry Date" type="text" placeholder="MM / YY" value={formData.expiryDate} onChange={handleChange} error={errors.expiryDate} />
                                </div>
                                <div className="w-1/2">
                                    <FormInput id="cvv" name="cvv" label="CVV" type="text" placeholder="123" value={formData.cvv} onChange={handleChange} error={errors.cvv} />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    
                    <div className="text-center text-gray-500 text-sm">
                        Total Price: <span className="font-bold text-booking-primary text-lg">${flight.price}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="button" onClick={onBack} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition-colors">
                            Back
                        </button>
                        <button type="submit" className="w-full bg-booking-accent text-booking-primary font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity">
                            Complete Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
