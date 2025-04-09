export type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
    lastLogin: string;
};
