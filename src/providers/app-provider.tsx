import ReduxProvider from "@/providers/redux-provider";
import QueryProvider from "@/providers/query-provider";
import React from "react";

interface AppProviderProps {
    children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
    return (
        <ReduxProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
        </ReduxProvider>
    );
} 