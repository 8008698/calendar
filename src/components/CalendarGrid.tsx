import React from 'react';
import { toBikramSambat, fromBikramSambat, getBikramMonthInfo } from '../lib/dateConversions';
import { _getPanchangaBasics, getEventsForMonthBatched } from '../lib/panchangaCalculations';
import { toDevanagari } from '../lib/bikramCalculations';

interface CalendarGridProps {
    activeSystem: 'bs' | 'ad';
    currentYear: number;
    currentMonth: number;
    onDayClick: (date: Date) => void;
}

const WEEKDAYS_NEPALI = ["आइत", "सोम", "मङ्गल", "बुध", "बिही", "शुक्र", "शनि"];
const WEEKDAYS_ENGLISH = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid: React.FC<CalendarGridProps> = ({
    activeSystem,
    currentYear,
    currentMonth,
    onDayClick
}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekdays = activeSystem === 'bs' ? WEEKDAYS_NEPALI : WEEKDAYS_ENGLISH;

    const renderBikramSambatCalendar = () => {
        const monthInfo = getBikramMonthInfo(currentYear, currentMonth);
        if (!monthInfo) {
            return (
                <div className="col-span-7 p-8 text-center text-red-500">
                    Data unavailable for this date range
                </div>
            );
        }

        const cells = [];
        
        // Empty cells at the beginning
        for (let i = 0; i < monthInfo.startDayOfWeek; i++) {
            cells.push(
                <div key={`empty-${i}`} className="h-full bg-transparent" />
            );
        }

        const daysToBatch = [];
        for (let day = 1; day <= monthInfo.totalDays; day++) {
            const date = fromBikramSambat(currentYear, currentMonth, day);
            const bsFullDate = toBikramSambat(date);
            daysToBatch.push({ date, bsYear: bsFullDate.year, bsMonthIndex: bsFullDate.monthIndex, bsDay: bsFullDate.day });
        }

        const batchedEvents = getEventsForMonthBatched(daysToBatch);

        // Days of the month
        for (let day = 1; day <= monthInfo.totalDays; day++) {
            const date = daysToBatch[day - 1].date;
            const panchanga = _getPanchangaBasics(date);
            const events = batchedEvents.get(day - 1) || [];

            let classes = 'calendar-day';
            if (date.getDay() === 6) classes += ' saturday';
            if (date.toDateString() === today.toDateString()) classes += ' today';
            
            const isHoliday = events.some(event => event.holiday);
            if (isHoliday) classes += ' holiday';

            let tithiClass = 'tithi-display';

            if (panchanga.tithiName === "पूर्णिमा") {
                tithiClass += ' special purnima';
            } else if (panchanga.tithiName === "अमावस्या") {
                tithiClass += ' special amavasya';
            }

            const isPurnima = panchanga.tithiName === "पूर्णिमा";
            const isAmavasya = panchanga.tithiName === "अमावस्या";

            cells.push(
                <div
                    key={day}
                    className={classes}
                    onClick={() => onDayClick(date)}
                >
                    <span className="main-number" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {toDevanagari(day)}
                    </span>
                    <span className="sub-number">
                        {date.getDate()}
                    </span>
                    {isPurnima && (
                        <svg className="absolute top-1 left-1 sm:top-2 sm:left-2 w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" className="fill-yellow-400 dark:fill-yellow-300 stroke-yellow-600 dark:stroke-yellow-500" strokeWidth="1" />
                        </svg>
                    )}
                    {isAmavasya && (
                        <svg className="absolute top-1 left-1 sm:top-2 sm:left-2 w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" className="fill-gray-800 dark:fill-gray-600 stroke-gray-900 dark:stroke-gray-500" strokeWidth="1" />
                        </svg>
                    )}
                    <span className={tithiClass} style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {panchanga.tithiName}
                    </span>
                    {events.length > 0 && <div className="event-dot" />}
                </div>
            );
        }

        return cells;
    };

    const renderGregorianCalendar = () => {
        const firstDay = new Date(Date.UTC(currentYear, currentMonth, 1));
        const lastDay = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
        const cells = [];

        // Empty cells at the beginning
        for (let i = 0; i < firstDay.getUTCDay(); i++) {
            cells.push(
                <div key={`empty-${i}`} className="h-full bg-transparent" />
            );
        }

        const daysToBatch = [];
        for (let day = 1; day <= lastDay.getUTCDate(); day++) {
            const date = new Date(Date.UTC(currentYear, currentMonth, day));
            const bsDate = toBikramSambat(date);
            daysToBatch.push({ date, bsYear: bsDate.year, bsMonthIndex: bsDate.monthIndex, bsDay: bsDate.day, bsDateObj: bsDate });
        }

        const batchedEvents = getEventsForMonthBatched(daysToBatch);

        // Days of the month
        for (let day = 1; day <= lastDay.getUTCDate(); day++) {
            const date = daysToBatch[day - 1].date;
            const bsDate = daysToBatch[day - 1].bsDateObj;
            const panchanga = _getPanchangaBasics(date);
            const events = batchedEvents.get(day - 1) || [];

            let classes = 'calendar-day';
            if (date.getUTCDay() === 6) classes += ' saturday';
            if (date.toDateString() === today.toDateString()) classes += ' today';
            
            const isHoliday = events.some(event => event.holiday);
            if (isHoliday) classes += ' holiday';

            let tithiClass = 'tithi-display';

            if (panchanga.tithiName === "पूर्णिमा") {
                tithiClass += ' special purnima';
            } else if (panchanga.tithiName === "अमावस्या") {
                tithiClass += ' special amavasya';
            }

            const isPurnima = panchanga.tithiName === "पूर्णिमा";
            const isAmavasya = panchanga.tithiName === "अमावस्या";

            cells.push(
                <div
                    key={day}
                    className={classes}
                    onClick={() => onDayClick(date)}
                >
                    <span className="main-number">
                        {day}
                    </span>
                    <span className="sub-number" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {toDevanagari(bsDate.day)}
                    </span>
                    {isPurnima && (
                        <svg className="absolute top-1 left-1 sm:top-2 sm:left-2 w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" className="fill-yellow-400 dark:fill-yellow-300 stroke-yellow-600 dark:stroke-yellow-500" strokeWidth="1" />
                        </svg>
                    )}
                    {isAmavasya && (
                        <svg className="absolute top-1 left-1 sm:top-2 sm:left-2 w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" className="fill-gray-800 dark:fill-gray-600 stroke-gray-900 dark:stroke-gray-500" strokeWidth="1" />
                        </svg>
                    )}
                    <span className={tithiClass} style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {panchanga.tithiName}
                    </span>
                    {events.length > 0 && <div className="event-dot" />}
                </div>
            );
        }

        return cells;
    };

    return (
        <div className="h-full flex flex-col p-4">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-0 mb-2 flex-shrink-0">
                {weekdays.map((day, index) => (
                    <div
                        key={day}
                        className={`weekday ${
                            index === 6 ? 'text-red-500' : ''
                        }`}
                        style={activeSystem === 'bs' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 flex-1 border-t border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm" style={{ gridAutoRows: '1fr' }}>
                {activeSystem === 'bs' ? renderBikramSambatCalendar() : renderGregorianCalendar()}
            </div>
        </div>
    );
};

export default CalendarGrid;