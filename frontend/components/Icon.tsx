import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number | string };

function Svg({ size = 20, children, ...props }: Props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

export const ArrowUpRight = (p: Props) => <Svg {...p}><path d="M7 17 17 7M7 7h10v10" /></Svg>;
export const ArrowRight = (p: Props) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const ArrowLeft = (p: Props) => <Svg {...p}><path d="M19 12H5m6 6-6-6 6-6" /></Svg>;
export const ArrowDown = (p: Props) => <Svg {...p}><path d="M12 5v14M6 13l6 6 6-6" /></Svg>;
export const ChevronDown = (p: Props) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>;
export const Menu = (p: Props) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>;
export const X = (p: Props) => <Svg {...p}><path d="m6 6 12 12M18 6 6 18" /></Svg>;
export const Phone = (p: Props) => <Svg {...p}><path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.3 1.73.5 2.63.62A2 2 0 0 1 22 16.9Z" /></Svg>;
export const Mail = (p: Props) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 7 9 6 9-6" /></Svg>;
export const Check = (p: Props) => <Svg {...p}><path d="m5 12 4 4L19 6" /></Svg>;
export const CheckCircle2 = (p: Props) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.7 2.7L16.5 9" /></Svg>;
export const CircleAlert = (p: Props) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></Svg>;
export const Map = (p: Props) => <Svg {...p}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></Svg>;
export const Compass = (p: Props) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></Svg>;
export const Mountain = (p: Props) => <Svg {...p}><path d="m3 19 6.5-11 4 6 2-3 5.5 8H3Z" /></Svg>;
export const Route = (p: Props) => <Svg {...p}><circle cx="5" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 6h3a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3h1" /></Svg>;
export const TentTree = (p: Props) => <Svg {...p}><path d="m3 20 8-14 8 14H3ZM11 6v14M7.5 20 11 14l3.5 6" /></Svg>;
export const Clock = (p: Props) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
export const MessageCircle = (p: Props) => <Svg {...p}><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.45L3 21l2.05-5.4A8.5 8.5 0 1 1 21 11.5Z" /></Svg>;
export const Globe = (p: Props) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" /></Svg>;
export const LoaderCircle = (p: Props) => <Svg {...p}><path d="M21 12a9 9 0 1 1-6.2-8.56" /></Svg>;

export const XLogo = (p: Props) => <Svg {...p}><path d="m5 4 14.5 16M19 4 4.5 20" /></Svg>;
export const Instagram = (p: Props) => <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" /></Svg>;
export const Facebook = (p: Props) => <Svg {...p}><path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" /></Svg>;
export const Youtube = (p: Props) => <Svg {...p}><rect x="2.5" y="6" width="19" height="12" rx="4" /><path d="M9.75 15.02 15.5 11.75 9.75 8.48Z" fill="currentColor" stroke="none" /></Svg>;
export const Tiktok = (p: Props) => <Svg {...p}><path d="M9 19a3.2 3.2 0 1 0 3.2-3.2" /><path d="M12.2 15.8V4h2.4" /><path d="M14.6 6.4c.4 2 2 3.6 4 4" /></Svg>;
