import { useTheme } from "next-themes";

export default function BedRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M384 240H96V136a40.12 40.12 0 0 1 40-40h240a40.12 40.12 0 0 1 40 40v104ZM48 416V304a64.19 64.19 0 0 1 64-64h288a64.19 64.19 0 0 1 64 64v112"></path>
	        <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M48 416v-8a24.07 24.07 0 0 1 24-24h368a24.07 24.07 0 0 1 24 24v8M112 240v-16a32.09 32.09 0 0 1 32-32h80a32.09 32.09 0 0 1 32 32v16m0 0v-16a32.09 32.09 0 0 1 32-32h80a32.09 32.09 0 0 1 32 32v16"></path>
        </svg>
    )
}

export function BedBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path d="M432 230.7a79.4 79.4 0 0 0-32-6.7H112a79.5 79.5 0 0 0-32 6.69A80.09 80.09 0 0 0 32 304v112a16 16 0 0 0 32 0v-8a8.1 8.1 0 0 1 8-8h368a8.1 8.1 0 0 1 8 8v8a16 16 0 0 0 32 0V304a80.09 80.09 0 0 0-48-73.3M376 80H136a56 56 0 0 0-56 56v72a4 4 0 0 0 5.11 3.84A95.5 95.5 0 0 1 112 208h4.23a4 4 0 0 0 4-3.55A32 32 0 0 1 152 176h56a32 32 0 0 1 31.8 28.45a4 4 0 0 0 4 3.55h24.46a4 4 0 0 0 4-3.55A32 32 0 0 1 304 176h56a32 32 0 0 1 31.8 28.45a4 4 0 0 0 4 3.55h4.2a95.5 95.5 0 0 1 26.89 3.85A4 4 0 0 0 432 208v-72a56 56 0 0 0-56-56"></path>
        </svg>
    );
}