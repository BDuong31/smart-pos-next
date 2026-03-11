import { useTheme } from 'next-themes';

export function SwapHorizontal(){
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="m304 48l112 112l-112 112m94.87-112H96m112 304L96 352l112-112m-94 112h302"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                fill="none"
            />
        </svg>
    );
}