import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            fullName?: string | null;
            email?: string | null;
            birthday?: string | null;
            username?: string | null;
        };
    }
}