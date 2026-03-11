import { useTheme } from "next-themes";

export default function ImageRegular(props: React.SVGProps<SVGSVGElement>) {
    const { theme } = useTheme();
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            viewBox="0 0 512 512"
        >
            <rect width={416} height={352} x={48} y={80} fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={32} rx={48} ry={48}></rect>
            <circle cx={336} cy={176} r={32} fill="none" stroke='currentColor' strokeMiterlimit={10} strokeWidth={32}></circle>
            <path fill="none" stroke='currentColor' strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="m304 335.79l-90.66-90.49a32 32 0 0 0-43.87-1.3L48 352m176 80l123.34-123.34a32 32 0 0 1 43.11-2L464 368"></path>
        </svg>
    )
}

export function ImageBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M416 64H96a64.07 64.07 0 0 0-64 64v256a64.07 64.07 0 0 0 64 64h320a64.07 64.07 0 0 0 64-64V128a64.07 64.07 0 0 0-64-64m-80 64a48 48 0 1 1-48 48a48.05 48.05 0 0 1 48-48M96 416a32 32 0 0 1-32-32v-67.63l94.84-84.3a48.06 48.06 0 0 1 65.8 1.9l64.95 64.81L172.37 416Zm352-32a32 32 0 0 1-32 32H217.63l121.42-121.42a47.72 47.72 0 0 1 61.64-.16L448 333.84Z"
            />
        </svg>
    );
}