'use client'

import React, { useEffect, useState } from 'react'
import { Upload, Tooltip, List, Typography } from 'antd'
import { UploadOutlined, DeleteOutlined, FileOutlined, InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { toast } from 'sonner'
import { axiosInstance } from '@/services/base.axios'

const { Dragger } = Upload

interface FileMeta {
  id: string
  name: string
  mimetype: string
  size: number
  url: string
}

interface FileUploadProps {
  label?: string
  onChange: (ids: string[]) => void
  accept?: string
  className?: string
  variant?: 'single' | 'multiple'
  initialFiles?: FileMeta[]
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const FileUploadAntd: React.FC<FileUploadProps> = ({
  label = 'Fayl yuklash',
  onChange,
  accept = '*',
  className,
  variant = 'single',
  initialFiles = [],
}) => {
  const [fileList, setFileList] = useState<FileMeta[]>([])

  useEffect(() => {
    if (initialFiles?.length) {
      setFileList(initialFiles)
      onChange(initialFiles.map((f) => f.id))
    }
  }, [initialFiles])

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axiosInstance.post('/document/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const uploaded = res.data?.document
      if (uploaded) {
        const meta: FileMeta = {
          id: uploaded.id,
          name: uploaded.filename,
          mimetype: uploaded.mimetype,
          size: uploaded.size,
          url: uploaded.url,
        }

        const updated = variant === 'single' ? [meta] : [...fileList, meta]
        setFileList(updated)
        onChange(updated.map((f) => f.id))
        onSuccess('ok')

        toast('✅ Fayl yuklandi!', {
          description: <div className="text-green-600">{uploaded.filename}</div>,
        })
      } else {
        throw new Error('Server noto‘g‘ri javob qaytardi')
      }
    } catch (err: any) {
      onError(err)
      toast('❌ Yuklashda xatolik', {
        description: err?.message || 'Nomaʼlum xatolik yuz berdi',
      })
    }
  }

  const handleRemove = (id: string) => {
    const updated = fileList.filter((f) => f.id !== id)
    setFileList(updated)
    onChange(updated.map((f) => f.id))
  }

  const uploadProps: UploadProps = {
    customRequest,
    showUploadList: false,
    multiple: variant === 'multiple',
    accept,
    beforeUpload: (file) => {
      const isAccepted =
        accept === '*' ||
        accept.split(',').some((type) => {
          if (type.endsWith('/*')) return file.type.startsWith(type.split('/')[0])
          return file.type === type
        })
      if (!isAccepted) {
        toast('❌ Fayl formati noto‘g‘ri', {
          description: `Ruxsat etilgan: ${accept}`,
        })
      }
      return isAccepted
    },
  }

  return (
    <div className={className}>
      {label && (
        <div className="mb-2 font-medium">
          {label}
          <span className="text-red-500">*</span>
        </div>
      )}

      <Dragger {...uploadProps} className="w-full">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="text-base font-medium">Faylni bu yerga torting yoki bosing</p>
        <p className="text-sm text-gray-500">Ruxsat etilgan formatlar: {accept}</p>
      </Dragger>

      {fileList.length > 0 && (
        <List
          className="mt-3"
          dataSource={fileList}
          size="small"
          renderItem={(file) => (
            <List.Item
              actions={[
                <Tooltip title="Faylni ochish" key="open">
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <FileOutlined />
                  </a>
                </Tooltip>,
                <Tooltip title="O'chirish" key="delete">
                  <button
                    onClick={() => handleRemove(file.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <DeleteOutlined />
                  </button>
                </Tooltip>,
              ]}
            >
              <Typography.Text className="truncate">{file.name.slice(0, 20)}</Typography.Text>
              <span className="ml-2 text-xs text-gray-500">
                {file.size ? formatBytes(file.size) : ''}
              </span>
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

export default FileUploadAntd
