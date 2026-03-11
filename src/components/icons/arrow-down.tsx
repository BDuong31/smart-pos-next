import { useTheme } from "next-themes";

export default function ArrowDown(){
    const { theme } = useTheme();
    return (
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="m112 268l144 144l144-144M256 392V100"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
        </svg>
    )
}