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
                <div key={`empty-start-${i}`} className="calendar-day empty-cell" />
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

            const isPurnima = panchanga.tithiName === "पूर्णिमा";
            const isAmavasya = panchanga.tithiName === "अमावस्या";
            const isEkadashi = panchanga.tithiName === "एकादशी";

            let classes = 'calendar-day focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400';
            if (date.getDay() === 6) classes += ' saturday';
            if (date.toDateString() === today.toDateString()) classes += ' today';
            if (isAmavasya) classes += ' amavasya';
            
            const isHoliday = events.some(event => event.holiday);
            if (isHoliday) classes += ' holiday';

            let tithiClass = 'tithi-display';

            if (isPurnima) {
                tithiClass += ' special purnima';
            }

            const ariaLabel = `${date.toDateString()} ${events.length > 0 ? `(${events.length} events)` : ''}`;

            cells.push(
                <div
                    key={day}
                    className={classes}
                    onClick={() => onDayClick(date)}
                    role="button"
                    tabIndex={0}
                    aria-label={ariaLabel}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onDayClick(date);
                        }
                    }}
                >
                    <span className="main-number" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {toDevanagari(day)}
                    </span>
                    <span className="sub-number">
                        {date.getDate()}
                    </span>
                    {isPurnima && <div className="purnima-dot"></div>}
                    {isEkadashi && <div className="ekadashi-dot"></div>}
                    <span className={tithiClass} style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {panchanga.tithiName}
                    </span>
                    {events.length > 0 && <div className="event-dot" />}
                </div>
            );
        }

        // Fill remaining cells
        const totalCells = cells.length;
        const remainder = totalCells % 7;
        if (remainder !== 0) {
            const extraCells = 7 - remainder;
            for (let i = 0; i < extraCells; i++) {
                cells.push(
                    <div key={`empty-end-${i}`} className="calendar-day empty-cell" />
                );
            }
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
                <div key={`empty-start-${i}`} className="calendar-day empty-cell" />
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

            const isPurnima = panchanga.tithiName === "पूर्णिमा";
            const isAmavasya = panchanga.tithiName === "अमावस्या";
            const isEkadashi = panchanga.tithiName === "एकादशी";

            let classes = 'calendar-day focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400';
            if (date.getUTCDay() === 6) classes += ' saturday';
            if (date.toDateString() === today.toDateString()) classes += ' today';
            if (isAmavasya) classes += ' amavasya';
            
            const isHoliday = events.some(event => event.holiday);
            if (isHoliday) classes += ' holiday';

            let tithiClass = 'tithi-display';

            if (isPurnima) {
                tithiClass += ' special purnima';
            }

            const ariaLabel = `${date.toDateString()} ${events.length > 0 ? `(${events.length} events)` : ''}`;

            cells.push(
                <div
                    key={day}
                    className={classes}
                    onClick={() => onDayClick(date)}
                    role="button"
                    tabIndex={0}
                    aria-label={ariaLabel}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onDayClick(date);
                        }
                    }}
                >
                    <span className="main-number">
                        {day}
                    </span>
                    <span className="sub-number" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {toDevanagari(bsDate.day)}
                    </span>
                    {isPurnima && <div className="purnima-dot"></div>}
                    {isEkadashi && <div className="ekadashi-dot"></div>}
                    <span className={tithiClass} style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {panchanga.tithiName}
                    </span>
                    {events.length > 0 && <div className="event-dot" />}
                </div>
            );
        }

        // Fill remaining cells
        const totalCells = cells.length;
        const remainder = totalCells % 7;
        if (remainder !== 0) {
            const extraCells = 7 - remainder;
            for (let i = 0; i < extraCells; i++) {
                cells.push(
                    <div key={`empty-end-${i}`} className="calendar-day empty-cell" />
                );
            }
        }

        return cells;
    };

    return (
        <div className="h-full flex flex-col p-1 sm:p-2 md:p-4">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-0 mb-0.5 sm:mb-1 md:mb-2 flex-shrink-0">
                {weekdays.map((day, index) => (
                    <div
                        key={day}
                        className={`weekday text-[10px] sm:text-xs md:text-sm py-0.5 sm:py-1 md:py-2 ${
                            index === 6 ? 'text-red-500 font-semibold' : 'text-gray-600 dark:text-gray-300'
                        }`}
                        style={activeSystem === 'bs' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 flex-1 bg-gray-200 dark:bg-gray-700 p-0.5 sm:p-1 rounded-lg overflow-hidden shadow-sm" style={{ gridAutoRows: '1fr' }}>
                {activeSystem === 'bs' ? renderBikramSambatCalendar() : renderGregorianCalendar()}
            </div>
        </div>
    );
};

export default CalendarGrid;