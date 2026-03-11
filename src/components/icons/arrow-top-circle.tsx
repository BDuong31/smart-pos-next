import { useTheme } from "next-themes";

export default function ArrowTopCircleRegular(){
    const { theme } = useTheme();
    return (
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M176 249.38L256 170l80 79.38m-80-68.35V342"
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

export function ArrowTopCircleBold() {
    const { theme } = useTheme()
    return (
                <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208s208-93.13 208-208S370.87 48 256 48m91.36 212.65a16 16 0 0 1-22.63.09L272 208.42V342a16 16 0 0 1-32 0V208.42l-52.73 52.32A16 16 0 1 1 164.73 238l80-79.39a16 16 0 0 1 22.54 0l80 79.39a16 16 0 0 1 .09 22.65"
            />
        </svg>
    )
}