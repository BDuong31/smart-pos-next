import { useTheme } from "next-themes";

export default function ShareRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <circle cx={128} cy={256} r={48} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32}></circle>
            <circle cx={384} cy={112} r={48} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32}></circle>
            <circle cx={384} cy={400} r={48} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32}></circle>
            <path 
                d="m169.83 279.53l172.34 96.94m0-240.94l-172.34 96.94"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
            />
        </svg>
    )
}

export function ShareBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M384 336a63.78 63.78 0 0 0-46.12 19.7l-148-83.27a63.85 63.85 0 0 0 0-32.86l148-83.27a63.8 63.8 0 1 0-15.73-27.87l-148 83.27a64 64 0 1 0 0 88.6l148 83.27A64 64 0 1 0 384 336"
            />
        </svg>
    );
}