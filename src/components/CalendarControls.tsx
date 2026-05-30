import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toDevanagari, fromDevanagari } from '../lib/bikramCalculations';

interface CalendarControlsProps {
    activeSystem: 'bs' | 'ad';
    currentYear: number;
    currentMonth: number;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onPrevYear: () => void;
    onNextYear: () => void;
}

const BIKRAM_SAMBAT_MONTHS = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुष", "माघ", "फाल्गुन", "चैत"];
const GREGORIAN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CalendarControls: React.FC<CalendarControlsProps> = ({
    activeSystem,
    currentYear,
    currentMonth,
    onYearChange,
    onMonthChange,
    onPrevMonth,
    onNextMonth,
    onPrevYear,
    onNextYear
}) => {
    const months = activeSystem === 'bs' ? BIKRAM_SAMBAT_MONTHS : GREGORIAN_MONTHS;

    const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeSystem === 'bs') {
            const devanagariValue = e.target.value;
            const englishValue = fromDevanagari(devanagariValue);
            const sanitizedEnglish = englishValue.replace(/[^0-9]/g, '');
            const year = parseInt(sanitizedEnglish) || currentYear;
            onYearChange(year);
        } else {
            const year = parseInt(e.target.value) || currentYear;
            onYearChange(year);
        }
    };

    return (
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
                <button
                    onClick={onPrevYear}
                    aria-label="Previous year"
                    title="Previous year"
                    className="p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    <ChevronLeft size={20} />
                    <ChevronLeft size={20} className="-ml-3" />
                </button>
                <button
                    onClick={onPrevMonth}
                    aria-label="Previous month"
                    title="Previous month"
                    className="p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <select
                    value={currentMonth}
                    onChange={(e) => onMonthChange(parseInt(e.target.value))}
                    aria-label="Select month"
                    className="px-2 py-1 bg-transparent border-none focus:ring-0 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    style={activeSystem === 'bs' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
                
                <input
                    type={activeSystem === 'bs' ? 'text' : 'number'}
                    value={activeSystem === 'bs' ? toDevanagari(currentYear) : currentYear}
                    onChange={handleYearInputChange}
                    aria-label="Enter year"
                    className="w-20 px-2 py-1 text-center bg-transparent border-none focus:ring-0 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    style={activeSystem === 'bs' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                    min={activeSystem === 'bs' ? 2000 : 1944}
                    max={activeSystem === 'bs' ? 2089 : 2043}
                />
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <button
                    onClick={onNextMonth}
                    aria-label="Next month"
                    title="Next month"
                    className="p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    <ChevronRight size={20} />
                </button>
                <button
                    onClick={onNextYear}
                    aria-label="Next year"
                    title="Next year"
                    className="p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    <ChevronRight size={20} />
                    <ChevronRight size={20} className="-ml-3" />
                </button>
            </div>
        </div>
    );
};

export default CalendarControls;