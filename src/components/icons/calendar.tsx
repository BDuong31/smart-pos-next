import { useTheme } from "next-themes";

export default function CalendarRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <rect width={416} height={384} x={48} y={80} fill="none" strokeLinejoin="round" strokeWidth={32} rx={48}></rect>
            <circle cx={296} cy={232} r={24}></circle>
            <circle cx={376} cy={232} r={24}></circle>
            <circle cx={296} cy={312} r={24}></circle>
            <circle cx={376} cy={312} r={24}></circle>
            <circle cx={136} cy={312} r={24}></circle>
            <circle cx={216} cy={312} r={24}></circle>
            <circle cx={136} cy={392} r={24}></circle>
            <circle cx={216} cy={392} r={24}></circle>
            <circle cx={296} cy={392} r={24}></circle>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M128 48v32m256-32v32"></path>
            <path fill="none" strokeLinejoin="round" strokeWidth={32} d="M464 160H48"></path>
        </svg>
    )
}

export function CalendarBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M480 128a64 64 0 0 0-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 112 48v16H96a64 64 0 0 0-64 64v12a4 4 0 0 0 4 4h440a4 4 0 0 0 4-4ZM32 416a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V179a3 3 0 0 0-3-3H35a3 3 0 0 0-3 3Zm344-208a24 24 0 1 1-24 24a24 24 0 0 1 24-24m0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24m-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24m0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24m0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24m-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24m0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24m-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24m0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24"
            />
        </svg>
    );
}