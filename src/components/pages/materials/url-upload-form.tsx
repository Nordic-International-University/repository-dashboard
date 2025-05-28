import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Youtube, Facebook, Globe } from 'lucide-react'

/** Validation schema */
const urlSchema = z.object({
  url: z.string().url('Yaroqli URL-ni kiriting.'),
  title: z.string().min(1, 'Sarlavha kiritish shart.'),
})

/** Types */
type UrlFormValues = z.infer<typeof urlSchema>

export const URLUploadForm = () => {
  const [urls, setUrls] = useState<{ url: string; title: string }[]>([]) // To store added URLs
  const [editingIndex, setEditingIndex] = useState<number | null>(null) // For updating URLs

  /** React Hook Form setup */
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
      title: '',
    },
  })

  const handleAddOrUpdate = (data: UrlFormValues) => {
    if (editingIndex !== null) {
      // Update existing URL
      const updatedUrls = [...urls]
      updatedUrls[editingIndex] = data
      setUrls(updatedUrls)
      setEditingIndex(null)
    } else {
      // Add new URL
      setUrls([...urls, data])
    }

    // Reset form inputs
    reset()
  }

  const handleEdit = (index: number) => {
    const item = urls[index]
    setValue('url', item.url)
    setValue('title', item.title)
    setEditingIndex(index)
  }

  const handleDelete = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index))
    if (editingIndex === index) {
      reset() // If editing entry is deleted, clear form
      setEditingIndex(null)
    }
  }

  /** Determine Icon Based on URL Type */
  const getUrlIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be'))
      return <Youtube className="text-red-500" />
    if (url.includes('facebook.com')) return <Facebook className="text-blue-500" />
    return <Globe className="text-gray-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>URL Qo'shish</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleAddOrUpdate)} className="space-y-4">
          {/* URL Input */}
          <div className="flex items-center gap-2">
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <div className="relative flex-1">
                  <Input
                    {...field}
                    placeholder="URL'ni kiriting"
                    className={errors.url ? 'border-red-600' : ''}
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    {field.value && getUrlIcon(field.value)}
                  </span>
                  {errors.url && <p className="mt-1 text-xs text-red-600">{errors.url.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Title Input */}
          <div>
            <Label htmlFor="title" className="sr-only">
              Sarlavha
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    placeholder="Sarlavha kiriting"
                    className={errors.title ? 'border-red-600' : ''}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Add/Save Button */}
          <Button type="submit">{editingIndex !== null ? 'Yangilash' : "Qo'shish"}</Button>
        </form>

        {/* URL List */}
        <div className="mt-4 space-y-2">
          {urls.length > 0 ? (
            urls.map((item, index) => (
              <div key={index} className="flex items-center gap-4 rounded-md border p-2">
                <div className="flex flex-grow items-center">
                  {getUrlIcon(item.url)}
                  <div className="ml-2">
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
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                    Tahrirlash
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                    O'chirish
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Barcha URL'larni bu yerda ko'rasiz.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
