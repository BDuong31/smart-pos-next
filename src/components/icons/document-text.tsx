import { useTheme } from "next-themes";

type DocumentTextProp = {
    size?: number;
    className?: string;
    stroke?: string;
    fill?: string;
}

export default function DocumentTextRegular(props: React.SVGProps<SVGSVGElement>) {
    const { theme } = useTheme();
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            viewBox="0 0 512 512"
        >
            <path fill='none' strokeLinejoin="round" strokeWidth={32} stroke='currentColor' d="M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62Z"></path>
	        <path fill='none' strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} stroke='currentColor' d="M256 56v120a32 32 0 0 0 32 32h120m-232 80h160m-160 80h160"></path>
        </svg>
    )
}

export function DocumentTextBold({size = 24, className}: DocumentTextProp) {
    const { theme } = useTheme();
    return (
        <svg
            className={`dark:stroke-[#F8F8F8] stroke-[#1F1F1F] ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            width={size} height={size} viewBox="0 0 512 512"
        >
            <path d="M428 224H288a48 48 0 0 1-48-48V36a4 4 0 0 0-4-4h-92a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h224a64 64 0 0 0 64-64V228a4 4 0 0 0-4-4m-92 160H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32m0-80H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32"></path>
	        <path d="M419.22 188.59L275.41 44.78a2 2 0 0 0-3.41 1.41V176a16 16 0 0 0 16 16h129.81a2 2 0 0 0 1.41-3.41"></path>
        </svg>
    );
}