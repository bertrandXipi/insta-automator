import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Check, Loader2 } from 'lucide-react';

interface DatePickerProps {
  value: string; // Format "DD/MM"
  onSave: (date: string, dayName: string, weekNumber: number) => void;
}

// Mapping des jours en français
const DAYS_FULL = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Calcule le numéro de semaine (1-9) basé sur la stratégie
// Semaine 1 = 01/12 au 07/12, Semaine 2 = 08/12 au 14/12, etc.
const getWeekNumber = (day: number, month: number, year: number): number => {
  const targetDate = new Date(year, month, day);
  // Le lundi de la semaine 1 est le 1er décembre 2025
  const strategyStart = new Date(2025, 11, 1); // 1er décembre 2025
  
  const diffTime = targetDate.getTime() - strategyStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNum = Math.floor(diffDays / 7) + 1;
  
  // Limiter entre 1 et 9
  return Math.max(1, Math.min(9, weekNum));
};

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function DatePicker({ value, onSave }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const [day, month] = value.split('/').map(Number);
  const currentYear = new Date().getFullYear();
  
  const [viewMonth, setViewMonth] = useState(month - 1); // 0-indexed
  const [viewYear, setViewYear] = useState(currentYear);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Reset view when value changes
  useEffect(() => {
    const [d, m] = value.split('/').map(Number);
    setViewMonth(m - 1);
  }, [value]);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Monday=0
  };

  const handleSelectDate = async (selectedDay: number) => {
    const newDate = `${String(selectedDay).padStart(2, '0')}/${String(viewMonth + 1).padStart(2, '0')}`;
    
    if (newDate !== value) {
      setStatus('saving');
      await new Promise(r => setTimeout(r, 400));
      
      // Calculer le jour de la semaine et le numéro de semaine
      const year = viewMonth >= 11 ? currentYear : currentYear + 1; // Décembre = année courante, sinon année suivante
      const dateObj = new Date(year, viewMonth, selectedDay);
      const dayName = DAYS_FULL[dateObj.getDay()];
      const weekNumber = getWeekNumber(selectedDay, viewMonth, year);
      
      onSave(newDate, dayName, weekNumber);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    }
    
    setIsOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
  const isCurrentMonth = viewMonth === month - 1;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-lg font-bold text-gray-900 dark:text-white border-b-2 border-jdl-red pb-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded transition-colors cursor-pointer"
      >
        <Calendar size={16} className="text-jdl-red" />
        <span>{value}</span>
        {status === 'saving' && <Loader2 size={14} className="animate-spin text-gray-400" />}
        {status === 'saved' && <Check size={14} className="text-green-500" />}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 p-4 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <span className="font-semibold text-gray-900 dark:text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_SHORT.map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = isCurrentMonth && dayNum === day;
              
              return (
                <button
                  key={dayNum}
                  onClick={() => handleSelectDate(dayNum)}
                  className={`
                    w-8 h-8 rounded-lg text-sm font-medium transition-all
                    ${isSelected 
                      ? 'bg-jdl-red text-white shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
