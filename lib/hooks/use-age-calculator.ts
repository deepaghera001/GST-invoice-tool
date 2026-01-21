import { useState, useMemo } from 'react';
import { 
  differenceInYears, 
  differenceInMonths, 
  differenceInDays, 
  addYears, 
  addMonths, 
  isBefore, 
  startOfDay,
  format,
  isAfter,
  nextDay,
  setYear,
  isLeapYear,
  differenceInWeeks,
  addDays,
  addSeconds
} from 'date-fns';

export interface AgeInsights {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBirthday: {
    date: Date;
    daysLeft: number;
    monthsLeft: number;
    weekday: string;
  };
  zodiac: {
    name: string;
  };
  eligibility: {
    voting: boolean;
    driving: boolean;
    seniorCitizen: boolean;
    retirement: number | null; // years until 60
  };
  lifeProgress: number; // percentage based on 80 years
  chineseZodiac: {
    name: string;
  };
  planetaryAges: {
    planet: string;
    age: number;
    color: string;
  }[];
  funMilestones: {
    label: string;
    date: Date;
    status: 'passed' | 'upcoming';
  }[];
}

export function useAgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const calculations = useMemo((): AgeInsights | null => {
    if (!birthDate) return null;

    const start = startOfDay(new Date(birthDate));
    const end = startOfDay(new Date(targetDate));

    if (isAfter(start, end)) return null;

    // Standard Age
    let years = differenceInYears(end, start);
    let tempDate = addYears(start, years);
    let months = differenceInMonths(end, tempDate);
    tempDate = addMonths(tempDate, months);
    let days = differenceInDays(end, tempDate);

    // Total counts
    const totalMonths = differenceInMonths(end, start);
    const totalWeeks = differenceInWeeks(end, start);
    const totalDays = differenceInDays(end, start);

    // Next Birthday
    const today = new Date();
    let nextBday = setYear(start, today.getFullYear());
    if (isBefore(nextBday, today)) {
      nextBday = setYear(start, today.getFullYear() + 1);
    }
    const daysUntilBday = differenceInDays(nextBday, today);
    const monthsUntilBday = Math.floor(daysUntilBday / 30.44);

    // Zodiac Sign
    const getZodiac = (date: Date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Aquarius" };
      if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { name: "Pisces" };
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Aries" };
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Taurus" };
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "Gemini" };
      if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Cancer" };
      if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Leo" };
      if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Virgo" };
      if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Libra" };
      if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Scorpio" };
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Sagittarius" };
      return { name: "Capricorn" };
    };

    // Chinese Zodiac
    const getChineseZodiac = (year: number) => {
      const animals = [
        { name: "Rat" }, { name: "Ox" }, { name: "Tiger" }, { name: "Rabbit" }, 
        { name: "Dragon" }, { name: "Snake" }, { name: "Horse" }, { name: "Goat" }, 
        { name: "Monkey" }, { name: "Rooster" }, { name: "Dog" }, { name: "Pig" }
      ];
      return animals[(year - 4) % 12];
    };

    // Planetary Ages
    const planetaryAges = [
      { planet: "Mercury", factor: 0.241, color: "bg-slate-400" },
      { planet: "Venus", factor: 0.615, color: "bg-amber-300" },
      { planet: "Mars", factor: 1.881, color: "bg-red-400" },
      { planet: "Jupiter", factor: 11.86, color: "bg-orange-300" },
    ].map(p => ({
      planet: p.planet,
      age: Number((years / p.factor).toFixed(1)),
      color: p.color
    }));

    // Fun Milestones
    const milestones = [
      { label: "10,000 Days Old", days: 10000 },
      { label: "20,000 Days Old", days: 20000 },
      { label: "1 Billion Seconds", seconds: 1000000000 },
    ].map(m => {
      const date = m.days ? addDays(start, m.days) : addSeconds(start, m.seconds!);
      return {
        label: m.label,
        date,
        status: isBefore(date, new Date()) ? 'passed' as const : 'upcoming' as const
      };
    });

    // Eligibility (India context)
    const eligibility = {
      voting: years >= 18,
      driving: years >= 18,
      seniorCitizen: years >= 60,
      retirement: years < 60 ? 60 - years : null,
    };

    const lifeProgress = Math.min(Math.round((years / 80) * 100), 100);

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      nextBirthday: {
        date: nextBday,
        daysLeft: daysUntilBday,
        monthsLeft: monthsUntilBday,
        weekday: format(nextBday, 'EEEE'),
      },
      zodiac: getZodiac(start),
      eligibility,
      lifeProgress,
      chineseZodiac: getChineseZodiac(start.getFullYear()),
      planetaryAges,
      funMilestones: milestones,
    };
  }, [birthDate, targetDate]);

  return {
    birthDate,
    targetDate,
    setBirthDate,
    setTargetDate,
    calculations,
  };
}
