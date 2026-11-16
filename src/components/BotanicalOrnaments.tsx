import React from 'react';

export const BotanicalSprig: React.FC<{ className?: string }> = ({
  className = 'w-28 h-7',
}) => (
  <svg
    viewBox="0 0 140 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 16C42 16 60 16 128 16"
      stroke="#E8A2B5"
      strokeWidth="1"
      strokeLinecap="round"
      strokeOpacity="0.65"
    />
    <path
      d="M70 21C70 21 63 16.2 63 11.5C63 9.2 64.8 7.5 67 7.5C68.4 7.5 69.5 8.2 70 9.3C70.5 8.2 71.6 7.5 73 7.5C75.2 7.5 77 9.2 77 11.5C77 16.2 70 21 70 21Z"
      fill="#F4DDE3"
      stroke="#C97A92"
      strokeWidth="1.2"
    />
    <path
      d="M48 16C44 12 39 11 36 13C39 15 44 16 48 16Z"
      fill="#F3E9DD"
      stroke="#C97A92"
      strokeWidth="1"
    />
    <path
      d="M92 16C96 12 101 11 104 13C101 15 96 16 92 16Z"
      fill="#F3E9DD"
      stroke="#C97A92"
      strokeWidth="1"
    />
  </svg>
);

export const WaxSealHeart: React.FC<{ className?: string }> = ({
  className = 'w-9 h-9',
}) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle
      cx="20"
      cy="20"
      r="18"
      fill="#F4DDE3"
      stroke="#E8A2B5"
      strokeWidth="1.2"
    />
    <circle
      cx="20"
      cy="20"
      r="14.5"
      stroke="#C97A92"
      strokeWidth="0.8"
      strokeDasharray="2 2"
    />
    <path
      d="M20 27.5C20 27.5 12 22.3 12 16.4C12 13.8 14 11.8 16.5 11.8C18 11.8 19.3 12.6 20 13.8C20.7 12.6 22 11.8 23.5 11.8C26 11.8 28 13.8 28 16.4C28 22.3 20 27.5 20 27.5Z"
      fill="#E8A2B5"
      fillOpacity="0.45"
      stroke="#B86B82"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FloralCornerFlourish: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M14 4C14 9.5 18.5 14 24 14C18.5 14 14 18.5 14 24C14 18.5 9.5 14 4 14C9.5 14 14 9.5 14 4Z"
      fill="#F4DDE3"
      stroke="#C97A92"
      strokeWidth="1.1"
    />
  </svg>
);
