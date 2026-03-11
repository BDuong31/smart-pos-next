import { useTheme } from "next-themes";

export default function CafeRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M368 80h64a16 16 0 0 1 16 16v34a46 46 0 0 1-46 46h-34M96 80h272v192a80 80 0 0 1-80 80H176a80 80 0 0 1-80-80zM64 416h336"></path>
        </svg>
    )
}

export function CafeBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M432 64H96a16 16 0 0 0-16 16v192a96.11 96.11 0 0 0 96 96h112a96.11 96.11 0 0 0 96-96v-80h18a62.07 62.07 0 0 0 62-62V96a32 32 0 0 0-32-32m0 66a30 30 0 0 1-30 30h-18V96h48Zm-32 270H64a16 16 0 0 0 0 32h336a16 16 0 0 0 0-32"
            />
        </svg>
    );
}