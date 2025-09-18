"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Calendar,
  Timer,
  User,
  Globe,
  Target,
  Activity,
} from "lucide-react";

interface TimeData {
  hour: number;
  minute: number;
  seconds: number;
  dayPercentage: number;
  dayOfWeek: number;
  weekPercentage: number;
  quarter: number;
  quarterPercentage: number;
  yearPercentage: number;
  centuryPercentage: number;
  age: number;
  lifePercentage: number;
  currentTime: string;
  currentDate: string;
  session45MinPercentage: number;
  currentSession: number;
  phase90MinPercentage: number;
  currentPhase: number;
  timeBlock3HrPercentage: number;
  currentTimeBlock: number;
}

const BIRTH_DATE = new Date("1997-05-05");
const LIFE_EXPECTANCY = 120;

const TimeTracker: React.FC = () => {
  const [timeData, setTimeData] = useState<TimeData | null>(null);

  const calculateTimeData = (): TimeData => {
    const now = new Date();
    const dhakaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );

    const hour = dhakaTime.getHours();
    const minute = dhakaTime.getMinutes();
    const seconds = dhakaTime.getSeconds();
    const milliseconds = dhakaTime.getMilliseconds();

    // Calculate total minutes and seconds from start of day
    const totalMinutesInDay = hour * 60 + minute;
    const totalSecondsInDay = totalMinutesInDay * 60 + seconds;

    // 3-hour time block calculations (8 blocks per day)
    const minutesIn3Hr = 180;
    const currentTimeBlock = Math.floor(totalMinutesInDay / minutesIn3Hr) + 1;
    const minutesIntoTimeBlock = totalMinutesInDay % minutesIn3Hr;
    const secondsIntoTimeBlock = minutesIntoTimeBlock * 60 + seconds;
    const timeBlock3HrPercentage =
      (secondsIntoTimeBlock / (minutesIn3Hr * 60)) * 100;

    // 90-minute phase calculations (2 phases per 3-hour block)
    const minutesIn90Min = 90;
    const currentPhase = Math.floor(minutesIntoTimeBlock / minutesIn90Min) + 1;
    const minutesIntoPhase = minutesIntoTimeBlock % minutesIn90Min;
    const secondsIntoPhase = minutesIntoPhase * 60 + seconds;
    const phase90MinPercentage =
      (secondsIntoPhase / (minutesIn90Min * 60)) * 100;

    // 45-minute session calculations (2 sessions per 90-minute phase)
    const minutesIn45Min = 45;
    const currentSession = Math.floor(minutesIntoPhase / minutesIn45Min) + 1;
    const minutesIntoSession = minutesIntoPhase % minutesIn45Min;
    const secondsIntoSession = minutesIntoSession * 60 + seconds;
    const session45MinPercentage =
      (secondsIntoSession / (minutesIn45Min * 60)) * 100;

    // Continuous day percentage calculation
    const totalMillisecondsInDay = 24 * 60 * 60 * 1000;
    const currentMillisecondsInDay =
      hour * 60 * 60 * 1000 +
      minute * 60 * 1000 +
      seconds * 1000 +
      milliseconds;
    const dayPercentage =
      (currentMillisecondsInDay / totalMillisecondsInDay) * 100;

    // Continuous week percentage calculation
    const dayOfWeekJS = dhakaTime.getDay();
    const dayOfWeek = dayOfWeekJS === 0 ? 6 : dayOfWeekJS - 1;
    const totalMillisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
    const currentMillisecondsInWeek =
      dayOfWeek * 24 * 60 * 60 * 1000 + currentMillisecondsInDay;
    const weekPercentage =
      (currentMillisecondsInWeek / totalMillisecondsInWeek) * 100;

    // Continuous quarter percentage calculation
    const month = dhakaTime.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    const quarterStartMonth = (quarter - 1) * 3;
    const quarterStartDate = new Date(
      dhakaTime.getFullYear(),
      quarterStartMonth,
      1
    );
    const quarterEndDate = new Date(
      dhakaTime.getFullYear(),
      quarterStartMonth + 3,
      0,
      23,
      59,
      59,
      999
    );
    const quarterTotalMs =
      quarterEndDate.getTime() - quarterStartDate.getTime();
    const quarterCurrentMs = dhakaTime.getTime() - quarterStartDate.getTime();
    const quarterPercentage = (quarterCurrentMs / quarterTotalMs) * 100;

    // Continuous year percentage calculation
    const yearStart = new Date(dhakaTime.getFullYear(), 0, 1);
    const yearEnd = new Date(dhakaTime.getFullYear() + 1, 0, 1);
    const yearTotalMs = yearEnd.getTime() - yearStart.getTime();
    const yearCurrentMs = dhakaTime.getTime() - yearStart.getTime();
    const yearPercentage = (yearCurrentMs / yearTotalMs) * 100;

    // Continuous century percentage calculation
    const centuryStart = new Date(2001, 0, 1);
    const centuryEnd = new Date(2101, 0, 1);
    const centuryTotalMs = centuryEnd.getTime() - centuryStart.getTime();
    const centuryCurrentMs = dhakaTime.getTime() - centuryStart.getTime();
    const centuryPercentage = Math.max(
      0,
      (centuryCurrentMs / centuryTotalMs) * 100
    );

    // Continuous age and life percentage calculation
    const birthTime = BIRTH_DATE.getTime();
    const currentTime = dhakaTime.getTime();
    const ageInMs = currentTime - birthTime;
    const ageInYears = ageInMs / (365.25 * 24 * 60 * 60 * 1000);
    const age = ageInYears;
    const lifePercentage = (age / LIFE_EXPECTANCY) * 100;

    return {
      hour,
      minute,
      seconds,
      dayPercentage,
      dayOfWeek,
      weekPercentage,
      quarter,
      quarterPercentage,
      yearPercentage,
      centuryPercentage,
      age,
      lifePercentage,
      currentTime: dhakaTime.toLocaleTimeString("en-US", {
        timeZone: "Asia/Dhaka",
        hour12: true,
      }),
      currentDate: dhakaTime.toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      session45MinPercentage,
      currentSession,
      phase90MinPercentage,
      currentPhase,
      timeBlock3HrPercentage,
      currentTimeBlock,
    };
  };

  useEffect(() => {
    const updateTime = () => {
      setTimeData(calculateTimeData());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const staticContent = useMemo(() => {
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const quarterNames = ["Q1", "Q2", "Q3", "Q4"];
    const sessionNames = ["1st Session", "2nd Session"];
    const phaseNames = ["1st Phase", "2nd Phase"];
    return { dayNames, quarterNames, sessionNames, phaseNames };
  }, []);

  const ProgressBar: React.FC<{ percentage: number; color: string }> =
    React.memo(({ percentage, color }) => (
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    ));
  ProgressBar.displayName = "ProgressBar";

  const TimeCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    percentage: number;
    color: string;
    subtitle?: string;
  }> = React.memo(({ icon, title, value, percentage, color, subtitle }) => (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-bold text-white">{value}</span>
          <div className="text-right">
            <span className="text-lg font-medium text-gray-300">
              {percentage.toFixed(2)}%
            </span>
            <p className="text-sm text-gray-400">
              {(100 - percentage).toFixed(2)}% remaining
            </p>
          </div>
        </div>
        <ProgressBar percentage={percentage} color={color} />
      </div>
    </div>
  ));
  TimeCard.displayName = "TimeCard";

  const StatCard: React.FC<{ label: string; value: string }> = React.memo(
    ({ label, value }) => (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
        <p className="text-sm text-gray-400 mb-2">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    )
  );
  StatCard.displayName = "StatCard";

  if (!timeData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
        * {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 inline-block">
            <p className="text-xl text-gray-200 font-medium">
              {timeData.currentTime}
            </p>
            <p className="text-gray-400 mt-1">{timeData.currentDate}</p>
          </div>
        </div>

        {/* New Time Tracking Row - 45-min, 90-min, and 3-hour segments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <TimeCard
            icon={<Target className="w-6 h-6 text-white" />}
            title="45-min Session"
            value={`${(
              45 -
              (timeData.session45MinPercentage / 100) * 45
            ).toFixed(2)} Mins`}
            percentage={timeData.session45MinPercentage}
            color="bg-teal-600"
            subtitle={staticContent.sessionNames[timeData.currentSession - 1]}
          />
          <TimeCard
            icon={<Activity className="w-6 h-6 text-white" />}
            title="90-min Phase"
            value={`${(90 - (timeData.phase90MinPercentage / 100) * 90).toFixed(
              2
            )} Mins`}
            percentage={timeData.phase90MinPercentage}
            color="bg-emerald-600"
            subtitle={staticContent.phaseNames[timeData.currentPhase - 1]}
          />
          <TimeCard
            icon={<Timer className="w-6 h-6 text-white" />}
            title="Time Block of Day"
            value={`${(3 - (timeData.timeBlock3HrPercentage / 100) * 3).toFixed(
              2
            )} Hrs`}
            percentage={timeData.timeBlock3HrPercentage}
            color="bg-amber-600"
            subtitle={`Block ${timeData.currentTimeBlock} of 8`}
          />
        </div>

        {/* Time Cards Grid - Original cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <TimeCard
            icon={<Clock className="w-6 h-6 text-white" />}
            title="Hour of Day"
            value={`${timeData.hour
              .toString()
              .padStart(2, "0")}:${timeData.minute
              .toString()
              .padStart(2, "0")}`}
            percentage={timeData.dayPercentage}
            color="bg-blue-600"
            subtitle="24-hour format"
          />
          <TimeCard
            icon={<Calendar className="w-6 h-6 text-white" />}
            title="Day of Week"
            value={staticContent.dayNames[timeData.dayOfWeek]}
            percentage={timeData.weekPercentage}
            color="bg-green-600"
            subtitle="Week progress"
          />
          <TimeCard
            icon={<Timer className="w-6 h-6 text-white" />}
            title="Quarter"
            value={staticContent.quarterNames[timeData.quarter - 1]}
            percentage={timeData.quarterPercentage}
            color="bg-purple-600"
            subtitle={new Date().getFullYear().toString()}
          />
          <TimeCard
            icon={<Globe className="w-6 h-6 text-white" />}
            title="Year"
            value={new Date().getFullYear().toString()}
            percentage={timeData.yearPercentage}
            color="bg-orange-600"
            subtitle="Year progress"
          />
          <TimeCard
            icon={<Globe className="w-6 h-6 text-white" />}
            title="Century"
            value="21st Century"
            percentage={timeData.centuryPercentage}
            color="bg-red-600"
            subtitle="2001-2100"
          />
          <TimeCard
            icon={<User className="w-6 h-6 text-white" />}
            title="Life Progress"
            value={`${timeData.age.toFixed(2)} years`}
            percentage={timeData.lifePercentage}
            color="bg-indigo-600"
            subtitle={`Target: ${LIFE_EXPECTANCY} years`}
          />
        </div>

        {/* Summary Stats */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Time Remaining
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              label="Hours today"
              value={(24 - (timeData.dayPercentage / 100) * 24).toFixed(2)}
            />
            <StatCard
              label="Days in week"
              value={(7 - (timeData.weekPercentage / 100) * 7).toFixed(2)}
            />
            <StatCard
              label="Weeks in quarter"
              value={(13 - (timeData.quarterPercentage / 100) * 13).toFixed(2)}
            />
            <StatCard
              label="Quarters this year"
              value={(4 - (timeData.yearPercentage / 100) * 4).toFixed(2)}
            />
            <StatCard
              label="Years in century"
              value={(100 - (timeData.centuryPercentage / 100) * 100).toFixed(
                2
              )}
            />
            <StatCard
              label="Years in life"
              value={(LIFE_EXPECTANCY - timeData.age).toFixed(2)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 text-center">
          <p className="text-lg font-medium text-gray-300 mb-2">
            Time is the most valuable resource. Use it wisely.
          </p>
          <div className="w-32 h-0.5 mx-auto bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
