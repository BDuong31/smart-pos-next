import { useTheme } from "next-themes";

export default function ArrowLeftCircleRegular(){
    const { theme } = useTheme();
    return (
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M249.38 336L170 256l79.38-80m-68.35 80H342"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
	        <path 
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
        </svg>
    )
}

export function ArrowLeftCircleBold() {
    const { theme } = useTheme()
    return (
                <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M48 256c0 114.87 93.13 208 208 208s208-93.13 208-208S370.87 48 256 48S48 141.13 48 256m212.65-91.36a16 16 0 0 1 .09 22.63L208.42 240H342a16 16 0 0 1 0 32H208.42l52.32 52.73A16 16 0 1 1 238 347.27l-79.39-80a16 16 0 0 1 0-22.54l79.39-80a16 16 0 0 1 22.65-.09"
            />
        </svg>
    )
}