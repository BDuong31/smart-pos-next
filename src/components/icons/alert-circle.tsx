import { useTheme } from "next-themes";

export default function AlertCircleRegular() {
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z"
                fill="none"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
            />
            <path 
                d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 6"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
            <path 
                d="M256 367.91a20 20 0 1 1 20-20a20 20 0 0 1-20 20"/>
        </svg>
    )
}

export function AlertCircleBold() {
    return (
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m0 319.91a20 20 0 1 1 20-20a20 20 0 0 1-20 20m21.72-201.15l-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0Z"
            />
        </svg>
    )
}