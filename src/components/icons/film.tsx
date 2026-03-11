import { useTheme } from "next-themes";

export default function FilmRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <rect width={416} height={320} x={48} y={96} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={80} height={80} x={384} y={336} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={80} height={80} x={384} y={256} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={80} height={80} x={384} y={176} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={80} height={80} x={384} y={96} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={80} height={80} x={48} y={336} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={80} height={80} x={48} y={256} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={80} height={80} x={48} y={176} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={80} height={80} x={48} y={96} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={256} height={160} x={128} y={96} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
            <rect width={256} height={160} x={128} y={256} fill="none" strokeLinejoin="round" strokeWidth={32} rx={28} ry={28}></rect>
        </svg>
    )
}

export function FilmBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M436 80H76a44.05 44.05 0 0 0-44 44v264a44.05 44.05 0 0 0 44 44h360a44.05 44.05 0 0 0 44-44V124a44.05 44.05 0 0 0-44-44M112 388a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12Zm0-80a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12Zm0-80a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12Zm0-80a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12Zm241.68 124H158.32a16 16 0 0 1 0-32h195.36a16 16 0 1 1 0 32M448 388a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12Zm0-80a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12Zm0-80a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12Zm0-80a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12Z"
            />
        </svg>
    );
}