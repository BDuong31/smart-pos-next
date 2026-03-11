import { useTheme } from "next-themes";

export default function ChevronForward() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={48} d="m184 112l144 144l-144 144"></path>
        </svg>
    )
}