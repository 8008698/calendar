import React from 'react';
import { toBikramSambat, fromBikramSambat, getBikramMonthInfo } from '../lib/dateConversions';
import { _getPanchangaBasics, getEventsForDate } from '../lib/panchangaCalculations';
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

        // Days of the month
        for (let day = 1; day <= monthInfo.totalDays; day++) {
            const date = fromBikramSambat(currentYear, currentMonth, day);
            const panchanga = _getPanchangaBasics(date);
            const bsFullDate = toBikramSambat(date);
            const events = getEventsForDate(date, bsFullDate.year, bsFullDate.monthIndex, bsFullDate.day);

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
                    {(isPurnima || isAmavasya) && (
                        <span className="absolute top-2 left-2 text-lg">
                            {isPurnima ? '🌕' : '🌑'}
                        </span>
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
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const cells = [];

        // Empty cells at the beginning
        for (let i = 0; i < firstDay.getDay(); i++) {
            cells.push(
                <div key={`empty-${i}`} className="h-full bg-transparent" />
            );
        }

        // Days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(currentYear, currentMonth, day);
            const bsDate = toBikramSambat(date);
            const panchanga = _getPanchangaBasics(date);
            const events = getEventsForDate(date, bsDate.year, bsDate.monthIndex, bsDate.day);

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
                    <span className="main-number">
                        {day}
                    </span>
                    <span className="sub-number" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {toDevanagari(bsDate.day)}
                    </span>
                    {(isPurnima || isAmavasya) && (
                        <span className="absolute top-2 left-2 text-lg">
                            {isPurnima ? '🌕' : '🌑'}
                        </span>
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
        <div className="h-full flex flex-col">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 mb-1 flex-shrink-0">
                {weekdays.map((day, index) => (
                    <div
                        key={day}
                        className={`weekday ${
                            index === 6 ? 'bg-red-600 dark:bg-red-800' : 'bg-blue-600 dark:bg-gray-700'
                        }`}
                        style={activeSystem === 'bs' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 flex-1" style={{ gridAutoRows: '1fr' }}>
                {activeSystem === 'bs' ? renderBikramSambatCalendar() : renderGregorianCalendar()}
            </div>
        </div>
    );
};

export default CalendarGrid;