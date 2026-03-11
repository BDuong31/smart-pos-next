import { useTheme } from "next-themes";

export default function ArrowRightCircleRegular(){
    const { theme } = useTheme();
    return (
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M262.62 336L342 256l-79.38-80m68.35 80H170"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
	        <path 
                d="M256 448c106 0 192-86 192-192S362 64 256 64S64 150 64 256s86 192 192 192Z"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
        </svg>
    )
}

export function ArrowRightCircleBold() {
    const { theme } = useTheme()
    return (
                <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M464 256c0-114.87-93.13-208-208-208S48 141.13 48 256s93.13 208 208 208s208-93.13 208-208m-212.65 91.36a16 16 0 0 1-.09-22.63L303.58 272H170a16 16 0 0 1 0-32h133.58l-52.32-52.73A16 16 0 1 1 274 164.73l79.39 80a16 16 0 0 1 0 22.54l-79.39 80a16 16 0 0 1-22.65.09"
            />
        </svg>
    )
}