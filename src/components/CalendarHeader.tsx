import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';

interface CalendarHeaderProps {
    activeSystem: 'bs' | 'ad';
    onSystemChange: (system: 'bs' | 'ad') => void;
    onTodayClick: () => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onMenuClick: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    activeSystem,
    onSystemChange,
    onTodayClick,
    theme,
    onThemeToggle,
    onMenuClick
}) => {
    return (
        <header className="flex items-center justify-between py-3 px-1 sm:px-2 flex-shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            activeSystem === 'bs'
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        } text-sm sm:text-base`}
                        onClick={() => onSystemChange('bs')}
                    >
                        <span className="hidden md:inline">Bikram Sambat</span>
                        <span className="md:hidden">BS</span>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            activeSystem === 'ad'
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        } text-sm sm:text-base`}
                        onClick={() => onSystemChange('ad')}
                    >
                        <span className="hidden md:inline">Gregorian</span>
                        <span className="md:hidden">AD</span>
                    </button>
                </div>
                
                <button
                    onClick={onTodayClick}
                    aria-label="Go to today"
                    className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                >
                    आज
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    title="Open menu"
                    className="p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                    <Menu size={18} />
                </button>
                <button
                    onClick={onThemeToggle}
                    aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                    title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                    className="p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>
        </header>
    );
};

export default CalendarHeader;