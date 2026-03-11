import { useTheme } from "next-themes";

export default function MastercardRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
        >
            <g 
                fill="none" 
                strokeLinejoin="round" 
                strokeWidth={1}
            >
                <path d="M1.5 12A6.25 6.25 0 1 0 14 12a6.25 6.25 0 1 0-12.5 0"/>
                <path d="M10 12a6.25 6.25 0 1 0 12.5 0A6.25 6.25 0 1 0 10 12"/>
	        </g>
        </svg>
    )
}

export function MastercardBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
        >
            <g fillRule="evenodd">
                <circle cx={7} cy={12} r={6}></circle>
                <circle cx={17} cy={12} r={6} fillOpacity={0.8}></circle>
            </g>
        </svg>
    );
}