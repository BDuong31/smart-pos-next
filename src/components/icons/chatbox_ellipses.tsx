import { useTheme } from "next-themes";

export default function ChatboxEllipsesRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinejoin="round" strokeWidth={32} d="M408 64H104a56.16 56.16 0 0 0-56 56v192a56.16 56.16 0 0 0 56 56h40v80l93.72-78.14a8 8 0 0 1 5.13-1.86H408a56.16 56.16 0 0 0 56-56V120a56.16 56.16 0 0 0-56-56Z"></path>
            <circle cx={160} cy={216} r={32}></circle>
            <circle cx={256} cy={216} r={32}></circle>
            <circle cx={352} cy={216} r={32}></circle>
        </svg>
    )
}

export function ChatboxEllipsesBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M408 48H104a72.08 72.08 0 0 0-72 72v192a72.08 72.08 0 0 0 72 72h24v64a16 16 0 0 0 26.25 12.29L245.74 384H408a72.08 72.08 0 0 0 72-72V120a72.08 72.08 0 0 0-72-72M160 248a32 32 0 1 1 32-32a32 32 0 0 1-32 32m96 0a32 32 0 1 1 32-32a32 32 0 0 1-32 32m96 0a32 32 0 1 1 32-32a32 32 0 0 1-32 32"
            />
        </svg>
    );
}