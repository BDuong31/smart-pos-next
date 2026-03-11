import { useTheme } from 'next-themes';

export default function TimmerRegular(){
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64Z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                fill="none"
            />
	        <path 
                d="M256 128v144h96"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                fill="none"
            />
        </svg>
    );
}

export function TimmerBold(){
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208s208-93.13 208-208S370.87 48 256 48m96 240h-96a16 16 0 0 1-16-16V128a16 16 0 0 1 32 0v128h80a16 16 0 0 1 0 32"
            />
        </svg>
    );
}