"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, Timer, User, Globe, TrendingUp } from "lucide-react";

interface TimeData {
  hour: number;
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
}

const BIRTH_DATE = new Date("1997-05-05"); // May 5, 1997
const LIFE_EXPECTANCY = 120;

const TimeTracker: React.FC = () => {
  const [timeData, setTimeData] = useState<TimeData | null>(null);

  const calculateTimeData = (): TimeData => {
    // Set timezone to Dhaka, Bangladesh (UTC+6)
    const now = new Date();
    const dhakaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );

    // Hour and day percentage
    const hour = dhakaTime.getHours();
    const minutes = dhakaTime.getMinutes();
    const seconds = dhakaTime.getSeconds();
    const milliseconds = dhakaTime.getMilliseconds();

    // Convert to 12-hour format
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";

    const totalSecondsInDay = 24 * 60 * 60;
    const currentSecondsInDay =
      hour * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    const dayPercentage = (currentSecondsInDay / totalSecondsInDay) * 100;

    // Day of week and week percentage (Monday = 0, Sunday = 6)
    const dayOfWeekJS = dhakaTime.getDay(); // 0 = Sunday, 6 = Saturday
    const dayOfWeek = dayOfWeekJS === 0 ? 6 : dayOfWeekJS - 1; // Convert to Monday = 0
    const totalSecondsInWeek = 7 * 24 * 60 * 60;
    const currentSecondsInWeek = dayOfWeek * 24 * 3600 + currentSecondsInDay;
    const weekPercentage = (currentSecondsInWeek / totalSecondsInWeek) * 100;

    // Quarter and quarter percentage
    const month = dhakaTime.getMonth(); // 0-11
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

    // Year percentage
    const yearStart = new Date(dhakaTime.getFullYear(), 0, 1);
    const yearEnd = new Date(dhakaTime.getFullYear() + 1, 0, 1);
    const yearTotalMs = yearEnd.getTime() - yearStart.getTime();
    const yearCurrentMs = dhakaTime.getTime() - yearStart.getTime();
    const yearPercentage = (yearCurrentMs / yearTotalMs) * 100;

    // Century percentage (assuming 21st century: 2001-2100)
    const centuryStart = new Date(2001, 0, 1);
    const centuryEnd = new Date(2101, 0, 1);
    const centuryTotalMs = centuryEnd.getTime() - centuryStart.getTime();
    const centuryCurrentMs = dhakaTime.getTime() - centuryStart.getTime();
    const centuryPercentage = Math.max(
      0,
      (centuryCurrentMs / centuryTotalMs) * 100
    );

    // Age calculation
    const birthTime = BIRTH_DATE.getTime();
    const currentTime = dhakaTime.getTime();
    const ageInMs = currentTime - birthTime;
    const ageInYears = ageInMs / (365.25 * 24 * 60 * 60 * 1000); // Account for leap years
    const age = Math.round(ageInYears * 100) / 100; // Round to 2 decimal places

    // Life percentage
    const lifePercentage = (age / LIFE_EXPECTANCY) * 100;

    return {
      hour: hour12,
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
    };
  };

  useEffect(() => {
    const updateTime = () => {
      setTimeData(calculateTimeData());
    };

    updateTime(); // Initial calculation
    const interval = setInterval(updateTime, 100); // Update every 100ms for smooth animations

    return () => clearInterval(interval);
  }, []);

  const ProgressBar: React.FC<{ percentage: number; className: string }> = ({
    percentage,
    className,
  }) => (
    <div className="relative w-full bg-gray-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${className} relative overflow-hidden`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    </div>
  );

  const TimeCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    percentage: number;
    gradientFrom: string;
    gradientTo: string;
    subtitle?: string;
  }> = ({
    icon,
    title,
    value,
    percentage,
    gradientFrom,
    gradientTo,
    subtitle,
  }) => (
    <div className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Animated background glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div
            className={`p-2 sm:p-2.5 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg`}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end gap-2">
            <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white truncate">
              {value}
            </span>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-300 flex-shrink-0">
              {percentage.toFixed(2)}%
            </span>
          </div>
          <ProgressBar
            percentage={percentage}
            className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} shadow-lg`}
          />
        </div>
      </div>
    </div>
  );

  const StatCard: React.FC<{ label: string; value: string }> = ({
    label,
    value,
  }) => (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 text-center group hover:scale-105">
      <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2 font-medium">
        {label}
      </p>
      <p className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
        {value}
      </p>
    </div>
  );

  if (!timeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-500 rounded-full animate-spin animate-reverse" />
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10 flex sm:flex-col lg:flex-row gap-5 justify-center items-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Time Tracker
              </h1>
            </div>
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-gray-700/50 inline-block">
              <p className="text-base sm:text-lg lg:text-xl text-gray-200 font-medium">
                {timeData.currentTime}
              </p>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                {timeData.currentDate}
              </p>
            </div>
          </div>

          {/* Time Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
            <TimeCard
              icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              title="Hour of Day"
              value={timeData.currentTime.split(" ")[0]}
              percentage={timeData.dayPercentage}
              gradientFrom="from-blue-500"
              gradientTo="to-cyan-500"
              subtitle="Current hour"
            />

            <TimeCard
              icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              title="Day of Week"
              value={dayNames[timeData.dayOfWeek]}
              percentage={timeData.weekPercentage}
              gradientFrom="from-green-500"
              gradientTo="to-emerald-500"
              subtitle="Week progress"
            />

            <TimeCard
              icon={<Timer className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              title="Quarter"
              value={quarterNames[timeData.quarter - 1]}
              percentage={timeData.quarterPercentage}
              gradientFrom="from-purple-500"
              gradientTo="to-violet-500"
              subtitle={`${new Date().toLocaleDateString("en-US", {
                timeZone: "Asia/Dhaka",
                year: "numeric",
              })}`}
            />

            <TimeCard
              icon={<Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              title="Year"
              value={new Date().toLocaleDateString("en-US", {
                timeZone: "Asia/Dhaka",
                year: "numeric",
              })}
              percentage={timeData.yearPercentage}
              gradientFrom="from-orange-500"
              gradientTo="to-red-500"
              subtitle="Year progress"
            />

            <TimeCard
              icon={<Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              title="Century"
              value="21st Century"
              percentage={timeData.centuryPercentage}
              gradientFrom="from-red-500"
              gradientTo="to-pink-500"
              subtitle="2001-2100"
            />

            <TimeCard
              icon={<User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              title="Life Progress"
              value={`${timeData.age.toFixed(2)} years`}
              percentage={timeData.lifePercentage}
              gradientFrom="from-indigo-500"
              gradientTo="to-purple-500"
              subtitle={`Target: ${LIFE_EXPECTANCY} years`}
            />
          </div>

          {/* Summary Stats */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 shadow-2xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Time Remaining
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <StatCard
                label="Hours remaining today"
                value={(24 - (timeData.dayPercentage / 100) * 24).toFixed(2)}
              />
              <StatCard
                label="Days remaining in week"
                value={(7 - (timeData.weekPercentage / 100) * 7).toFixed(2)}
              />
              <StatCard
                label="Weeks remaining in quarter"
                value={(13 - (timeData.quarterPercentage / 100) * 13).toFixed(
                  2
                )}
              />
              <StatCard
                label="Quarters remaining this year"
                value={(4 - (timeData.yearPercentage / 100) * 4).toFixed(2)}
              />
              <StatCard
                label="Years remaining in century"
                value={(100 - (timeData.centuryPercentage / 100) * 100).toFixed(
                  2
                )}
              />
              <StatCard
                label="Years remaining in life"
                value={(LIFE_EXPECTANCY - timeData.age).toFixed(2)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 mt-6 sm:mt-8 lg:mt-10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500" />
            <div className="relative z-10 text-center">
              <p className="text-sm sm:text-base lg:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 animate-pulse">
                Time is the most valuable resource. Use it wisely.
              </p>
              <div className="mt-2 sm:mt-3 w-24 sm:w-32 lg:w-40 h-0.5 mx-auto bg-gradient-to-r from-transparent via-gray-500/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
