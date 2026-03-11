import { useTheme } from "next-themes";

export default function AlbumsRegular(props: React.SVGProps<SVGSVGElement>) {
    const { theme } = useTheme();
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            viewBox="0 0 512 512"
        >
            <rect 
                width={384} 
                height={256} 
                x={64} y={176} 
                rx={28.87} 
                ry={28.87}
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none" 
                stroke="currentColor"
            />
	        <path 
                d="M144 80h224m-256 48h288"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32"
                fill="none" 
                stroke="currentColor"
            />
        </svg>
    )
}

export function AlbumsBold(props: React.SVGProps<SVGSVGElement>) {
    const { theme } = useTheme()
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg" 
            {...props}
            viewBox="0 0 512 512"
        >
            <path
                d="M368 96H144a16 16 0 0 1 0-32h224a16 16 0 0 1 0 32m32 48H112a16 16 0 0 1 0-32h288a16 16 0 0 1 0 32m19.13 304H92.87A44.92 44.92 0 0 1 48 403.13V204.87A44.92 44.92 0 0 1 92.87 160h326.26A44.92 44.92 0 0 1 464 204.87v198.26A44.92 44.92 0 0 1 419.13 448"
                fill="currentColor"
                stroke="currentColr"
            />
        </svg>
    )
}