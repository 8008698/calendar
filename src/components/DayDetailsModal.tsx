import React from 'react';
import { X } from 'lucide-react';
import { calculate } from '../lib/panchangaCalculations';

interface DayDetailsModalProps {
    date: Date | null;
    isOpen: boolean;
    onClose: () => void;
}

const DayDetailsModal: React.FC<DayDetailsModalProps> = ({ date, isOpen, onClose }) => {
    if (!isOpen || !date) return null;

    const data = calculate(date);

    if (data.error) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-red-500">Error</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-red-500">{data.error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 
                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                            >
                                {data.weekday}, {data.bikramSambat}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{data.gregorianDate}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Sunrise/Sunset */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl">
                            <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">सूर्योदय</div>
                            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{data.sunrise}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl">
                            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">सूर्यास्त</div>
                            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{data.sunset}</div>
                        </div>
                    </div>

                    {/* Panchanga Information */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                            पञ्चाङ्ग विवरण
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'तिथी', value: data.tithi },
                                { label: 'पक्ष', value: data.paksha },
                                { label: 'चन्द्रमास', value: data.lunarMonth },
                                { label: 'नक्षत्र', value: data.nakshatra },
                                { label: 'योग', value: data.yoga },
                                { label: 'करण', value: data.karana },
                                { label: 'सूर्य राशि', value: data.sunRashi },
                                { label: 'चन्द्र राशि', value: data.moonRashi }
                            ].map((item, index) => (
                                <div key={index} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                    <span 
                                        className="text-gray-600 dark:text-gray-400 font-medium"
                                        style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                                    >
                                        {item.label}:
                                    </span>
                                    <strong 
                                        className="text-gray-900 dark:text-white"
                                        style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                                    >
                                        {item.value || '-'}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Events */}
                    {data.events && data.events.length > 0 ? (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
                            <h3 
                                className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200"
                                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                            >
                                आजका घटनाहरू
                            </h3>
                            <div className="space-y-3">
                                {data.events.map((event: any, index: number) => (
                                    <div key={index} className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <strong 
                                                        className="text-green-800 dark:text-green-200"
                                                        style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                                                    >
                                                        {event.name}
                                                    </strong>
                                                    {event.holiday && (
                                                        <span className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
                                                            Holiday
                                                        </span>
                                                    )}
                                                </div>
                                                {event.detail && (
                                                    <p 
                                                        className="text-sm text-gray-600 dark:text-gray-300"
                                                        style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                                                    >
                                                        {event.detail}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium ml-2">
                                                {event.category || 'general'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p 
                                className="text-gray-500 dark:text-gray-400"
                                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                            >
                                आज कुनै विशेष घटना छैन।
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayDetailsModal;