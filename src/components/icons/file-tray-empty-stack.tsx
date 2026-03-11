import { useTheme } from "next-themes";

export default function FileTrayEmptyStackRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinejoin="round" strokeWidth={32} d="M48 336v96a48.14 48.14 0 0 0 48 48h320a48.14 48.14 0 0 0 48-48v-96"></path>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M48 336h144m128 0h144m-272 0a64 64 0 0 0 128 0"></path>
            <path fill="none" strokeLinejoin="round" strokeWidth={32} d="M384 32H128c-26 0-43 14-48 40L48 192v96a48.14 48.14 0 0 0 48 48h320a48.14 48.14 0 0 0 48-48v-96L432 72c-5-27-23-40-48-40Z"></path>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M48 192h144m128 0h144m-272 0a64 64 0 0 0 128 0"></path>
        </svg>
    )
}

export function FileTrayEmptyStackBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M464 352H320a16 16 0 0 0-16 16a48 48 0 0 1-96 0a16 16 0 0 0-16-16H48a16 16 0 0 0-16 16v64a64.07 64.07 0 0 0 64 64h320a64.07 64.07 0 0 0 64-64v-64a16 16 0 0 0-16-16m15.46-164.12L447.61 68.45C441.27 35.59 417.54 16 384 16H128c-16.8 0-31 4.69-42.1 13.94S67.66 52 64.4 68.4L32.54 187.88A16 16 0 0 0 32 192v48c0 35.29 28.71 80 64 80h320c35.29 0 64-44.71 64-80v-48a16 16 0 0 0-.54-4.12M440.57 176H320a15.92 15.92 0 0 0-16 15.82a48 48 0 1 1-96 0A15.92 15.92 0 0 0 192 176H71.43a2 2 0 0 1-1.93-2.52L95.71 75c3.55-18.41 13.81-27 32.29-27h256c18.59 0 28.84 8.53 32.25 26.85l26.25 98.63a2 2 0 0 1-1.93 2.52"
            />
        </svg>
    );
}