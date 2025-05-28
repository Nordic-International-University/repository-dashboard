'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useParams, useRouter } from 'next/navigation'
import {Link} from 'lucide-react'
import {
  Calendar,
  Download,
  Eye,
  Globe,
  Lock,
  Trash,
  Unlock,
  User,
  Youtube,
  ExternalLink,
  Tag,
  Building,
  GraduationCap,
  Users,
  FileText,
  Play
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { resourceService } from '@/services/materials.service'
import dayjs from 'dayjs'
import { getFileIcon } from '@/lib/get-file-icon'
import { toast } from 'sonner'
import { getStatusBadge } from '@/lib/getStatusIcons'
import { Switch } from '@/components/ui/switch'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'

type ResourceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION' | 'DELETED' | 'ARCHIVED'

const statusTranslations = {
  PENDING: 'Kutilmoqda',
  APPROVED: 'Tasdiqlangan',
  REJECTED: 'Rad etilgan',
  REVISION: "Qayta ko'rib chiqish",
  DELETED: "O'chirilgan",
  ARCHIVED: 'Arxivlangan',
}

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [status, setStatus] = useState<ResourceStatus>('PENDING')

  const {
    data: resourceData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceService.getResource(id!),
    enabled: !!id,
  })

  console.log(resourceData)
  const updateStatusMutation = useMutation({
    //@ts-ignore
    mutationFn: (status: ResourceStatus) => resourceService.updateResource(id!, { status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['resource', id])
      toast.success(`Holat muvaffaqiyatli o'zgartirildi!`)
    },
    onError: () => {
      toast.error('Resurs holatini yangilashda xatolik yuz berdi')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => resourceService.deleteResource(id!),
    onSuccess: () => {
      toast.success("Resurs muvaffaqiyatli o'chirildi")
      router.push('/admin/resources')
    },
    onError: () => {
      toast.error("Resursni o'chirishda xatolik yuz berdi")
    },
  })

  const updateIsPublicMutation = useMutation({
    mutationFn: (isPublic: boolean) => resourceService.updateResource(id!, { isPublic }),
    onSuccess: () => {
      queryClient.invalidateQueries(['resource', id])
      toast.success(`Ko'rinish holati muvaffaqiyatli yangilandi`)
    },
    onError: () => {
      toast.error(`Ko'rinish holatini yangilashda xatolik yuz berdi`)
    },
  })

  const handleStatusChange = (status: ResourceStatus) => {
    updateStatusMutation.mutate(status)
  }

  const handleDelete = () => {
    deleteMutation.mutate()
    setIsDeleteDialogOpen(false)
  }

  useEffect(() => {
    if (resourceData) {
      if (resourceData.status && resourceData.status !== status) {
        setStatus(resourceData.status)
      }
      setIsPublic(resourceData.isPublic)
    }
  }, [resourceData])

  if (isLoading) {
    return (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-muted-foreground">Yuklanmoqda...</p>
          </div>
        </div>
    )
  }

  if (isError || !resourceData) {
    return (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-destructive">Xatolik yuz berdi yoki ma'lumot topilmadi</p>
            <Button variant="outline" onClick={() => router.back()} className="mt-4">
              Orqaga qaytish
            </Button>
          </div>
        </div>
    )
  }

  return (
      <div className="pb-6">
        <PageBreadcrumb pageTitle="Material tafsilotlari" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold leading-tight">{resourceData.title}</CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      ID: {resourceData.id}
                    </CardDescription>
                  </div>

                  {(() => {
                    const badge = getStatusBadge(resourceData.status)
                    return (
                        <Badge className={`inline-flex items-center gap-1 ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </Badge>
                    )
                  })()}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-6 grid w-full grid-cols-4">
                    <TabsTrigger value="details">Tafsilotlar</TabsTrigger>
                    <TabsTrigger value="metadata">Metama'lumotlar</TabsTrigger>
                    <TabsTrigger value="authors">Mualliflar</TabsTrigger>
                    <TabsTrigger value="url">Havolalar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6">
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <FileText className="h-4 w-4" />
                        Tavsif
                      </h3>
                      <p className="leading-relaxed">{resourceData.description}</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                          <Tag className="h-4 w-4" />
                          Resurs turi
                        </h3>
                        <Badge variant="secondary" className="text-sm">
                          {resourceData.resourceType.name}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                          <Building className="h-4 w-4" />
                          To'plam
                        </h3>
                        <Badge variant="secondary" className="text-sm">
                          {resourceData.collection.title}
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        {isPublic ? (
                            <Unlock className="h-4 w-4 text-green-600" />
                        ) : (
                            <Lock className="h-4 w-4 text-red-600" />
                        )}
                        Ko'rinish holati
                      </h3>
                      <div className="flex items-center gap-4">
                        <Switch
                            checked={isPublic}
                            onCheckedChange={(checked) => {
                              setIsPublic(checked)
                              updateIsPublicMutation.mutate(checked)
                            }}
                            className={
                              isPublic
                                  ? 'bg-green-500 data-[state=checked]:bg-green-500'
                                  : 'bg-red-500 data-[state=unchecked]:bg-red-500'
                            }
                        />
                        <span className="text-sm">
                        {isPublic
                            ? `Hujjat ochiq (foydalanuvchilarga ko'rinadi)`
                          : 'Hujjat yashirin (faqat admin uchun)'}
                      </span>
                      </div>
                      {isPublic && (
                          <a
                              href={`https://repository.nordicuniversity.org/document/${resourceData.id}`}
                              target="_blank"
                              className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Hujjatni ko'rish
                          </a>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          Til
                        </h3>
                        <p className="font-medium">{resourceData.language}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">DOI</h3>
                        <p className="break-all font-mono text-sm">{resourceData.doi || 'Belgilanmagan'}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">Litsenziya</h3>
                        <p className="text-sm">{resourceData.license || 'Belgilanmagan'}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        Kalit so'zlar
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {resourceData.keywords.length > 0 ? (
                            resourceData.keywords.map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword.value}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Kalit so'zlar kiritilmagan</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="authors" className="space-y-4">
                    <div className="space-y-4">
                      {resourceData.authors.map((author, index) => (
                          <Card key={index} className="transition-shadow hover:shadow-md">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                  <User className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div>
                                    <p className="font-semibold">{author.fullname}</p>
                                    <p className="text-sm text-muted-foreground">{author.username}</p>
                                  </div>
                                  <div className="grid gap-2 md:grid-cols-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                      <span>{author.degree}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Building className="h-4 w-4 text-muted-foreground" />
                                      <span>{author.institution}</span>
                                    </div>
                                  </div>
                                  {/*<p className="text-sm text-muted-foreground">{author.department}</p>*/}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    {resourceData.youtubeVideos && resourceData.youtubeVideos.length > 0 ? (
                        <div className="grid gap-4">
                          {resourceData.youtubeVideos.map((video:any, index:number) => (
                              <Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
                                <CardContent className="px-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                      <Link className="h-6 w-6 text-red-600"/>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium">{video.title}</h4>
                                      <p className="text-sm text-muted-foreground truncate">{video.url}</p>
                                    </div>
                                    <Button size="sm" asChild>
                                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                                        <Eye className="h-4 w-4 mr-1" />
                                        Ko'rish
                                      </a>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                          ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                          <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">Hech qanday video qo'shilmagan</p>
                        </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Amallar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    Holat o'zgartirish
                  </h3>
                  <Select
                      value={status}
                      onValueChange={(value) => {
                        setStatus(value as ResourceStatus)
                        handleStatusChange(value as ResourceStatus)
                      }}
                      disabled={updateStatusMutation.isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Holatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Kutilmoqda</SelectItem>
                      <SelectItem value="APPROVED">Tasdiqlangan</SelectItem>
                      <SelectItem value="REJECTED">Rad etilgan</SelectItem>
                      <SelectItem value="REVISION">Qayta ko'rib chiqish</SelectItem>
                      <SelectItem value="ARCHIVED">Arxivlangan</SelectItem>
                      <SelectItem value="DELETED">O'chirilgan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash className="mr-2 h-4 w-4" />
                      Resursni o'chirish
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Resursni o'chirish</DialogTitle>
                      <DialogDescription>
                        Haqiqatan ham bu resursni o'chirmoqchimisiz? Bu amal qaytarilmaydi.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          disabled={deleteMutation.isLoading}
                      >
                        Bekor qilish
                      </Button>
                      <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={deleteMutation.isLoading}
                      >
                        {deleteMutation.isLoading ? 'O\'chirilmoqda...' : 'O\'chirish'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5" />
                  Ma'lumot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Nashriyot</h3>
                  <p className="font-medium">{resourceData.publisher}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Nashr sanasi</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{dayjs(resourceData.publishedAt).format('DD.MM.YYYY')}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="mb-2 flex items-center justify-center gap-1">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Yuklab olishlar</span>
                    </div>
                    <p className="text-xl font-bold text-primary">{resourceData.downloadCount}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="mb-2 flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Ko'rishlar</span>
                    </div>
                    <p className="text-xl font-bold text-primary">{resourceData.viewCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Fayllar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resourceData.documents.length > 0 ? (
                    <div className="space-y-3">
                      {resourceData.documents.map((doc) => (
                          <div
                              key={doc.id}
                              className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.mimetype)}
                              <div className="flex flex-col">
                                <p className="line-clamp-1 text-sm font-medium">
                                  {doc.filename.split('.')[0].slice(0, 25)}.{doc.mimetype.split('/')[1]}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {doc.mimetype}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a
                                  href={doc.url}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                <Download className="mr-1 h-3 w-3" />
                                Yuklab olish
                              </a>
                            </Button>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Hujjatlar yuklanmagan</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}