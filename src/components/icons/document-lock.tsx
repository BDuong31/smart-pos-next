import { useTheme } from "next-themes";

export default function DocumentLockRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M288 304v-18c0-16.63-14.26-30-32-30s-32 13.37-32 30v18"></path>
            <path  d="M304 416h-96a32 32 0 0 1-32-32v-48a32 32 0 0 1 32-32h96a32 32 0 0 1 32 32v48a32 32 0 0 1-32 32"></path>
            <path fill="none" strokeLinejoin="round" strokeWidth={32} d="M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62Z"></path>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M256 50.88V176a32 32 0 0 0 32 32h125.12"></path>
        </svg>
    )
}

export function DocumentLockBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path d="M288 192h129.81a2 2 0 0 0 1.41-3.41L275.41 44.78a2 2 0 0 0-3.41 1.41V176a16 16 0 0 0 16 16m-32 80c-8.82 0-16 6.28-16 14v18h32v-18c0-7.72-7.18-14-16-14"></path>
	        <path d="M428 224H288a48 48 0 0 1-48-48V36a4 4 0 0 0-4-4h-92a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h224a64 64 0 0 0 64-64V228a4 4 0 0 0-4-4m-92 160a32 32 0 0 1-32 32h-96a32 32 0 0 1-32-32v-48a32 32 0 0 1 32-32v-18c0-25.36 21.53-46 48-46s48 20.64 48 46v18a32 32 0 0 1 32 32Z"></path>
        </svg>
    );
}