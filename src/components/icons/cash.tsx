import { useTheme } from "next-themes";

type CashIconProps = {
    width?: number | string;
    height?: number | string;
}

export default function CashRegular({ width, height }: CashIconProps) {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width={width} height={height} viewBox="0 0 512 512"        
        >
            <rect width={448} height={256} x={32} y={80} fill="none" strokeLinejoin="round" strokeWidth={32} rx={16} ry={16} transform="rotate(180 256 208)"></rect>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M64 384h384M96 432h320"></path>
            <circle cx={256} cy={208} r={80} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32}></circle>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M480 160a80 80 0 0 1-80-80M32 160a80 80 0 0 0 80-80m368 176a80 80 0 0 0-80 80M32 256a80 80 0 0 1 80 80"></path>
        </svg>
    )
}

export function CashBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path d="M448 400H64a16 16 0 0 1 0-32h384a16 16 0 0 1 0 32m-32 48H96a16 16 0 0 1 0-32h320a16 16 0 0 1 0 32M32 272H16v48a32 32 0 0 0 32 32h48v-16a64.07 64.07 0 0 0-64-64"></path>
            <path d="M480 240h16v-64h-16a96.11 96.11 0 0 1-96-96V64H128v16a96.11 96.11 0 0 1-96 96H16v64h16a96.11 96.11 0 0 1 96 96v16h256v-16a96.11 96.11 0 0 1 96-96m-224 64a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96"></path>
            <circle cx={256} cy={208} r={64}></circle>
            <path d="M416 336v16h48a32 32 0 0 0 32-32v-48h-16a64.07 64.07 0 0 0-64 64m64-192h16V96a32 32 0 0 0-32-32h-48v16a64.07 64.07 0 0 0 64 64M96 80V64H48a32 32 0 0 0-32 32v48h16a64.07 64.07 0 0 0 64-64"></path>
        </svg>
    );
}