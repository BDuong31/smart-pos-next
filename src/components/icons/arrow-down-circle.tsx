import { useTheme } from "next-themes";

export default function ArrowDownCircleRegular(){
    const { theme } = useTheme();
    return (
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M176 262.62L256 342l80-79.38m-80 68.35V170"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
	        <path 
                d="M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64Z"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
        </svg>
    )
}

export function ArrowDownCircleBold() {
    const { theme } = useTheme()
    return (
                <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M256 464c114.87 0 208-93.13 208-208S370.87 48 256 48S48 141.13 48 256s93.13 208 208 208m-91.36-212.65a16 16 0 0 1 22.63-.09L240 303.58V170a16 16 0 0 1 32 0v133.58l52.73-52.32A16 16 0 1 1 347.27 274l-80 79.39a16 16 0 0 1-22.54 0l-80-79.39a16 16 0 0 1-.09-22.65"
            />
        </svg>
    )
}