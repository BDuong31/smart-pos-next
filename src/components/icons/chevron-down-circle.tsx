import { useTheme } from "next-themes";

export default function ChevronDownCircleRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeMiterlimit={10} strokeWidth={32} d="M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64Z"></path>
	        <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="m352 216l-96 96l-96-96"></path>
        </svg>
    )
}

export function ChevronDownCircleBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M464 256c0-114.87-93.13-208-208-208S48 141.13 48 256s93.13 208 208 208s208-93.13 208-208m-100.69-28.69l-96 96a16 16 0 0 1-22.62 0l-96-96a16 16 0 0 1 22.62-22.62L256 289.37l84.69-84.68a16 16 0 0 1 22.62 22.62"
            />
        </svg>
    );
}