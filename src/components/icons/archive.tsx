import { useTheme } from "next-themes";

export default function AlertCircleRegular() {
    const { theme} = useTheme();
    return (
        <svg 
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M80 152v256a40.12 40.12 0 0 0 40 40h272a40.12 40.12 0 0 0 40-40V152"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
            <rect 
                width={416} 
                height={80} 
                x={48} 
                y={64}                 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
                rx={28} 
                ry={28}
            />
            <path 
                d="m320 304l-64 64l-64-64m64 41.89V224"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none"
            />
    </svg>
    )
}

export function AlertCircleBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path d="M64 164v244a56 56 0 0 0 56 56h272a56 56 0 0 0 56-56V164a4 4 0 0 0-4-4H68a4 4 0 0 0-4 4m267 151.63l-63.69 63.68a16 16 0 0 1-22.62 0L181 315.63c-6.09-6.09-6.65-16-.85-22.38a16 16 0 0 1 23.16-.56L240 329.37V224.45c0-8.61 6.62-16 15.23-16.43A16 16 0 0 1 272 224v105.37l36.69-36.68a16 16 0 0 1 23.16.56c5.8 6.37 5.24 16.29-.85 22.38"></path>
	        <rect width={448} height={80} x={32} y={48} rx={32} ry={32}></rect>
        </svg>
    )
}