import { useTheme } from "next-themes";

export default function PenRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M364.13 125.25L87 403l-23 45l44.99-23l277.76-277.13zm56.56-56.56l-22.62 22.62l22.62 22.63l22.62-22.63a16 16 0 0 0 0-22.62h0a16 16 0 0 0-22.62 0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                fill="none"
            />
        </svg>
    )
}

export function PenBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M358.62 129.28L86.49 402.08L70 442l39.92-16.49l272.8-272.13zm54.45-54.44l-11.79 11.78l24.1 24.1l11.79-11.79a16.51 16.51 0 0 0 0-23.34l-.75-.75a16.51 16.51 0 0 0-23.35 0"
            />
        </svg>
    );
}