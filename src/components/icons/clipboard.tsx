import { useTheme } from "next-themes";

export default function ClipboardRegular(Props: React.SVGProps<SVGSVGElement>) {
    const { theme } = useTheme();
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            {...Props}
            viewBox="0 0 512 512"
        >
            <path fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={32} d="M336 64h32a48 48 0 0 1 48 48v320a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V112a48 48 0 0 1 48-48h32"></path>
	        <rect width={160} height={64} x={176} y={32} fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={32} rx={26.13} ry={26.13}></rect>
        </svg>
    )
}

export function ClipboardBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M368 48h-11.41a8 8 0 0 1-7.44-5.08A42.18 42.18 0 0 0 309.87 16H202.13a42.18 42.18 0 0 0-39.28 26.92a8 8 0 0 1-7.44 5.08H144a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h224a64 64 0 0 0 64-64V112a64 64 0 0 0-64-64m-48.13 64H192.13a16 16 0 0 1 0-32h127.74a16 16 0 0 1 0 32"
            />
        </svg>
    );
}