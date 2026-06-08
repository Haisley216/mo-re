import './StatusBar.css';

export function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-bar__time">9:41</span>
      <div className="status-bar__icons" aria-hidden="true">
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
          <rect x="0" y="8" width="4" height="6" rx="1" fill="#010101" />
          <rect x="6" y="5" width="4" height="9" rx="1" fill="#010101" />
          <rect x="12" y="2" width="4" height="12" rx="1" fill="#010101" />
          <rect x="18" y="0" width="4" height="14" rx="1" fill="#010101" opacity="0.3" />
        </svg>
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path
            d="M9 11.5C10.38 11.5 11.5 10.38 11.5 9H6.5C6.5 10.38 7.62 11.5 9 11.5ZM4.5 7.5L3 6L1.5 7.5C3.5 5.5 6.5 4.5 9 4.5C11.5 4.5 14.5 5.5 16.5 7.5L15 6L13.5 7.5C12 6 10.5 5.5 9 5.5C7.5 5.5 6 6 4.5 7.5ZM1.5 4.5L0 3L1.5 1.5C4.5 -1.5 9 -1.5 12 1.5L13.5 3L12 4.5C9.5 2 6.5 2 4.5 4.5H1.5Z"
            fill="#010101"
          />
        </svg>
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
          <rect x="0.5" y="0.5" width="22" height="13" rx="3.5" stroke="#010101" strokeOpacity="0.35" />
          <rect x="2" y="2" width="17" height="10" rx="2" fill="#010101" />
          <rect x="24" y="4.5" width="2.5" height="5" rx="1" fill="#010101" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
