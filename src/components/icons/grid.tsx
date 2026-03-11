import { useTheme } from "next-themes";

export default function GridRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <rect width={176} height={176} x={48} y={48} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} rx={20} ry={20}></rect>
            <rect width={176} height={176} x={288} y={48} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} rx={20} ry={20}></rect>
            <rect width={176} height={176} x={48} y={288} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} rx={20} ry={20}></rect>
            <rect width={176} height={176} x={288} y={288} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} rx={20} ry={20}></rect>
        </svg>
    )
}

export function GridBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M204 240H68a36 36 0 0 1-36-36V68a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36m240 0H308a36 36 0 0 1-36-36V68a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36M204 480H68a36 36 0 0 1-36-36V308a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36m240 0H308a36 36 0 0 1-36-36V308a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36"
            />
        </svg>
    );
}