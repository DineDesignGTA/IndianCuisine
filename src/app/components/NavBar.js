'use client';
import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from 'react-scroll';
import GoogleMapOverlay from "./Maps";
import Link from 'next/link';
import hours from '../Data/hours.json';
const getDayName = (date) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

const isHoliday = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  return hours.closed.some(holiday => {
    const holidayDate = Object.values(holiday)[0];
    return holidayDate === dateString;
  });
};

const convertTo12Hour = (time) => {
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.padStart(2, '0')} ${ampm}`;
};

const getTodayHours = () => {
  const now = new Date();
  const day = getDayName(now);
  const hoursToday = hours.time.filter(h => Object.keys(h)[0] === day).map(h => h[day]);
  
  return hoursToday.map(timeRange => {
    const [openTime, closeTime] = timeRange.split('-');
    return `${convertTo12Hour(openTime)} - ${convertTo12Hour(closeTime)}`;
  }).join(', ');
};

const checkTime = () => {
  const now = new Date();
  if (isHoliday(now)) {
    return { status: "Closed", color: "red" };
  }

  const day = getDayName(now);
  const hoursToday = hours.time.filter(h => Object.keys(h)[0] === day).map(h => h[day]);

  for (let timeRange of hoursToday) {
    let [openTime, closeTime] = timeRange.split('-');
    let openDateTime = new Date(now);
    let closeDateTime = new Date(now);

    let [openHour, openMinute] = openTime.split(':');
    let [closeHour, closeMinute] = closeTime.split(':');

    openDateTime.setHours(openHour, openMinute, 0, 0);
    closeDateTime.setHours(closeHour, closeMinute, 0, 0);

    // Handle times past midnight
    if (parseInt(closeHour) < parseInt(openHour)) {
      closeDateTime.setDate(closeDateTime.getDate() + 1);
    }

    const oneHour = 60 * 60 * 1000;

    if (now >= openDateTime && now < closeDateTime) {
      if (closeDateTime - now < oneHour) {
        return { status: "Closing soon", color: "DarkGoldenRod" };
      }
      return { status: "Open", color: "green" };
    } else if (now < openDateTime && openDateTime - now < oneHour) {
      return { status: "Opening soon", color: "DarkGoldenRod" };
    }
  }

  return { status: "Closed", color: "red" };
};


const HoursDisplay = ({ todayHours, status }) => {
  const [showHours, setShowHours] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowHours(!showHours)}
        className="flex items-center space-x-1 text-sm"
      >
        <div style={{ color: status.color }}>{status.status}</div>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showHours ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showHours && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 text-xs z-20">
          Today's Hours: {todayHours}
        </div>
      )}
    </div>
  );
};

export default function StickyNavbar() {
  const [openNav, setOpenNav] = useState(false);
  const [status, setStatus] = useState({ status: "", color: "" });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [todayHours, setTodayHours] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    const updateStatus = () => {
      setStatus(checkTime());
      setTodayHours(getTodayHours());
    };

    updateStatus();
    const intervalId = setInterval(updateStatus, 60000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(intervalId);
    };
  }, [lastScrollY]);

  const navList = (
    <ul className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:gap-6 md:mt-0 px-5">
      {["Offers", "Menu", "Contact", "Reviews"].map((item) => (
        <li key={item} className="text-base font-medium text-blue-gray-700 hover:text-blue-900 hover:underline transition-all duration-300">
          <ScrollLink to={item.toLowerCase()} smooth={true} duration={500} className="flex items-center cursor-pointer">
            {item}
          </ScrollLink>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className={`sticky top-0 z-10 w-full bg-white shadow-lg transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link className="text-xl font-semibold hover:text-gray-600" href="/">Dine Design</Link>
            <HoursDisplay todayHours={todayHours} status={status} />
            <div className="block">
              <GoogleMapOverlay />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {navList}
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-800 to-green-500 rounded-lg shadow-lg hover:from-emerald-600 hover:to-green-400">
              <span className="button" data-glf-cuid="94badddd-5f1d-46f5-900e-fe497c12f5ff" data-glf-ruid="c07978a7-6d4a-48d4-8b9b-a15ff281c075">See MENU & Order</span>
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-300">
              <span className="button" data-glf-cuid="94badddd-5f1d-46f5-900e-fe497c12f5ff" data-glf-ruid="c07978a7-6d4a-48d4-8b9b-a15ff281c075" data-glf-reservation="true">Table Reservation</span>
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {openNav && (
          <div className="md:hidden mt-4 pb-4">
            {navList}
            <div className="mt-4 space-y-2">
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-800 to-green-500 rounded-lg shadow-lg hover:from-emerald-600 hover:to-green-400">
                <span className="button" data-glf-cuid="94badddd-5f1d-46f5-900e-fe497c12f5ff" data-glf-ruid="c07978a7-6d4a-48d4-8b9b-a15ff281c075">See MENU & Order</span>
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-300">
                <span className="button" data-glf-cuid="94badddd-5f1d-46f5-900e-fe497c12f5ff" data-glf-ruid="c07978a7-6d4a-48d4-8b9b-a15ff281c075" data-glf-reservation="true">Table Reservation</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <script src="https://www.fbgcdn.com/embedder/js/ewm2.js" defer async></script>
    </nav>
  );
}