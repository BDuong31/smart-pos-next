import { useTheme } from "next-themes";
import { use } from "react";

export default function SupportRegular(){
    const { theme } = useTheme();
    return(
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width={24} height={24} viewBox="0 0 512 512"
        >
            <circle 
                cx={256} 
                cy={256} 
                r={208} 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={32}
            />
            <circle 
                cx={256} 
                cy={256} 
                r={80} 
                fill="none"  
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={32}
            />
            <path 
                d="m208 54l8 132m80 0l8-132m-96 404l8-132m80 0l8 132m154-250l-132 8m0 80l132 8M54 208l132 8m0 80l-132 8"
                fill="none"  
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={32}
            />
        </svg>
    )
}

export function SupportBold(){
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width={24} height={24} viewBox="0 0 512 512"
        >
            <path 
                d="M414.39 97.61A224 224 0 1 0 97.61 414.39A224 224 0 1 0 414.39 97.61M192.13 260.18a64 64 0 1 1 59.69 59.69a64.07 64.07 0 0 1-59.69-59.69m240-66.64l-96.37 5.84a4.06 4.06 0 0 1-3.44-1.59a96 96 0 0 0-18.07-18.07a4.06 4.06 0 0 1-1.59-3.44l5.84-96.37a4 4 0 0 1 5.42-3.51A193 193 0 0 1 435.6 188.12a4 4 0 0 1-3.51 5.42ZM193.54 79.91l5.84 96.37a4.06 4.06 0 0 1-1.59 3.44a96 96 0 0 0-18.07 18.07a4.06 4.06 0 0 1-3.44 1.59l-96.37-5.84a4 4 0 0 1-3.51-5.42A193 193 0 0 1 188.12 76.4a4 4 0 0 1 5.42 3.51M79.91 318.46l96.37-5.84a4.06 4.06 0 0 1 3.44 1.59a96 96 0 0 0 18.07 18.07a4.06 4.06 0 0 1 1.59 3.44l-5.84 96.37a4 4 0 0 1-5.42 3.51A193 193 0 0 1 76.4 323.88a4 4 0 0 1 3.51-5.42m238.55 113.63l-5.84-96.37a4.06 4.06 0 0 1 1.59-3.44a96 96 0 0 0 18.07-18.07a4.06 4.06 0 0 1 3.44-1.59l96.37 5.84a4 4 0 0 1 3.51 5.42A193 193 0 0 1 323.88 435.6a4 4 0 0 1-5.42-3.51"
            />
        </svg>
    );
}