import { useTheme } from "next-themes";

export default function BarChartRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <rect width={80} height={192} x={96} y={224} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} rx={20} ry={20}></rect>
            <rect width={80} height={240} x={240} y={176} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} rx={20} ry={20}></rect>
            <rect width={80} height={304} x={383.64} y={112} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} rx={20} ry={20}></rect>
        </svg>
    )
}

export function BarChartBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M156 432h-40a36 36 0 0 1-36-36V244a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v152a36 36 0 0 1-36 36m144 0h-40a36 36 0 0 1-36-36V196a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v200a36 36 0 0 1-36 36m143.64 0h-40a36 36 0 0 1-36-36V132a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v264a36 36 0 0 1-36 36"
            />
        </svg>
    );
}