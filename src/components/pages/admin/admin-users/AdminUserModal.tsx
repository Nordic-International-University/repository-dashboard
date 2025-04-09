"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z
    .object({
        name: z.string().min(2, "Ism kamida 2 harf bo'lishi kerak"),
        email: z.string().email("To‘g‘ri email kiriting"),
        role: z.string().nonempty("Rolni tanlang"),
        status: z.enum(["active", "inactive"]),
        password: z.string().min(8, "Parol kamida 8 ta belgidan iborat bo‘lishi kerak"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Parollar mos emas",
        path: ["confirmPassword"],
    })

export function CreateAdminModal({open,setOpen}:{open:boolean,setOpen:(open:boolean) => void}) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            status: "active",
            password: "",
            confirmPassword: "",
        },
    })

    console.log(form)

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Yangi admin:", values)
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Yangi admin foydalanuvchi qo‘shish</DialogTitle>
                    <DialogDescription>Yangi admin uchun hisob yarating</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To‘liq ism</FormLabel>
                                    <FormControl>
                                        <Input placeholder="To‘liq ism" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email manzili</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email kiriting" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Roli</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Rolni tanlang" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="moderator">Moderator</SelectItem>
                                            <SelectItem value="superadmin">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Rol foydalanuvchining tizimdagi huquqlarini belgilaydi.
                                    </p>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Holati</FormLabel>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-1">
                                       <div className="flex gap-6 item-center">
                                           <div className="flex items-center space-x-2">
                                               <RadioGroupItem value="active" id="active" />
                                               <FormLabel htmlFor="active">Faol</FormLabel>
                                           </div>
                                           <div className="flex items-center space-x-2">
                                               <RadioGroupItem value="inactive" id="inactive" />
                                               <FormLabel htmlFor="inactive">Nofaol</FormLabel>
                                           </div>
                                       </div>
                                    </RadioGroup>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Nofaol foydalanuvchilar tizimga kira olmaydi.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parol</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Parol" {...field} />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Parol kamida 8 ta belgidan iborat bo‘lishi kerak.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parolni tasdiqlang</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Parolni qayta kiriting" {...field} />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground invisible mt-1">
                                        Parol kamida 8 ta belgidan iborat bo‘lishi kerak.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="col-span-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Bekor qilish
                            </Button>
                            <Button type="submit">Foydalanuvchini yaratish</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
