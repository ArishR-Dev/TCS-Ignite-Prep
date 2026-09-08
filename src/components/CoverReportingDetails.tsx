import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ExternalLink, Calendar, Building2, User, Sparkles, CheckCircle2 } from 'lucide-react';

const TARGET_DATE_STR = '2026-09-09T09:00:00+05:30';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=TCS%20Yeshwanthpur%2C%20Yeshwanthpur%2C%20Bengaluru%2C%20Karnataka';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isNow: boolean;
  isPast: boolean;
}

function calculateTimeLeft(targetMs: number): TimeLeft {
  const now = Date.now();
  const diff = targetMs - now;

  if (diff <= -60000) {
    // Passed by more than a minute
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isNow: false, isPast: true };
  } else if (diff <= 60000 && diff >= -60000) {
    // Within 1 minute of 09:00 AM IST
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isNow: true, isPast: false };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isNow: false, isPast: false };
}

export const CoverReportingDetails: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const [targetMs] = useState(() => new Date(TARGET_DATE_STR).getTime());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(new Date(TARGET_DATE_STR).getTime()));

  useEffect(() => {
    // Initial sync
    setTimeLeft(calculateTimeLeft(targetMs));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetMs));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetMs]);

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="w-full mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-800/90 space-y-4 sm:space-y-6">
      {/* Top Banner: Candidate & Date Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-stretch">
        {/* Candidate Profile Card */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/70 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Candidate Name
            </span>
            <p className="text-base sm:text-xl font-extrabold text-white tracking-wide font-['Plus_Jakarta_Sans']">
              SUBASHINI
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
              Role: TCS B.Sc Ignite Trainee
            </p>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold">
            CONFIRMED
          </div>
        </div>

        {/* Date & Reporting Point Card */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/70 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Interview Date
            </span>
            <p className="text-sm sm:text-base font-bold text-white tracking-tight">
              09th September 2026, Wednesday
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-mono flex items-center gap-1">
              <Building2 className="w-3 h-3 text-cyan-400" />
              Reporting: <span className="text-cyan-300 font-bold">Tower B, 09:00 AM</span>
            </p>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ON-CAMPUS
          </div>
        </div>
      </div>

      {/* Middle & Bottom: Live Countdown + Interactive Venue Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Live Countdown Timer (5 cols on lg) */}
        <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-b from-[#091122] to-[#060a14] border border-cyan-500/40 shadow-xl shadow-cyan-950/30 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                {timeLeft.isNow
                  ? 'REPORTING STATUS'
                  : timeLeft.isPast
                  ? 'REPORTING STATUS'
                  : 'REPORTING COUNTDOWN'}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                09:00 AM IST
              </span>
            </div>

            {/* Countdown Displays */}
            {timeLeft.isNow ? (
              <div className="py-3 sm:py-4 px-3 rounded-lg bg-emerald-950/60 border border-emerald-500/60 text-center animate-pulse">
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-mono tracking-wide">
                  REPORTING TIME: NOW
                </p>
                <p className="text-[11px] sm:text-xs text-emerald-200 mt-1">
                  Report directly at Tower B Registration Desk
                </p>
              </div>
            ) : timeLeft.isPast ? (
              <div className="py-3 sm:py-4 px-3 rounded-lg bg-slate-900/80 border border-slate-700/80 text-center">
                <p className="text-lg sm:text-xl font-bold text-slate-300 font-mono tracking-wide">
                  REPORTING TIME HAS ARRIVED
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                  Interview scheduled for 09 Sep 2026, 09:00 AM
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                  {/* Days */}
                  <div className="bg-slate-950/90 border border-cyan-800/40 rounded-lg p-1.5 sm:p-2">
                    <span className="text-lg sm:text-2xl font-extrabold font-mono text-cyan-300 block">
                      {padZero(timeLeft.days)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 block mt-0.5">
                      Days
                    </span>
                  </div>
                  {/* Hours */}
                  <div className="bg-slate-950/90 border border-cyan-800/40 rounded-lg p-1.5 sm:p-2">
                    <span className="text-lg sm:text-2xl font-extrabold font-mono text-cyan-300 block">
                      {padZero(timeLeft.hours)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 block mt-0.5">
                      Hours
                    </span>
                  </div>
                  {/* Minutes */}
                  <div className="bg-slate-950/90 border border-cyan-800/40 rounded-lg p-1.5 sm:p-2">
                    <span className="text-lg sm:text-2xl font-extrabold font-mono text-cyan-300 block">
                      {padZero(timeLeft.minutes)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 block mt-0.5">
                      Mins
                    </span>
                  </div>
                  {/* Seconds */}
                  <div className="bg-slate-950/90 border border-cyan-500/50 rounded-lg p-1.5 sm:p-2 bg-cyan-950/30">
                    <span className="text-lg sm:text-2xl font-extrabold font-mono text-cyan-200 block animate-pulse">
                      {padZero(timeLeft.seconds)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mt-0.5">
                      Secs
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-center text-slate-400 font-mono pt-1">
                  Target: <span className="text-cyan-300 font-semibold">09 Sep 2026, 09:00 AM IST</span> (Tower B)
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono">
            <span>Arrive 15 mins early (08:45 AM)</span>
            <span className="text-cyan-400 font-semibold">Live Synced ✦</span>
          </div>
        </div>

        {/* Venue Address & Clickable Maps Card (7 cols on lg) */}
        <div className="lg:col-span-7 p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-slate-700/80 shadow-xl flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Venue & Reporting Address
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
                Tower B Focus
              </span>
            </div>

            {/* Clickable Full Address */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block group p-2.5 sm:p-3 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-left cursor-pointer"
              title="Click to open location in Google Maps"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
                  <p className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                    <span>TCS Yeshwanthpur — Tower B</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </p>
                  <p className="text-slate-300">2GGW+45J, Yeshwanthpur Towers TCS</p>
                  <p className="text-slate-400">Yeshwanthpur Industrial Suburb</p>
                  <p className="text-slate-400">Yeshwanthpur, Bengaluru, Karnataka 560022</p>
                </div>
              </div>
            </a>
          </div>

          {/* Action Button: Open in Google Maps */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Near Yeshwanthpur Metro / Railway Station
            </span>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 transition-all active:scale-98 min-h-[44px] cursor-pointer"
              title="Open TCS Yeshwanthpur in Google Maps"
            >
              <MapPin className="w-4 h-4 text-cyan-200" />
              <span>📍 Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
