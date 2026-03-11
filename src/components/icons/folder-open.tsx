import { useTheme } from "next-themes";

export default function FolderOpenRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M64 192v-72a40 40 0 0 1 40-40h75.89a40 40 0 0 1 22.19 6.72l27.84 18.56a40 40 0 0 0 22.19 6.72H408a40 40 0 0 1 40 40v40"></path>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M479.9 226.55L463.68 392a40 40 0 0 1-39.93 40H88.25a40 40 0 0 1-39.93-40L32.1 226.55A32 32 0 0 1 64 192h384.1a32 32 0 0 1 31.8 34.55"></path>

        </svg>
    )
}

export function FolderOpenBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M408 96H252.11a23.9 23.9 0 0 1-13.31-4L211 73.41A55.77 55.77 0 0 0 179.89 64H104a56.06 56.06 0 0 0-56 56v24h416c0-30.88-25.12-48-56-48m15.75 352H88.25a56 56 0 0 1-55.93-55.15L16.18 228.11v-.28A48 48 0 0 1 64 176h384.1a48 48 0 0 1 47.8 51.83v.28l-16.22 164.74A56 56 0 0 1 423.75 448m56.15-221.45"
            />
        </svg>
    );
}