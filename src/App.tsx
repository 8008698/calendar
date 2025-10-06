import React, { useState, useEffect } from 'react';
import CalendarHeader from './components/CalendarHeader';
import CalendarControls from './components/CalendarControls';
import CalendarGrid from './components/CalendarGrid';
import DayDetailsModal from './components/DayDetailsModal';
import MonthlyEvents from './components/MonthlyEvents';
import { toBikramSambat } from './lib/dateConversions';

function App() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [activeSystem, setActiveSystem] = useState<'bs' | 'ad'>('bs');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const today = new Date();
    const todayBs = toBikramSambat(today);
    
    const [currentBsYear, setCurrentBsYear] = useState(todayBs.year);
    const [currentBsMonth, setCurrentBsMonth] = useState(todayBs.monthIndex);
    const [currentAdYear, setCurrentAdYear] = useState(today.getFullYear());
    const [currentAdMonth, setCurrentAdMonth] = useState(today.getMonth());

    // Theme management
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        
        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleSystemChange = (system: 'bs' | 'ad') => {
        setActiveSystem(system);
    };

    const handleTodayClick = () => {
        setCurrentBsYear(todayBs.year);
        setCurrentBsMonth(todayBs.monthIndex);
        setCurrentAdYear(today.getFullYear());
        setCurrentAdMonth(today.getMonth());
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handlePrevMonth = () => {
        if (activeSystem === 'bs') {
            if (currentBsMonth === 0) {
                setCurrentBsMonth(11);
                setCurrentBsYear(currentBsYear - 1);
            } else {
                setCurrentBsMonth(currentBsMonth - 1);
            }
        } else {
            if (currentAdMonth === 0) {
                setCurrentAdMonth(11);
                setCurrentAdYear(currentAdYear - 1);
            } else {
                setCurrentAdMonth(currentAdMonth - 1);
            }
        }
    };

    const handleNextMonth = () => {
        if (activeSystem === 'bs') {
            if (currentBsMonth === 11) {
                setCurrentBsMonth(0);
                setCurrentBsYear(currentBsYear + 1);
            } else {
                setCurrentBsMonth(currentBsMonth + 1);
            }
        } else {
            if (currentAdMonth === 11) {
                setCurrentAdMonth(0);
                setCurrentAdYear(currentAdYear + 1);
            } else {
                setCurrentAdMonth(currentAdMonth + 1);
            }
        }
    };

    const handlePrevYear = () => {
        if (activeSystem === 'bs') {
            setCurrentBsYear(currentBsYear - 1);
        } else {
            setCurrentAdYear(currentAdYear - 1);
        }
    };

    const handleNextYear = () => {
        if (activeSystem === 'bs') {
            setCurrentBsYear(currentBsYear + 1);
        } else {
            setCurrentAdYear(currentAdYear + 1);
        }
    };

    const currentYear = activeSystem === 'bs' ? currentBsYear : currentAdYear;
    const currentMonth = activeSystem === 'bs' ? currentBsMonth : currentAdMonth;

    return (
        <div className="h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex flex-col overflow-hidden">
            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 px-2 sm:px-4 lg:px-6 xl:px-8 overflow-hidden">
                <CalendarHeader
                    activeSystem={activeSystem}
                    onSystemChange={handleSystemChange}
                    onTodayClick={handleTodayClick}
                    theme={theme}
                    onThemeToggle={handleThemeToggle}
                />

                <div className="py-2 space-y-2 flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex-1 flex flex-col min-h-0 overflow-hidden">
                        <CalendarControls
                            activeSystem={activeSystem}
                            currentYear={currentYear}
                            currentMonth={currentMonth}
                            onYearChange={(year) => {
                                if (activeSystem === 'bs') {
                                    setCurrentBsYear(year);
                                } else {
                                    setCurrentAdYear(year);
                                }
                            }}
                            onMonthChange={(month) => {
                                if (activeSystem === 'bs') {
                                    setCurrentBsMonth(month);
                                } else {
                                    setCurrentAdMonth(month);
                                }
                            }}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                            onPrevYear={handlePrevYear}
                            onNextYear={handleNextYear}
                        />

                        <div className="p-3 flex-1 min-h-0 overflow-hidden">
                            <CalendarGrid
                                activeSystem={activeSystem}
                                currentYear={currentYear}
                                currentMonth={currentMonth}
                                onDayClick={handleDayClick}
                            />
                        </div>
                    </div>

                    <MonthlyEvents
                        activeSystem={activeSystem}
                        currentYear={currentYear}
                        currentMonth={currentMonth}
                    />
                </div>
            </div>

            <DayDetailsModal
                date={selectedDate}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default App;