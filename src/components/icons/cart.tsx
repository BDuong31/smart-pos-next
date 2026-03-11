import { useTheme } from "next-themes";

export default function CartRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <circle cx={176} cy={416} r={16} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32}></circle>
            <circle cx={400} cy={416} r={16} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32}></circle>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M48 80h64l48 272h256"></path>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M160 288h249.44a8 8 0 0 0 7.85-6.43l28.8-144a8 8 0 0 0-7.85-9.57H128"></path>
        </svg>
    )
}

export function CartBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <circle cx={176} cy={416} r={32}></circle>
            <circle cx={400} cy={416} r={32}></circle>
            <path d="M456.8 120.78a23.92 23.92 0 0 0-18.56-8.78H133.89l-6.13-34.78A16 16 0 0 0 112 64H48a16 16 0 0 0 0 32h50.58l45.66 258.78A16 16 0 0 0 160 368h256a16 16 0 0 0 0-32H173.42l-5.64-32h241.66A24.07 24.07 0 0 0 433 284.71l28.8-144a24 24 0 0 0-5-19.93"></path>
        </svg>
    );
}