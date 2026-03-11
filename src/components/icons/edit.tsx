import { useTheme } from "next-themes";

export default function EditRegular() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M384 224v184a40 40 0 0 1-40 40H104a40 40 0 0 1-40-40V168a40 40 0 0 1 40-40h167.48"></path>
            <path d="M459.94 53.25a16.06 16.06 0 0 0-23.22-.56L424.35 65a8 8 0 0 0 0 11.31l11.34 11.32a8 8 0 0 0 11.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38M399.34 90L218.82 270.2a9 9 0 0 0-2.31 3.93L208.16 299a3.91 3.91 0 0 0 4.86 4.86l24.85-8.35a9 9 0 0 0 3.93-2.31L422 112.66a9 9 0 0 0 0-12.66l-9.95-10a9 9 0 0 0-12.71 0"></path>
        </svg>
    )
}

export function EditBold() {
    const { theme } = useTheme();
    return (
        <svg
            className="dark:stroke-[#F8F8F8] stroke-[#1F1F1F]"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 512 512"
        >
           <path d="M459.94 53.25a16.06 16.06 0 0 0-23.22-.56L424.35 65a8 8 0 0 0 0 11.31l11.34 11.32a8 8 0 0 0 11.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38M399.34 90L218.82 270.2a9 9 0 0 0-2.31 3.93L208.16 299a3.91 3.91 0 0 0 4.86 4.86l24.85-8.35a9 9 0 0 0 3.93-2.31L422 112.66a9 9 0 0 0 0-12.66l-9.95-10a9 9 0 0 0-12.71 0"></path>
	        <path d="M386.34 193.66L264.45 315.79A41.1 41.1 0 0 1 247.58 326l-25.9 8.67a35.92 35.92 0 0 1-44.33-44.33l8.67-25.9a41.1 41.1 0 0 1 10.19-16.87l122.13-121.91a8 8 0 0 0-5.65-13.66H104a56 56 0 0 0-56 56v240a56 56 0 0 0 56 56h240a56 56 0 0 0 56-56V199.31a8 8 0 0 0-13.66-5.65"></path>
        </svg>
    );
}