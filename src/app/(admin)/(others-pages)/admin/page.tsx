"use client"

import React, { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminUsers from "@/components/pages/admin/admin-users/adminUsers";

const Sahifa = () => {
    const [qiymat, qiymatniOzgartir] = useState("admin-foydalanuvchilar")

    return (
        <section>
            <PageBreadcrumb pageTitle="Admin huquqlari"/>
            <div className="w-full flex flex-col items-center gap-4">
                <div className="bg-gray-100 p-1 rounded-md w-full">
                    <ToggleGroup
                        type="single"
                        value={qiymat}
                        onValueChange={(yangi) => yangi && qiymatniOzgartir(yangi)}
                        className="grid grid-cols-3 gap-1 w-full"
                    >
                        <ToggleGroupItem
                            value="admin-foydalanuvchilar"
                            className="text-sm font-medium py-2 px-4 rounded-md data-[state=on]:bg-white data-[state=on]:text-black data-[state=off]:text-gray-500"
                        >
                            Admin foydalanuvchilar
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="rollar"
                            className="text-sm font-medium py-2 px-4 rounded-md data-[state=on]:bg-white data-[state=on]:text-black data-[state=off]:text-gray-500"
                        >
                            Rollar
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="ruxsatlar"
                            className="text-sm font-medium py-2 px-4 rounded-md data-[state=on]:bg-white data-[state=on]:text-black data-[state=off]:text-gray-500"
                        >
                            Ruxsatlar
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div className="w-full bg-white p-4 border-[1px] border-gray-200 rounded-md">
                    {qiymat === "admin-foydalanuvchilar" && (
                        <AdminUsers/>
                    )}
                    {qiymat === "rollar" && (
                        <p>Bu sahifada rollar bilan ishlash: yaratish, tahrirlash va o‘chirish.</p>
                    )}
                    {qiymat === "ruxsatlar" && (
                        <p>Bu qismda tizimdagi ruxsatlar va ularning rollarga biriktirilishi ko‘rsatiladi.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Sahifa
