'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState, useRef } from 'react'

import { useCollectionsQuery } from '@/hooks/use-collections'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import type { ResourceFormValues } from '../../../../types/material/material.types'
import { resourceFormScheme } from '@/schemes/material.scheme'
import { useResourceTypesQuery } from '@/hooks/use-resources'
import { useCreateKeywordMutation, useKeywordsQuery } from '@/hooks/use-keywords'
import FileUpload from '@/components/file.upload'
import { AntdMultiSelect } from '@/components/input/custom-multi-select'
import { Textarea } from '@/components/ui/textarea'
import { useAuthorsQuery, useCreateAuthorMutation } from '@/hooks/use-authors'
import { resourceService } from '@/services/materials.service'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Card } from '@radix-ui/themes'
import { Globe, Info, Lock, AlertCircle } from 'lucide-react'
import { AuthorForm } from '@/components/pages/author/author-form'
import { DialogModal } from '@/components/modal/custom.modal'
import { AuthorFormValues } from '../../../../types/author/author.types'
import {UniversalDropdown,UniversalSingleDropdown} from '../../input/custom.dropdown'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCategoriesQuery } from '@/hooks/use-categories'

interface Props {
    onSubmitFunction: (data: ResourceFormValues) => void
    initialData?: any
}

export const ResourceForm = ({ onSubmitFunction, initialData }: Props) => {
    const form = useForm<ResourceFormValues>({
        // @ts-ignore
        resolver: zodResolver(resourceFormScheme),
        defaultValues: {
            title: '',
            description: '',
            doi: '',
            language: '',
            license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
            collectionId: '',
            categoryId: '',
            resourceTypeId: '',
            authors: [],
            documents: [],
            keywords: [],
            isPublic: false,
            youtubeVideos: [],
        },
    })

    const [videoUrl, setVideoUrl] = useState('')
    const [videoTitle, setVideoTitle] = useState('')
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [urlError, setUrlError] = useState('')
    const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)

    // Ref'lar input'larni focus qilish uchun
    const urlInputRef = useRef<HTMLInputElement>(null)
    const titleInputRef = useRef<HTMLInputElement>(null)

    const { data: collections } = useCollectionsQuery(1, 1000)
    const { data: category } = useCategoriesQuery(1, 1000)
    const { data: resourceTypes } = useResourceTypesQuery(1, 1000)
    const { data: keywords, refetch } = useKeywordsQuery(1, 1000)
    const { data: authors, refetch: authorRefetch } = useAuthorsQuery(1, 10000)
    const createAuthorMutation = useCreateAuthorMutation(refetch)

    const addAuthor = async (values: AuthorFormValues) => {
        await createAuthorMutation.mutateAsync(values)
        await authorRefetch()
        setOpenCreateModal(false)
    }
    const createMutation = useCreateKeywordMutation()
    const [isPublic, setIsPublic] = useState(false)
    const [loadedData, setLoadedData] = useState<any>(null)

    const validateUrl = (url: string): boolean => {
        const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/
        const completeUrlPattern = /^https?:\/\//

        if (!completeUrlPattern.test(url) && urlPattern.test(url)) {
            return urlPattern.test(url)
        }

        return completeUrlPattern.test(url) && urlPattern.test(url)
    }

    const formatUrl = (url: string): string => {
        const completeUrlPattern = /^https?:\/\//
        if (!completeUrlPattern.test(url) && url.trim()) {
            return `https://${url}`
        }
        return url
    }

    const handleUrlChange = (value: string) => {
        setVideoUrl(value)
        // Agar foydalanuvchi yozishni boshlasa, ogohlantirish ko'rsatish
        if (value.trim() && !showUnsavedWarning) {
            setShowUnsavedWarning(true)
        }
        // Agar bo'sh bo'lsa, ogohlantirish yashirish
        if (!value.trim() && !videoTitle.trim()) {
            setShowUnsavedWarning(false)
        }

        if (urlError && value.trim()) {
            const formattedUrl = formatUrl(value.trim())
            if (validateUrl(formattedUrl)) {
                setUrlError('')
            }
        }
    }

    const handleTitleChange = (value: string) => {
        setVideoTitle(value)
        // Agar foydalanuvchi yozishni boshlasa, ogohlantirish ko'rsatish
        if (value.trim() && !showUnsavedWarning) {
            setShowUnsavedWarning(true)
        }
        // Agar bo'sh bo'lsa, ogohlantirish yashirish
        if (!value.trim() && !videoUrl.trim()) {
            setShowUnsavedWarning(false)
        }
    }

    const handleAddOrUpdateVideo = (editingIndex: number | null) => {
        if (!videoUrl.trim() || !videoTitle.trim()) {
            setUrlError('URL va sarlavha majburiy')
            return
        }

        const formattedUrl = formatUrl(videoUrl.trim())

        if (!validateUrl(formattedUrl)) {
            setUrlError('Yaroqli URL kiriting (masalan: https://example.com)')
            return
        }

        setUrlError('')
        setShowUnsavedWarning(false) // Muvaffaqiyatli qo'shilganda ogohlantirish yashirish

        const newVideoEntry = { url: formattedUrl, title: videoTitle.trim() }
        const currentVideos = form.getValues('youtubeVideos') || []

        const updatedVideos =
            editingIndex !== null
                ? currentVideos.map((entry: any, idx: number) =>
                    idx === editingIndex ? newVideoEntry : entry
                )
                : [...currentVideos, newVideoEntry]

        form.setValue('youtubeVideos', updatedVideos)
        setVideoUrl('')
        setVideoTitle('')
    }

    const handleRemoveVideo = (index: number) => {
        const currentVideos = form.getValues('youtubeVideos') || []
        form.setValue(
            'youtubeVideos',
            currentVideos.filter((_:any, i:number) => i !== index)
        )
    }

    // Unsaved ma'lumotlarni tekshirish va focus qilish
    const checkUnsavedUrlData = () => {
        const hasUnsavedData = videoUrl.trim() || videoTitle.trim()

        if (hasUnsavedData) {
            // Input'larni qizil rangga o'tkazish va focus qilish
            setUrlError('Qo\'shilmagan ma\'lumotlar mavjud! Avval "Qo\'shish" tugmasini bosing yoki ma\'lumotlarni o\'chiring.')

            // Birinchi bo'sh input'ga focus qilish
            if (!videoUrl.trim() && urlInputRef.current) {
                urlInputRef.current.focus()
            } else if (!videoTitle.trim() && titleInputRef.current) {
                titleInputRef.current.focus()
            } else if (urlInputRef.current) {
                urlInputRef.current.focus()
            }

            return true
        }

        return false
    }

    useEffect(() => {
        const fetchInitialData = async () => {
            if (initialData?.id) {
                try {
                    const data = await resourceService.getResource(initialData.id)
                    setLoadedData(data)
                } catch (err) {
                    console.error('Resursni yuklashda xatolik:', err)
                }
            }
        }

        fetchInitialData()
    }, [initialData?.id])

    useEffect(() => {
        if (!loadedData || !collections?.data || !resourceTypes?.data || !keywords?.data) return

        const collectionId = loadedData.collection?.id || ''
        const categoryId = loadedData.category?.id || loadedData.subject?.id || ''
        const resourceTypeId = loadedData.resourceType?.id || ''
        const keywordIds =
            loadedData.keywords
                ?.map((k: any) => keywords.data?.find((kw) => kw.value === k.value)?.id)
                .filter(Boolean) || []
        const documentIds = loadedData.documents?.map((d: any) => d.id).filter(Boolean) || []
        const authorIds = loadedData.authors?.map((a: any) => a.id).filter(Boolean) || []

        const normalized = {
            isPublic: loadedData.isPublic || false,
            title: loadedData.title,
            description: loadedData.description,
            doi: loadedData.doi || '',
            license: loadedData.license || 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
            language: loadedData.language || '',
            collectionId,
            categoryId,
            resourceTypeId,
            keywords: keywordIds,
            documents: documentIds,
            authors: authorIds,
            youtubeVideos: loadedData.youtubeVideos || [],
        }

        setTimeout(() => {
            form.reset(normalized)
            setIsPublic(loadedData.isPublic || false)
        }, 0)
    }, [loadedData, collections, resourceTypes, keywords, form])

    // Submit funksiyasini o'zgartirish
    const handleSubmit = () => {
        // Avval unsaved URL ma'lumotlarini tekshirish
        if (checkUnsavedUrlData()) {
            return // Agar unsaved ma'lumotlar bo'lsa, submit'ni to'xtatish
        }

        // Agar hammasi yaxshi bo'lsa, submit qilish
        //@ts-ignore
        form.handleSubmit(onSubmitFunction)()
    }

    const onCancel = () => {
        form.reset()
        setIsPublic(false)
        setVideoUrl('')
        setVideoTitle('')
        setShowUnsavedWarning(false)
        setUrlError('')
    }

    const youtubeVideos = form.watch('youtubeVideos') || []

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                }}
                className="flex items-start max-md:flex-col-reverse gap-5 space-y-6"
            >
                <div className="w-full space-y-6">
                    <Tabs defaultValue="account" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="account">Fayl yuklash</TabsTrigger>
                            <TabsTrigger value="youtubeVideos">Url yuklash</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <FileUpload
                                label={`Material faylini yuklash`}
                                variant="multiple"
                                accept="*"
                                initialFiles={
                                    loadedData?.documents?.map((doc: any) => ({
                                        id: doc.id,
                                        name: doc.filename,
                                        mimetype: doc.mimetype || 'application/octet-stream',
                                        size: doc.size,
                                        url: doc.url,
                                    })) || []
                                }
                                onChange={(newDocumentIds) => {
                                    form.setValue('documents', newDocumentIds)
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="youtubeVideos">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Havola Qo'shish</CardTitle>
                                    <CardDescription className="my-1">
                                        Quyida Havola va sarlavhalar bilan qo'shing.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <Input
                                                ref={urlInputRef}
                                                value={videoUrl}
                                                placeholder="https://example.com yoki www.example.com"
                                                onChange={(e) => handleUrlChange(e.target.value)}
                                                className={`flex-1 ${urlError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            />
                                        </div>
                                        <Input
                                            ref={titleInputRef}
                                            value={videoTitle}
                                            placeholder="Havola sarlavhasini kiriting"
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            className={`flex-1 ${urlError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        />

                                        <Button
                                            type="button"
                                            onClick={() => handleAddOrUpdateVideo(null)}
                                        >
                                            Qo'shish
                                        </Button>
                                    </div>

                                    {/* Saqlash ogohlantirishi */}
                                    {showUnsavedWarning && !urlError && (
                                        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
                                            <AlertCircle className="h-4 w-4 text-amber-600" />
                                            <p className="text-sm text-amber-700">
                                                Ma'lumotlar kiritildi. "Qo'shish" tugmasini bosing yoki formani to'ldiring.
                                            </p>
                                        </div>
                                    )}

                                    {urlError && (
                                        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            <p className="text-sm text-red-600">{urlError}</p>
                                        </div>
                                    )}

                                    <div className="mt-4 space-y-3">
                                        {youtubeVideos.length > 0 ? (
                                            youtubeVideos.map((item:any, index:number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between gap-4 rounded-md border p-2"
                                                >
                                                    <div>
                                                        <p className="font-medium">{item.title}</p>
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 underline"
                                                        >
                                                            {item.url}
                                                        </a>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setVideoUrl(item.url)
                                                                setVideoTitle(item.title)
                                                                setShowUnsavedWarning(false)
                                                                setUrlError('')
                                                            }}
                                                        >
                                                            Tahrirlash
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleRemoveVideo(index)}
                                                        >
                                                            O'chirish
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Hozircha hech qanday Havola qo'shilmagan.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    <FormField
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Sarlavha<span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Quantum Computing" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {[
                        { name: 'description', label: 'Tavsif', type: 'textarea', required: true },
                        { name: 'doi', label: 'DOI', type: 'input', required: false },
                        {
                            name: 'license',
                            label: 'Litsenziya - CC Attribution-NonCommercial-NoDerivatives (CC BY-NC-ND)',
                            type: 'input',
                            required: true,
                        },
                    ].map(({ name, label, type, required }) => (
                        <FormField
                            key={name}
                            name={name as keyof ResourceFormValues}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {label}
                                        {required && <span className="text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        {name === 'license' ? (
                                            <Input
                                                {...field}
                                                value="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                                                disabled
                                                className="cursor-not-allowed bg-gray-200 text-gray-600"
                                            />
                                        ) : type === 'input' ? (
                                            <Input {...field} />
                                        ) : (
                                            <Textarea {...field} />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <FormField
                        name="authors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Muallifni tanlang</FormLabel>
                                <FormControl>
                                    <UniversalDropdown
                                        options={authors?.data || []}
                                        value={field.value}
                                        onChange={field.onChange}
                                        labelKey="fullname"
                                        valueKey="id"
                                        placeholder="Mualliflarni tanlang..."
                                        searchPlaceholder="Mualliflarni qidiring..."
                                        noDataText="Muallif topilmadi"
                                        selectedText="Tanlangan"
                                        showAddButton={true}
                                        addButtonText="+ Yangi muallif"
                                        addModalTitle="Yangi muallif qo'shish"
                                        AddFormComponent={AuthorForm}
                                        onAdd={addAuthor}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="collectionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Bo'lim <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <UniversalSingleDropdown
                                        options={collections?.data || []}
                                        value={field.value}
                                        onChange={field.onChange}
                                        labelKey="title"
                                        valueKey="id"
                                        placeholder="Bo'limni tanlang..."
                                        searchPlaceholder="Bo'limlarni qidiring..."
                                        noDataText="Bo'lim topilmadi"
                                        showAddButton={false}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Yo'nalishlar <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <UniversalSingleDropdown
                                        options={category?.data || []}
                                        value={field.value}
                                        onChange={field.onChange}
                                        labelKey="name"
                                        valueKey="id"
                                        placeholder="Yo'nalishni tanlang..."
                                        searchPlaceholder="Yo'nalishlarni qidiring..."
                                        noDataText="Yo'nalish topilmadi"
                                        showAddButton={false}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {[
                        {
                            name: 'language',
                            label: 'Til',
                            options: [
                                { language: "O'zbekcha", value: 'uzbek' },
                                { language: 'Inglizcha', value: 'english' },
                            ],
                            valueKey: 'value',
                            labelKey: 'language',
                       },
                        {
                            name: 'resourceTypeId',
                            label: 'Resurs turi',
                            options: resourceTypes?.data,
                            valueKey: 'id',
                            labelKey: 'name',
                        },
                    ].map(({ name, label, options, valueKey, labelKey }) => (
                        <FormField
                            key={name}
                            name={name as keyof ResourceFormValues}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {label} <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={`${label} tanlang`} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {options?.map((opt: any) => (
                                                <SelectItem key={opt[valueKey]} value={opt[valueKey]}>
                                                    {opt[labelKey]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <FormField
                        name="keywords"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kalit so'zlar</FormLabel>
                                <FormControl>
                                    <AntdMultiSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={
                                            keywords?.data?.map((k) => ({
                                                label: k.value,
                                                value: k.id,
                                            })) || []
                                        }
                                        onCreate={async (input) => {
                                            const created = await createMutation.mutateAsync({ value: input })
                                            await refetch()

                                            return {
                                                label: created.value,
                                                value: created.id,
                                            }
                                        }}
                                        mode="multiple"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Sidebar */}
                <div className="mx-auto w-1/2 max-md:w-full space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-muted-foreground flex items-center justify-center gap-2 text-sm font-medium">
                                Qoralama
                                <Info className="h-4 w-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700">
                                Nashr qilish
                            </Button>
                            <Button
                                type="button"
                                onClick={onCancel}
                                className="w-full bg-red-600 text-white hover:bg-red-700"
                            >
                                Bekor qilish
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Info className="h-4 w-4" />
                                Ko'rinish
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-muted-foreground text-sm">Faqat fayllar</div>
                            <div className="flex w-full overflow-hidden rounded-md border border-gray-300">
                                <div
                                    className={`flex-1 transition-all duration-300 ${
                                        isPublic
                                            ? 'flex-[1.5] bg-green-600 text-white'
                                            : 'bg-muted text-muted-foreground flex-1'
                                    } cursor-pointer py-2 text-center text-sm font-medium`}
                                    onClick={() => {
                                        form.setValue('isPublic', true)
                                        setIsPublic(true)
                                    }}
                                >
                                    Ommaviy
                                </div>
                                <div
                                    className={`flex-1 transition-all duration-300 ${
                                        isPublic
                                            ? 'bg-muted text-muted-foreground flex-1'
                                            : 'flex-[1.5] bg-red-600 text-white'
                                    } cursor-pointer py-2 text-center text-sm font-medium`}
                                    onClick={() => {
                                        form.setValue('isPublic', false)
                                        setIsPublic(false)
                                    }}
                                >
                                    Cheklangan
                                </div>
                            </div>
                            {isPublic ? (
                                <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-3">
                                    <Globe className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                    <div>
                                        <div className="text-sm font-medium text-green-800">Ommaviy</div>
                                        <div className="mt-1 text-xs text-green-700">Yozuv va fayllar ommaga ochiq</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3">
                                    <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                                    <div>
                                        <div className="text-sm font-medium text-red-800">Cheklangan</div>
                                        <div className="mt-1 text-xs text-red-700">
                                            Yozuv va fayllar faqatgina cheklangan ko'rinishda.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </form>

            <DialogModal
                title="Yangi muallif"
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            >
                <AuthorForm onSubmitFunction={addAuthor} />
            </DialogModal>
        </Form>
    )
}