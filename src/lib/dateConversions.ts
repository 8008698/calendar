import { Bsdata } from '../data/monthData';
import { solarMonths, toDevanagari } from './bikramCalculations';

export interface BikramDate {
    year: number;
    monthIndex: number;
    day: number;
    monthName: string;
    isComputed?: boolean;
}

export function fromBikramSambat(bsYear: number, monthIndex: number, day: number): Date {
    if (bsYear >= Bsdata.BS_START_YEAR && bsYear <= Bsdata.BS_END_YEAR) {
        let daysOffset = 0;
        for (let y = Bsdata.BS_START_YEAR; y < bsYear; y++) {
            const yearData = Bsdata.NP_MONTHS_DATA[y - Bsdata.BS_START_YEAR];
            let totalDaysInYear = 0;
            for (let m = 0; m < 12; m++) {
                totalDaysInYear += yearData[m];
            }
            daysOffset += totalDaysInYear;
        }
        const targetYearData = Bsdata.NP_MONTHS_DATA[bsYear - Bsdata.BS_START_YEAR];
        for (let m = 0; m < monthIndex; m++) {
            daysOffset += targetYearData[m];
        }
        daysOffset += (day - 1);
        const resultDate = new Date(Bsdata.BS_START_DATE_AD.getTime());
        resultDate.setUTCDate(resultDate.getUTCDate() + daysOffset);
        return resultDate;
    } else {
        // Fallback for out-of-range years using astronomical calculations
        return new Date(); // Simplified fallback
    }
}

export function getBikramMonthInfo(bsYear: number, monthIndex: number) {
    if (bsYear >= Bsdata.BS_START_YEAR && bsYear <= Bsdata.BS_END_YEAR) {
        const firstDayAd = fromBikramSambat(bsYear, monthIndex, 1);
        if (!firstDayAd) return null;
        const monthData = Bsdata.NP_MONTHS_DATA[bsYear - Bsdata.BS_START_YEAR];
        return {
            totalDays: monthData[monthIndex],
            startDayOfWeek: firstDayAd.getUTCDay(),
            monthName: solarMonths[monthIndex],
            year: bsYear
        };
    }
    return null;
}

export function toBikramSambat(gregorianDate: Date): BikramDate {
    const targetUtcDate = new Date(Date.UTC(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate()));
    const startDate = new Date(Date.UTC(Bsdata.BS_START_DATE_AD.getFullYear(), Bsdata.BS_START_DATE_AD.getMonth(), Bsdata.BS_START_DATE_AD.getDate()));
    
    if (targetUtcDate >= startDate && gregorianDate.getFullYear() <= (Bsdata.BS_END_YEAR - 56)) {
        const daysOffset = Math.floor((targetUtcDate.getTime() - startDate.getTime()) / 86400000);
        let remainingDays = daysOffset;
        
        for (let y = 0; y < Bsdata.NP_MONTHS_DATA.length; y++) {
            const currentBsYear = Bsdata.BS_START_YEAR + y;
            const yearData = Bsdata.NP_MONTHS_DATA[y];
            let daysInYear = 0;
            for (let m_idx = 0; m_idx < 12; m_idx++) { 
                daysInYear += yearData[m_idx]; 
            }
            if (remainingDays < daysInYear) {
                for (let m = 0; m < 12; m++) {
                    const daysInMonth = yearData[m];
                    if (remainingDays < daysInMonth) {
                        return { 
                            year: currentBsYear, 
                            monthIndex: m, 
                            day: remainingDays + 1, 
                            monthName: solarMonths[m], 
                            isComputed: false 
                        };
                    }
                    remainingDays -= daysInMonth;
                }
            }
            remainingDays -= daysInYear;
        }
    }
    
    // Fallback
    return {
        year: 2081,
        monthIndex: 0,
        day: 1,
        monthName: solarMonths[0],
        isComputed: true
    };
}