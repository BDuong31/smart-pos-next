'use client';

import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/store/store";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function ReduxProvider({
    children
}: {
    children: React.ReactNode;
}) { 
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}