import { useTheme } from "next-themes";

type ChevronDownProps = {
    size?: number;
    className?: string;
}

export default function ChevronDown({size = 24, className}: ChevronDownProps) {
    const { theme } = useTheme();
    return (
        <svg
            className={`dark:stroke-[#F8F8F8] stroke-[#1F1F1F] ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            width={size} height={size} viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={48} d="m112 184l144 144l144-144"></path>
        </svg>
    )
}