import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { AdminUser } from "../../../../../types/admin/admin.types"

const foydalanuvchilar: AdminUser[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Super Admin",
        status: "Inactive",
        lastLogin: "2025-yil 1-aprel, 15:30",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Moderator",
        status: "Active",
        lastLogin: "2025-yil 3-aprel, 10:00",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Moderator",
        status: "Active",
        lastLogin: "2025-yil 3-aprel, 10:00",
    },   {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Moderator",
        status: "Active",
        lastLogin: "2025-yil 3-aprel, 10:00",
    },   {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Moderator",
        status: "Active",
        lastLogin: "2025-yil 3-aprel, 10:00",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Moderator",
        status: "Active",
        lastLogin: "2025-yil 3-aprel, 10:00",
    },
]

export function UserTable() {
    return (
        <div className="mt-7 px-2 border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ismi</TableHead>
                        <TableHead>Email manzili</TableHead>
                        <TableHead>Roli</TableHead>
                        <TableHead>Holati</TableHead>
                        <TableHead>Oxirgi kirish</TableHead>
                        <TableHead className="text-right">Amallar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {foydalanuvchilar.map((foydalanuvchi) => (
                        <TableRow key={foydalanuvchi.id}>
                            <TableCell>{foydalanuvchi.name}</TableCell>
                            <TableCell>{foydalanuvchi.email}</TableCell>
                            <TableCell>{foydalanuvchi.role}</TableCell>
                            <TableCell>
                                <span
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                                        foydalanuvchi.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {foydalanuvchi.status === "Active" ? "Faol" : "Faol emas"}
                                </span>
                            </TableCell>
                            <TableCell>{foydalanuvchi.lastLogin}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => console.log("Yangilash", foydalanuvchi.id)}
                                        >
                                            Yangilash
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => console.log("O‘chirish", foydalanuvchi.id)}
                                            className="text-red-600"
                                        >
                                            O‘chirish
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
