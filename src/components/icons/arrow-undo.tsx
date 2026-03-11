import { useTheme } from "next-themes";

export default function ArrowUndoRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path d="M245.09 327.74v-37.32c57.07 0 84.51 13.47 108.58 38.68c5.4 5.65 15 1.32 14.29-6.43c-5.45-61.45-34.14-117.09-122.87-117.09v-37.32a8.32 8.32 0 0 0-14.05-6L146.58 242a8.2 8.2 0 0 0 0 11.94L231 333.71a8.32 8.32 0 0 0 14.09-5.97"></path>
	        <path fill="none" strokeMiterlimit={10} strokeWidth={32} d="M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64Z"></path>
        </svg>
    )
}

export function ArrowUndoBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path 
                d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208s208-93.13 208-208S370.87 48 256 48m97.67 281.1c-24.07-25.21-51.51-38.68-108.58-38.68v37.32a8.32 8.32 0 0 1-14.05 6L146.58 254a8.2 8.2 0 0 1 0-11.94L231 162.29a8.32 8.32 0 0 1 14.05 6v37.32c88.73 0 117.42 55.64 122.87 117.09c.73 7.72-8.85 12.05-14.25 6.4"
            />
        </svg>
    );
}