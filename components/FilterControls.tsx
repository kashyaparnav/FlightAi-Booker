import React from 'react';

export type StopsFilter = 'Any' | 'Direct' | '1 Stop+';
export type TimeOfDayFilter = 'Any' | 'Morning' | 'Afternoon' | 'Evening';

interface FilterControlsProps {
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  stopsFilter: StopsFilter;
  setStopsFilter: (value: StopsFilter) => void;
  departureTimeFilter: TimeOfDayFilter;
  setDepartureTimeFilter: (value: TimeOfDayFilter) => void;
  maxDuration: number;
  setMaxDuration: (value: number) => void;
  initialMaxPrice: number;
  initialMaxDuration: number;
}

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
      isActive
        ? 'bg-booking-secondary text-white border-booking-secondary'
        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
    }`}
  >
    {label}
  </button>
);

const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
};

export const FilterControls: React.FC<FilterControlsProps> = ({
  maxPrice,
  setMaxPrice,
  stopsFilter,
  setStopsFilter,
  departureTimeFilter,
  setDepartureTimeFilter,
  maxDuration,
  setMaxDuration,
  initialMaxPrice,
  initialMaxDuration
}) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4 mb-4">
      {/* Price & Duration Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="price" className="font-semibold text-sm text-gray-700">
              Max Price
            </label>
            <span className="text-sm font-bold text-booking-primary">${maxPrice}</span>
          </div>
          <input
            type="range"
            id="price"
            min={0}
            max={initialMaxPrice}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-booking-secondary"
          />
        </div>
        <div className="space-y-2">
            <div className="flex justify-between items-center">
            <label htmlFor="duration" className="font-semibold text-sm text-gray-700">
                Max Duration
            </label>
            <span className="text-sm font-bold text-booking-primary">{formatDuration(maxDuration)}</span>
            </div>
            <input
            type="range"
            id="duration"
            min={0}
            max={initialMaxDuration}
            step={15}
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-booking-secondary"
            />
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stops Filter */}
        <div className="space-y-2">
            <label className="font-semibold text-sm text-gray-700">Stops</label>
            <div className="flex space-x-2">
            {(['Any', 'Direct', '1 Stop+'] as StopsFilter[]).map(s => (
                <FilterButton key={s} label={s} isActive={stopsFilter === s} onClick={() => setStopsFilter(s)} />
            ))}
            </div>
        </div>

        {/* Departure Time Filter */}
        <div className="space-y-2">
            <label className="font-semibold text-sm text-gray-700">Departure Time</label>
            <div className="flex space-x-2 flex-wrap gap-y-2">
            {(['Any', 'Morning', 'Afternoon', 'Evening'] as TimeOfDayFilter[]).map(t => (
                <FilterButton key={t} label={t} isActive={departureTimeFilter === t} onClick={() => setDepartureTimeFilter(t)} />
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};