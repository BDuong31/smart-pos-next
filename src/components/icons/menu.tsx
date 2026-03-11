import { useTheme } from "next-themes";

export default function MenuRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M80 160h352M80 256h352M80 352h352"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                fill="none"
            />
        </svg>
    )
}

export function MenuBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M88 152h336M88 256h336M88 360h336"
                fill="none" 
                strokeLinecap="round" 
                strokeWidth={48} 
            />
        </svg>
    );
}