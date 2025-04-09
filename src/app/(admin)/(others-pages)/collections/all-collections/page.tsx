'use client'

'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PencilIcon, Trash2Icon } from "lucide-react";
import CustomDrawer from "@/components/drawer/customDrawer";
import {Switch} from "@/components/ui/switch";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomPagination from "@/components/pagination/CustomPagination";

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

const dummyCategories: Category[] = [
    { id: "1", name: "Iqtisodiyot", slug: "iqtisodiyot", description: "Iqtisodiy fanlarga oid materiallar" },
    { id: "2", name: "Ta'lim", slug: "talim", description: "Ta'lim sohasidagi dissertatsiyalar" },
];

const Page = () => {
    const [categories, setCategories] = useState<Category[]>(dummyCategories);
    const [selected, setSelected] = useState<Category | null>(null);
    const [open, setOpen] = useState(false);

    const handleEdit = (category: Category) => {
        setSelected(category);
        setOpen(true);
    };

    const handleDelete = (id: string) => {
        setCategories(categories.filter((cat) => cat.id !== id));
    };

    return (
        <div>
                <PageBreadcrumb pageTitle="Barcha bo'limlar"/>
            <div className="border-1 rounded-md px-2 py-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nomi</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Izoh</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell>{cat.slug}</TableCell>
                                <TableCell>{cat.description}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>
                                        <PencilIcon className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                                        <Trash2Icon className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <CustomDrawer
                open={open}
                setOpen={setOpen}
                title="Bo'limni tahrirlash"
                description={selected?.name + " bo'limini o'zgartiring."}
            >
                <Input value={selected?.name || ""} placeholder="Bo'lim nomi" readOnly />
                <Input value={selected?.slug || ""} placeholder="Slug" readOnly />
                <Input value={selected?.description || ""} placeholder="Izoh" readOnly />
                <Switch/>
            </CustomDrawer>
                <div className="mt-4">
                    <CustomPagination onPageChange={() => console.log('change')} position="end" totalPages={4} currentPage={1}/>
                </div>
        </div>
    );
};

export default Page;
