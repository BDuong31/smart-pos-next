import { useTheme } from "next-themes";

export default function MailRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <rect 
                width={416} 
                height={320} 
                x={48} y={96} 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={32} 
                rx={40} 
                ry={40}
            />
	        <path 
                d="m112 160l144 112l144-112"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                fill="none"
            />
        </svg>
    )
}

export function MailBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M424 80H88a56.06 56.06 0 0 0-56 56v240a56.06 56.06 0 0 0 56 56h336a56.06 56.06 0 0 0 56-56V136a56.06 56.06 0 0 0-56-56m-14.18 92.63l-144 112a16 16 0 0 1-19.64 0l-144-112a16 16 0 1 1 19.64-25.26L256 251.73l134.18-104.36a16 16 0 0 1 19.64 25.26"
            />
        </svg>
    );
}