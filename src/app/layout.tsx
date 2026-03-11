import ReduxProvider from "@/providers/redux-provider";
import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ReduxProvider>
            {children}
        </ReduxProvider>
      </body>
    </html>
  );
}