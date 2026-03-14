import ReduxProvider from "@/providers/redux-provider";
import QueryProvider from "@/providers/query-provider";
import React from "react";
import { ToastProvider } from "@/context/toast-context";

interface AppProviderProps {
    children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
    return (
        <ReduxProvider>
            <QueryProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </QueryProvider>
        </ReduxProvider>
    );
} 