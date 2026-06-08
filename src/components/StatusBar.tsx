import './StatusBar.css';

export function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-bar__time">9:41</span>
      <div className="status-bar__icons" aria-hidden="true">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="6" width="3" height="5" rx="1" fill="#010101" />
          <rect x="4.5" y="4" width="3" height="7" rx="1" fill="#010101" />
          <rect x="9" y="2" width="3" height="9" rx="1" fill="#010101" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" fill="#010101" opacity="0.3" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <circle cx="8" cy="10.5" r="1.5" fill="#010101" />
          <path d="M5.17 7.83C5.98 7.02 6.96 6.5 8 6.5C9.04 6.5 10.02 7.02 10.83 7.83" stroke="#010101" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3.05 5.71C4.41 4.35 6.14 3.5 8 3.5C9.86 3.5 11.59 4.35 12.95 5.71" stroke="#010101" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0.91 3.59C2.86 1.64 5.3 0.5 8 0.5C10.7 0.5 13.14 1.64 15.09 3.59" stroke="#010101" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="#010101" strokeOpacity="0.35" />
          <rect x="2" y="2" width="15" height="8" rx="1.5" fill="#010101" />
          <rect x="21.5" y="3.5" width="2.5" height="5" rx="1" fill="#010101" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
