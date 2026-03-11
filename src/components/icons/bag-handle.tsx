import { useTheme } from "next-themes";

export default function BagHandleRegular(props: React.SVGProps<SVGSVGElement>) {
    const { theme } = useTheme();
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} stroke='currentColor' d="M80 176a16 16 0 0 0-16 16v216c0 30.24 25.76 56 56 56h272c30.24 0 56-24.51 56-54.75V192a16 16 0 0 0-16-16Zm80 0v-32a96 96 0 0 1 96-96h0a96 96 0 0 1 96 96v32"></path>
	        <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} stroke='currentColor' d="M160 224v16a96 96 0 0 0 96 96h0a96 96 0 0 0 96-96v-16"></path>
        </svg>
    )
}

export function BagHandleBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M454.65 169.4A31.82 31.82 0 0 0 432 160h-64v-16a112 112 0 0 0-224 0v16H80a32 32 0 0 0-32 32v216c0 39 33 72 72 72h272a72.22 72.22 0 0 0 50.48-20.55a69.48 69.48 0 0 0 21.52-50.2V192a31.75 31.75 0 0 0-9.35-22.6M176 144a80 80 0 0 1 160 0v16H176Zm192 96a112 112 0 0 1-224 0v-16a16 16 0 0 1 32 0v16a80 80 0 0 0 160 0v-16a16 16 0 0 1 32 0Z"
            />
        </svg>
    );
}