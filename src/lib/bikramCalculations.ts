/**
 * Bikram Calculator - Hindu Astrological Calendar with panchanga
 * Copyright (C) 2025 Khumnath Cg <nath.khum@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { Bsdata } from '../data/monthData';

// Re-export for backward compatibility
export { Bsdata };

// Caching
let calculationCache: Record<string, any> = {};
export function clearCache() {
    calculationCache = {};
}

// Surya Siddhanta Constants
const YugaRotation = { 'star': 1582237828, 'sun': 4320000, 'moon': 57753336, 'mercury': 17937060, 'venus': 7022376, 'mars': 2296832, 'jupiter': 364220, 'saturn': 146568, 'Candrocca': 488203, 'Rahu': -232238 };
const YugaCivilDays = 1577917828;
const KaliEpoch = 588465.5;
const PlanetApogee = { 'sun': 77 + 17 / 60 };
const PlanetCircumm = { 'sun': 13 + 50 / 60, 'moon': 31 + 50 / 60 };
const rad = 180 / Math.PI;

// Panchanga Names
const tithiNamesList = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा", "अमावस्या"];
const nakshatras = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "अश्लेषा", "मघा", "पूर्व फाल्गुनी", "उत्तर फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्व भाद्रपद", "उत्तर भाद्रपद", "रेवती"];
const yogas = ["विष्कम्भ", "प्रीति", "आयुष्मान्", "सौभाग्य", "शोभन", "अतिगण्ड", "सुकर्म", "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र", "सिद्धि", "व्यतिपात", "वरीयान्", "परिघ", "शिव", "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म", "इन्द्र", "वैधृति"];
const karanas = ["किंस्तुघ्न", "बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि", "शकुनि", "चतुष्पाद", "नाग"];
const rashis = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"];
export const solarMonths = ["वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन", "चैत्र"];
const weekdays = ["आइतबार", "सोमबार", "मङ्गलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"];

// Helper Functions
function zero360(x: number) { return x - Math.floor(x / 360) * 360; }
function sinDeg(deg: number) { return Math.sin(deg / rad); }
function cosDeg(deg: number) { return Math.cos(deg / rad); }
function arcsinDeg(x: number) { return Math.asin(x) * rad; }

export function toDevanagari(n: number | string): string { 
    try { 
        return n.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[parseInt(d)]); 
    } catch(e) { 
        return n.toString(); 
    } 
}

export function fromDevanagari(s: string): string {
    try { 
        return s.toString().replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d).toString()); 
    } catch (e) { 
        return s; 
    }
}

function formatMonthDay(month: number, day: number) {
    return (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
}

function toJulianDay(year: number, month: number, day: number) {
    let m = month + 1;
    let y = year;
    if (m <= 2) { y--; m += 12; }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

function fromJulianDay(jd: number) {
    jd += 0.5;
    const z = Math.floor(jd);
    const f = jd - z;
    let a;
    if (z < 2299161) { a = z; }
    else {
        const alpha = Math.floor((z - 1867216.25) / 36524.25);
        a = z + 1 + alpha - Math.floor(alpha / 4);
    }
    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);
    const day = Math.floor(b - d - Math.floor(30.6001 * e) + f);
    const month = (e < 14) ? e - 1 : e - 13;
    const year = (month > 2) ? c - 4716 : c - 4715;
    return new Date(Date.UTC(year, month - 1, day));
}

// Core Surya Siddhanta Calculations
function meanLongitude(ahar: number, rotation: number) { return zero360(rotation * ahar * 360 / YugaCivilDays); }

function mandaEquation(meanLong: number, apogee: number, circ: number) { return arcsinDeg(circ / 360 * sinDeg(meanLong - apogee)); }

function trueLongitudeSun(ahar: number) {
    const meanLong = meanLongitude(ahar, YugaRotation.sun);
    const manda = mandaEquation(meanLong, PlanetApogee.sun, PlanetCircumm.sun);
    return zero360(meanLong - manda);
}

function trueLongitudeMoon(ahar: number) {
    const meanLong = meanLongitude(ahar, YugaRotation.moon);
    const apogee = meanLongitude(ahar, YugaRotation.Candrocca) + 90;
    const manda = mandaEquation(meanLong, apogee, PlanetCircumm.moon);
    return zero360(meanLong - manda);
}

function getTithi(sunLong: number, moonLong: number) { return zero360(moonLong - sunLong) / 12; }

function findNewMoon(ahar: number) {
    const getElongation = (a: number) => zero360(trueLongitudeMoon(a) - trueLongitudeSun(a));
    let guess = ahar;
    for (let i = 0; i < 10; i++) {
        const elong = getElongation(guess);
        if (elong < 5 || elong > 355) break;
        const correction = (elong < 180 ? -elong : 360 - elong) / 12.19;
        guess += correction;
    }
    let lo = guess - 2, hi = guess + 2;
    for (let j = 0; j < 30; j++) {
        const mid = (lo + hi) / 2;
        const em = getElongation(mid);
        if (em < 180) { hi = mid; } else { lo = mid; }
    }
    return (lo + hi) / 2;
}

function findPurnima(ahar: number) {
    const getElongation = (a: number) => zero360(trueLongitudeMoon(a) - trueLongitudeSun(a));
    let guess = ahar;
    for (let i = 0; i < 10; i++) {
        const elong = getElongation(guess);
        if (Math.abs(elong - 180) < 5) break;
        const correction = (180 - elong) / 12.19;
        guess += correction;
    }
    let lo = guess - 2, hi = guess + 2;
    for (let j = 0; j < 30; j++) {
        const mid = (lo + hi) / 2;
        const em = getElongation(mid);
        if (em < 180) { lo = mid; } else { hi = mid; }
    }
    return (lo + hi) / 2;
}

export function getSunriseSunset(date: Date, lat = 27.7172, lon = 85.3240, tz = 5.75) {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getUTCFullYear(), 0, 0).getTime()) / 86400000);
    const B = (360 / 365) * (dayOfYear - 81) / rad;
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const lstm = 15 * tz;
    const tc = (4 * (lon - lstm) + eot) / 60;
    const declination = -23.45 * cosDeg(360 / 365 * (dayOfYear + 10));
    const hourAngleRad = Math.acos((sinDeg(-0.833) - sinDeg(lat) * sinDeg(declination)) / (cosDeg(lat) * cosDeg(declination)));
    const hourAngle = hourAngleRad * rad;
    const sunrise = 12 - hourAngle / 15 - tc;
    const sunset = 12 + hourAngle / 15 - tc;
    const formatTime = (h: number) => {
        if (!isFinite(h)) return "N/A";
        let hr = Math.floor(h);
        let min = Math.round((h - hr) * 60);
        if (min === 60) { hr++; min = 0; }
        return (hr < 10 ? '0' : '') + hr + ":" + (min < 10 ? '0' : '') + min;
    };
    return { sunrise: formatTime(sunrise), sunset: formatTime(sunset) };
}