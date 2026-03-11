import { useTheme } from "next-themes";

export default function AddCircleRegular() {
  const { theme } = useTheme();
  return (
    <svg 
        className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
        xmlns="http://www.w3.org/2000/svg" 
        width="24" height="24" viewBox="0 0 512 512"
    > 
        <path
            d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z"
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="32"
            fill="none"
        />
        <path
            d="M256 176v160m80-80H176"
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="32"
            fill="none"
        />
    </svg>
  );
}

export function AddCircleBold() {
    const { theme } = useTheme();
    return (
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m80 224h-64v64a16 16 0 0 1-32 0v-64h-64a16 16 0 0 1 0-32h64v-64a16 16 0 0 1 32 0v64h64a16 16 0 0 1 0 32"
            />
        </svg>
    )
}