'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit,
  Eye,
  Globe,
  Lock,
  LockIcon,
  Trash,
  Unlock,
  User,
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

  const updateStatusMutation = useMutation({
    //@ts-ignore
    mutationFn: (status: ResourceStatus) => resourceService.updateResource(id!, { status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['resource', id])
      toast(`Holat Muvaffaqiyatli o'zgartirildi!`)
    },
    onError: () => {
      toast('Resurs holatini yangilashda xatolik yuz berdi')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => resourceService.deleteResource(id!),
    onSuccess: () => {
      toast("Resurs o'chirildi")
      router.push('/admin/resources')
    },
    onError: () => {
      toast("Resursni o'chirishda xatolik yuz berdi")
    },
  })

  const handleStatusChange = (status: ResourceStatus) => {
    updateStatusMutation.mutate(status)
  }

  const handleDelete = () => {
    deleteMutation.mutate()
    setIsDeleteDialogOpen(false)
    router.push('/materials/all-materials?tab=resources')
  }


  const updateIsPublicMutation = useMutation({
    mutationFn: (isPublic: boolean) => resourceService.updateResource(id!, { isPublic }),
    onSuccess: () => {
      queryClient.invalidateQueries(['resource', id])
      toast.success('Ko‘rinish holati muvaffaqiyatli yangilandi')
    },
    onError: () => {
      toast.error('Ko‘rinish holatini yangilashda xatolik yuz berdi')
    },
  })

  useEffect(() => {
    console.log('Kelgan status:', resourceData?.status)
    if (resourceData && resourceData.status && resourceData.status !== status) {
      setStatus(resourceData.status)
    }
  }, [resourceData])

  useEffect(() => {
    console.log('Kelgan status:', resourceData?.status)
    if (resourceData && resourceData.status && resourceData.status !== status) {
      setStatus(resourceData.status)
    }
    if (resourceData) {
      setIsPublic(resourceData.isPublic)
    }
  }, [resourceData])

  if (isLoading) return <p>Yuklanmoqda...</p>
  if (isError || !resourceData) return <p>Xatolik yuz berdi yoki ma'lumot topilmadi</p>

  return (
    <div className="pb-6">
      <PageBreadcrumb pageTitle="Material" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{resourceData.title}</CardTitle>
                  <CardDescription className="mt-1">ID: {resourceData.id}</CardDescription>
                </div>

                {(() => {
                  const badge = getStatusBadge(resourceData.status)
                  return (
                    <Badge className={`inline-flex items-center ${badge.color}`}>
                      {badge.icon}
                      {badge.label}
                    </Badge>
                  )
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Tafsilotlar</TabsTrigger>
                  <TabsTrigger value="metadata">Metama'lumotlar</TabsTrigger>
                  <TabsTrigger value="authors">Mualliflar</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">Tavsif</h3>
                    <p>{resourceData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                        Resurs turi
                      </h3>
                      <p>{resourceData.resourceType.name}</p>
                    </div>
                    <div>
                      <h3 className="text-muted-foreground mb-1 text-sm font-medium">To'plam</h3>
                      <p>{resourceData.collection.title}</p>
                    </div>
                    <div>
                      <h3 className="text-muted-foreground mb-1 text-sm font-medium">Fan</h3>
                      <p>{resourceData.subject.name}</p>
                    </div>
                    <div>
                      <h3 className="text-muted-foreground mb-1 text-sm font-medium">Ko‘rinish</h3>
                      <div className="flex items-center gap-3">
                        {isPublic ? (
                          <Unlock className="h-5 w-5 text-green-600" />
                        ) : (
                          <Lock className="h-5 w-5 text-red-600" />
                        )}
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
                            ? 'Hujjat ochiq (foydalanuvchilarga ko‘rinadi)'
                            : 'Hujjat yashirin (faqat admin uchun)'}
                        </span>
                      </div>
                      {isPublic && (
                        <Link
                          href={`https://repository.nordicuniversity.org/document/${resourceData.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-sm text-blue-600 hover:underline"
                        >
                          Hujjatni ko‘rish
                        </Link>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-muted-foreground mb-1 text-sm font-medium">Til</h3>
                      <div className="flex items-center">
                        <Globe className="text-muted-foreground mr-2 h-4 w-4" />
                        <p>{resourceData.language}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-muted-foreground mb-1 text-sm font-medium">DOI</h3>
                      <p>{resourceData.doi}</p>
                    </div>
                    <div>
                      <h3 className="text-muted-foreground mb-1 text-sm font-medium">Litsenziya</h3>
                      <p>{resourceData.license}</p>
                    </div>
                    <div>
                      <h3 className="text-muted-foreground mb-1 text-sm font-medium">Slug</h3>
                      <p className="truncate">{resourceData.slug}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                      Kalit so'zlar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resourceData.keywords.length > 0 ? (
                        resourceData.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline">
                            {keyword.value}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">Kalit so'zlar yo'q</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="authors" className="space-y-4">
                  {resourceData.authors.map((author, index) => (
                    <div key={index} className="flex items-center rounded-md border p-3">
                      <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                        <User className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{author.fullname}</p>
                        <p className="text-muted-foreground text-sm">@{author.username}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Amallar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                  Holat o'zgartirish
                </h3>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value as ResourceStatus)
                    handleStatusChange(value as ResourceStatus)
                  }}
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
                    <DialogTitle>Haqiqatan ham bu resursni o'chirmoqchimisiz?</DialogTitle>
                    <DialogDescription>Bu amalni qaytarib bo'lmaydi.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Bekor qilish
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      O'chirish
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ma'lumot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-muted-foreground mb-1 text-sm font-medium">Nashriyot</h3>
                <p>{resourceData.publisher}</p>
              </div>
              <div>
                <h3 className="text-muted-foreground mb-1 text-sm font-medium">Nashr sanasi</h3>
                <div className="flex items-center">
                  <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                  <p>{dayjs(resourceData.publishedAt).format('DD MM YYYY')}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted flex flex-col items-center rounded-md p-3">
                  <div className="mb-1 flex items-center">
                    <Download className="text-muted-foreground mr-1 h-4 w-4" />
                    <span className="text-sm font-medium">Yuklab olishlar</span>
                  </div>
                  <p className="text-2xl font-bold">{resourceData.downloadCount}</p>
                </div>
                <div className="bg-muted flex flex-col items-center rounded-md p-3">
                  <div className="mb-1 flex items-center">
                    <Eye className="text-muted-foreground mr-1 h-4 w-4" />
                    <span className="text-sm font-medium">Ko'rishlar</span>
                  </div>
                  <p className="text-2xl font-bold">{resourceData.viewCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fayllar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {resourceData.documents.length > 0 ? (
                <div className="space-y-3">
                  {resourceData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-md border px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.mimetype)}
                        <div className="flex flex-col">
                          <p className="line-clamp-1 text-sm font-medium">
                            {doc.filename.split('.')[0].slice(0, 25)}.{doc.mimetype.split('/')[1]}
                          </p>
                          {/*<p className="text-muted-foreground text-xs">*/}
                          {/*  {doc.mimetype} · {formatFileSize(doc.size)}*/}
                          {/*</p>*/}
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        download
                        className="fo nt-medium text-sm text-black hover:underline dark:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-1 inline h-4 w-4" />
                        Yuklab olish
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Hujjatlar yuklanmagan.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
