type Props = { size?: number };

export const InstagramBadge = ({ size = 40 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <defs>
      <radialGradient id="ig-badge-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285aeb" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="24" fill="url(#ig-badge-grad)" />
    <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2.2" />
    <circle cx="24" cy="24" r="5.4" fill="none" stroke="#fff" strokeWidth="2.2" />
    <circle cx="30.4" cy="17.6" r="1.4" fill="#fff" />
  </svg>
);

export const YoutubeBadge = ({ size = 40 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#ff0000" />
    <path d="M20 17.5 31 24 20 30.5Z" fill="#fff" />
  </svg>
);

export const FacebookBadge = ({ size = 40 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#1877f2" />
    <path d="M26.6 24.5h4l.6-4h-4.6v-2.6c0-1.16.32-1.95 1.98-1.95H31V12.3c-.31-.04-1.36-.13-2.6-.13-2.57 0-4.33 1.57-4.33 4.44v3.9H21v4h3.07V36h4.53V24.5Z" fill="#fff" />
  </svg>
);

export const TiktokBadge = ({ size = 40 }: Props) => {
  const note = "M27.5 14.5c.6 2.4 2.4 4.2 5 4.5v3.3c-1.8-.1-3.4-.7-4.8-1.7v7.7c0 4-3.2 7.2-7.2 7.2s-7.2-3.2-7.2-7.2 3.2-7.2 7.2-7.2c.4 0 .8 0 1.2.1v3.4c-.4-.1-.8-.2-1.2-.2-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.9-1.6 3.9-3.7V14.5h3.1Z";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#000" />
      <path d={note} fill="#25f4ee" transform="translate(-0.7,-0.7)" />
      <path d={note} fill="#fe2c55" transform="translate(0.7,0.7)" />
      <path d={note} fill="#fff" />
    </svg>
  );
};

export const XBadge = ({ size = 40 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#000" />
    <rect x="22.5" y="9" width="3" height="30" rx="1.5" fill="#fff" transform="rotate(45 24 24)" />
    <rect x="22.5" y="9" width="3" height="30" rx="1.5" fill="#fff" transform="rotate(-45 24 24)" />
  </svg>
);
