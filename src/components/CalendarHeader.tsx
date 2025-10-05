import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface CalendarHeaderProps {
    activeSystem: 'bs' | 'ad';
    onSystemChange: (system: 'bs' | 'ad') => void;
    onTodayClick: () => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    activeSystem,
    onSystemChange,
    onTodayClick,
    theme,
    onThemeToggle
}) => {
    return (
        <header className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                        className={`px-4 py-2 rounded-md transition-all duration-200 ${
                            activeSystem === 'bs'
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-orange-500'
                        } text-sm sm:text-base font-medium`}
                        onClick={() => onSystemChange('bs')}
                    >
                        <span className="hidden md:inline">Bikram Sambat</span>
                        <span className="md:hidden">BS</span>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md transition-all duration-200 ${
                            activeSystem === 'ad'
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-orange-500'
                        } text-sm sm:text-base font-medium`}
                        onClick={() => onSystemChange('ad')}
                    >
                        <span className="hidden md:inline">Gregorian</span>
                        <span className="md:hidden">AD</span>
                    </button>
                </div>
                
                <button
                    onClick={onTodayClick}
                    className="px-4 sm:px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium text-sm sm:text-base"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                >
                    आज
                </button>
            </div>

            <button
                onClick={onThemeToggle}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200"
            >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
        </header>
    );
};

export default CalendarHeader;