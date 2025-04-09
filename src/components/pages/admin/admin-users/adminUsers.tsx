import React from 'react';
import {Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import {InputWithIcon} from "@/components/input/CustomInput";
import {UserAddOutlined} from "@ant-design/icons";
import {UserTable} from "@/components/pages/admin/admin-users/adminUsersTable";
import {CreateAdminModal} from "@/components/pages/admin/admin-users/AdminUserModal";

const AdminUsers = () => {
    const [open,setOpen] = React.useState(false);
    return (
        <div>
            <div>
                <h2 className="font-semibold text-xl">Admin foydalanuvchilar</h2>
                <p className="font-normal text-sm text-gray-600 tracking-[0.3px]">bu bo'lim orqali foydalanuvchi yaratish mumkun</p>
            </div>
            <div className="mt-7 flex item-center justify-between">
               <InputWithIcon placeholder="Qidiruv..." prefix={<Search size={14}/>}/>
                <Button onClick={() => setOpen(true)}>
                    <UserAddOutlined /> Admin qo'shish
                </Button>

            </div>
            <UserTable/>
           <CreateAdminModal open={open} setOpen={setOpen}/>
        </div>
    );
};

export default AdminUsers;