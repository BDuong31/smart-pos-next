import { useTheme } from "next-themes";

export default function CheckmarkCircleRegular() {
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
                strokeOpacity="0.7"
                fill="none"
            />
            <path 
                d="M352 176L217.6 336L160 272"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                strokeOpacity="0.7"
                fill="none"
            />
        </svg>
    );
}

export function CheckmarkCircleBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            {/* <path
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                strokeOpacity="0.7"
                fill="none"
            /> */}
            <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m108.25 138.29l-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32l122.59-145.91a16 16 0 0 1 24.5 20.58"/>
        </svg>
    );
}

    