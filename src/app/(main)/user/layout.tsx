'use client'
import SideRight from "@/layout/side-right";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="m-auto 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%] py-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                <div className="w-full lg:w-64 flex-shrink-0">
                    <SideRight />
                </div>
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}