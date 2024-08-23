const HoursDisplay = ({ todayHours, status }) => {
    const [showHours, setShowHours] = useState(false);
  
    return (
      <>
        {/* Desktop version */}
        <div className="hidden sm:flex items-center space-x-2">
          <div style={{ color: status.color }}>{status.status}</div>
          <span className="text-xs">Today's Hours: {todayHours}</span>
        </div>
  
        {/* Mobile version */}
        <div className="sm:hidden">
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
            <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-b-lg p-2 text-xs">
              Today's Hours: {todayHours}
            </div>
          )}
        </div>
      </>
    );
  };