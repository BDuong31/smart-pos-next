import { useTheme } from "next-themes";

export default function LockCloseRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M336 208v-95a80 80 0 0 0-160 0v95"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                fill="none"
            />
	        <rect 
                width={320} 
                height={272} 
                x={96} 
                y={208} 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={32} 
                rx={48} 
                ry={48} 
            />
        </svg>
    )
}

export function LockCloseBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M368 192h-16v-80a96 96 0 1 0-192 0v80h-16a64.07 64.07 0 0 0-64 64v176a64.07 64.07 0 0 0 64 64h224a64.07 64.07 0 0 0 64-64V256a64.07 64.07 0 0 0-64-64m-48 0H192v-80a64 64 0 1 1 128 0Z"
            />
        </svg>
    );
}