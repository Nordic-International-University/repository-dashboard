'use client'

import React, { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  label?: string
  onChange: (url: string) => void
  accept?: string
  className?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Rasm yuklash',
  onChange,
  accept = 'image/*',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string>('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await fetch('/file/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Fayl yuklashda xatolik yuz berdi')

      const data = await res.json()

      if (data.url) {
        setFileName(file.name)
        onChange(data.url)
        toast('✅ Fayl yuklandi!', {
          description: file.name,
        })
      } else {
        new Error('Server URL qaytarmadi')
      }
    } catch (error: any) {
      toast('✅ Fayl yuklandi!', {
        description: file.name,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`grid gap-2 ${className}`}>
      {label && <Label className="text-sm">{label}</Label>}
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={handleFileSelect}
      />
      {uploading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Yuklanmoqda...
        </div>
      ) : fileName ? (
        <div className="text-muted-foreground text-sm">📁 {fileName}</div>
      ) : null}
    </div>
  )
}

export default FileUpload
