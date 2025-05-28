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
import React, { useEffect, useState } from 'react'

import { useCollectionsQuery } from '@/hooks/use-collections'
import { useSubjectsQuery } from '@/hooks/use-subject'
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
import { Globe, Info, Lock } from 'lucide-react'
import { AuthorForm } from '@/components/pages/author/author-form'
import { DialogModal } from '@/components/modal/custom.modal'
import { AuthorFormValues } from '../../../../types/author/author.types'
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
      license: '',
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
  const [openCreateModal, setOpenCreateModal] = useState(false)
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
  console.log(loadedData)
  useEffect(() => {
    if (!loadedData || !collections?.data || !resourceTypes?.data || !keywords?.data) return

    const collectionId = loadedData.collection?.id || ''
    const subjectId = loadedData.subject?.id || ''
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
      license: loadedData.license || '',
      language: loadedData.language || '',
      collectionId,
      subjectId,
      resourceTypeId,
      keywords: keywordIds,
      documents: documentIds,
      authors: authorIds,
    }

    setTimeout(() => {
      form.reset(normalized)
    }, 0)
  }, [loadedData, collections, resourceTypes, keywords, form])

  // @ts-ignore
  const onSubmit = form.handleSubmit(onSubmitFunction)

  const onCancel = () => {
    form.reset()
    setIsPublic(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="flex items-start gap-5 space-y-6"
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
                  <CardTitle>YouTube Videolari Qo'shish</CardTitle>
                  <CardDescription>
                    Quyida YouTube video URL'larini sarlavhalar bilan qo'shing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const [videoUrl, setVideoUrl] = useState('')
                    const [videoTitle, setVideoTitle] = useState('')

                    const youtubeVideos = form.watch('youtubeVideos') || []

                    const handleAddOrUpdateVideo = (editingIndex: number | null) => {
                      if (!videoUrl.trim() || !videoTitle.trim()) return
                      const newVideoEntry = { url: videoUrl.trim(), title: videoTitle.trim() }
                      // Add or update the video in the list
                      const updatedVideos =
                        editingIndex !== null
                          ? youtubeVideos.map((entry, idx) =>
                              idx === editingIndex ? newVideoEntry : entry
                            )
                          : [...youtubeVideos, newVideoEntry]

                      form.setValue('youtubeVideos', updatedVideos)
                      setVideoUrl('')
                      setVideoTitle('')
                    }

                    const handleRemoveVideo = (index: number) => {
                      form.setValue(
                        'youtubeVideos',
                        youtubeVideos.filter((_, i) => i !== index)
                      )
                    }

                    return (
                      <>
                        <div className="flex items-center gap-2">
                          <Input
                            value={videoUrl}
                            placeholder="YouTube URL kiriting"
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            value={videoTitle}
                            placeholder="Video sarlavhasi kiriting"
                            onChange={(e) => setVideoTitle(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={() => handleAddOrUpdateVideo(null)}>Qo'shish</Button>
                        </div>

                        <div className="mt-4 space-y-3">
                          {youtubeVideos.length > 0 ? (
                            youtubeVideos.map((item, index) => (
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
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setVideoUrl(item.url)
                                      setVideoTitle(item.title)
                                    }}
                                  >
                                    Tahrirlash
                                  </Button>
                                  <Button
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
                              Hozircha hech qaysi video qo'shilmagan.
                            </p>
                          )}
                        </div>
                      </>
                    )
                  })()}
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
          {/* Selects */}
          <FormField
            name="authors"
            render={({ field }) => {
              const [isDropdownOpen, setIsDropdownOpen] = useState(false)
              const [searchTerm, setSearchTerm] = useState('')
              const filteredAuthors = authors?.data?.filter((author) =>
                author.fullname.toLowerCase().includes(searchTerm.toLowerCase())
              )

              return (
                <FormItem>
                  <FormLabel>Muallifni tanlang</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div
                        className="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className="flex-1 text-sm text-gray-600">
                          {field.value.length > 0
                            ? `Tanlangan: ${field.value.length}`
                            : 'Mualliflarni tanlang...'}
                        </span>
                        <span className="text-gray-500">{isDropdownOpen ? '▲' : '▼'}</span>
                      </div>
                      {isDropdownOpen && (
                        <div className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                          <div className="p-2">
                            <Input
                              type="text"
                              placeholder="Qidirish..."
                              onChange={(e) => setSearchTerm(e.target.value)}
                              value={searchTerm}
                              className="w-full"
                            />
                          </div>
                          <div className="px-2 py-1">
                            {filteredAuthors?.length ? (
                              filteredAuthors.map((author) => (
                                <div key={author.id} className="flex items-center gap-2 py-1">
                                  <input
                                    type="checkbox"
                                    id={`author-${author.id}`}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={field.value.includes(author.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        field.onChange([...field.value, author.id]) // Add author
                                      } else {
                                        field.onChange(
                                          field.value.filter((id: string) => id !== author.id)
                                        ) // Remove author
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`author-${author.id}`}
                                    className="cursor-pointer text-sm"
                                  >
                                    {author.fullname}
                                  </label>
                                </div>
                              ))
                            ) : (
                              <p className="py-2 text-center text-sm text-gray-500">
                                Muallif topilmadi
                              </p>
                            )}
                          </div>
                          <div className="border-t p-2">
                            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="w-full">
                                  + Qo'shish
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle>Yangi muallif qo'shish</DialogTitle>
                                <AuthorForm onSubmitFunction={addAuthor} />
                                <DialogClose asChild>
                                  <Button variant="ghost" className="absolute top-2 right-2">
                                    Yopish
                                  </Button>
                                </DialogClose>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          {[
            {
              name: 'language',
              label: 'Til',
              options: [
                { language: "O'zbekcha", value: 'uzbek' },
                { language: 'Inglizcha', value: 'english' },
                { language: 'Mandarin Xitoy tili', value: 'mandarin_chinese' },
                { language: 'Hindcha', value: 'hindi' },
                { language: 'Ispancha', value: 'spanish' },
                { language: 'Fransuzcha', value: 'french' },
                { language: 'Standart Arabcha', value: 'standard_arabic' },
                { language: 'Bengalcha', value: 'bengali' },
                { language: 'Ruscha', value: 'russian' },
                { language: 'Portugallar tili', value: 'portuguese' },
                { language: 'Urducha', value: 'urdu' },
                { language: 'Indonezcha', value: 'indonesian' },
                { language: 'Nemischa', value: 'german' },
                { language: 'Yaponcha', value: 'japanese' },
                { language: 'Suaxilcha', value: 'swahili' },
                { language: 'Marathi tili', value: 'marathi' },
                { language: 'Telugu tili', value: 'telugu' },
                { language: 'Turkcha', value: 'turkish' },
                { language: 'Tamilcha', value: 'tamil' },
                { language: 'Vu Xitoy tili', value: 'wu_chinese' },
                { language: 'Koreyscha', value: 'korean' },
                { language: 'Vetnamcha', value: 'vietnamese' },
                { language: 'Xaousa tili', value: 'hausa' },
                { language: 'Yavancha', value: 'javanese' },
                { language: 'Italyancha', value: 'italian' },
                { language: 'Misr Arabcha', value: 'egyptian_arabic' },
                { language: 'Gujaratcha', value: 'gujarati' },
                { language: 'Taycha', value: 'thai' },
                { language: 'Kannadcha', value: 'kannada' },
                { language: 'Forscha (Farsi)', value: 'persian' },
                { language: 'Sunda tili', value: 'sunda' },
                { language: 'Polyakcha', value: 'polish' },
                { language: 'Ukraincha', value: 'ukrainian' },
                { language: 'Malayalamcha', value: 'malayalam' },
                { language: 'Odiya tili', value: 'odia' },
                { language: 'Rumyncha', value: 'romanian' },
                { language: 'Gollandcha', value: 'dutch' },
                { language: 'Ozarbayjoncha', value: 'azerbaijani' },
                { language: 'Yoruba tili', value: 'yoruba' },
                { language: 'Poshtocha', value: 'pashto' },
                { language: 'Amxarcha', value: 'amharic' },
                { language: 'Sinhala tili', value: 'sinhala' },
                { language: 'Somalcha', value: 'somali' },
                { language: 'Tagalogcha', value: 'tagalog' },
                { language: 'Shona tili', value: 'shona' },
                { language: 'Chexcha', value: 'czech' },
                { language: 'Uyğurcha', value: 'uyghur' },
                { language: 'Xakka Xitoy tili', value: 'hakka_chinese' },
                { language: 'Serb-Xorvatcha', value: 'serbo_croatian' },
                { language: 'Nepalcha', value: 'nepali' },
                { language: 'Qozoqcha', value: 'kazakh' },
                { language: 'Zuluchcha', value: 'zulu' },
                { language: 'Kichua tili', value: 'quechua' },
                { language: 'Igbocha', value: 'igbo' },
                { language: 'Slovakcha', value: 'slovak' },
                { language: 'Tigrinya tili', value: 'tigrinya' },
                { language: 'Kurdcha', value: 'kurdish' },
                { language: 'Burmacha', value: 'burmese' },
                { language: 'Malagascha', value: 'malagasy' },
                { language: 'Kxmercha', value: 'khmer' },
                { language: 'Litvacha', value: 'lithuanian' },
                { language: 'Latviyacha', value: 'latvian' },
                { language: 'Tatarcha', value: 'tatar' },
                { language: 'Bosniyacha', value: 'bosnian' },
                { language: 'Fincha', value: 'finnish' },
                { language: 'Norvegcha', value: 'norwegian' },
                { language: 'Bolgarcha', value: 'bulgarian' },
                { language: 'Moğulcha', value: 'mongolian' },
                { language: 'Laoscha', value: 'lao' },
                { language: 'Xhosa', value: 'xhosa' },
                { language: 'Makedoncha', value: 'macedonian' },
                { language: 'Beloruscha', value: 'belarusian' },
                { language: 'Estoncha', value: 'estonian' },
                { language: 'Shotland Gaelcha', value: 'gaelic_scottish' },
                { language: 'Armancha', value: 'armenian' },
                { language: 'Bashkircha', value: 'bashkir' },
                { language: 'Chuvashcha', value: 'chuvash' },
                { language: 'Lyuksemburg tili', value: 'luxembourgish' },
                { language: 'Valiycha', value: 'welsh' },
                { language: 'Irlandcha', value: 'irish' },
                { language: 'Assamcha', value: 'assamese' },
                { language: 'Tvicha', value: 'twi' },
                { language: 'Fiji tili', value: 'fijian' },
                { language: 'Gaiti Kreol tili', value: 'haitian_creole' },
                { language: 'Tok Pisin', value: 'tok_pisin' },
                { language: 'Wolofcha', value: 'wolof' },
                { language: 'Urxobo', value: 'urhobo' },
                { language: 'Maythilcha', value: 'maithili' },
                { language: 'Bhojpurcha', value: 'bhojpuri' },
                { language: 'Kikuyu tili', value: 'kikuyu' },
                { language: 'Islandcha', value: 'icelandic' },
                { language: 'Latgaliancha', value: 'latgalian' },
                { language: 'Bislama', value: 'bislama' },
                { language: 'Datcha', value: 'danish' },
                { language: 'Grenlandiya tili', value: 'greenlandic' },
                { language: 'Farersha', value: 'faroese' },
              ],
              valueKey: 'value',
              labelKey: 'language',
            },
            {
              name: 'collectionId',
              label: `Bo'lim`,
              options: collections?.data,
              valueKey: 'id',
              labelKey: 'title',
            },
            {
              name: 'categoryId',
              label: `Yo'nalishlar`,
              options: category?.data,
              valueKey: 'id',
              labelKey: 'name',
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
                <FormLabel>Kalit so‘zlar</FormLabel>
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
        <div className="mx-auto w-1/2 space-y-4">
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
                    console.log(form.getValues())
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
                    console.log(form.getValues())
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
