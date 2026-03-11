import { useTheme } from "next-themes";

type Props = {
    className?: string;
    width?: number;
    height?: number;
}
export default function ArrowForward({ className, width = 24, height = 24 }: Props){
    const { theme } = useTheme();
    return (
        <svg 
            className={`dark:stroke-[#F8F8F8] stroke-[#1F1F1F] ${className}`}
            xmlns="http://www.w3.org/2000/svg" 
            width={width} height={height} viewBox="0 0 512 512"
        >
            <path 
                d="m268 112l144 144l-144 144m124-144H100"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
        </svg>
    )
}