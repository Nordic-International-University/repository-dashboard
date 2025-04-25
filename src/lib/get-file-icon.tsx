import {
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileArchive,
  FileIcon,
  FileSpreadsheet,
  FileJson,
  FileCode2,
  FileType2,
  FileSliders,
} from 'lucide-react'
import { FileWordFilled } from '@ant-design/icons'

export const getFileIcon = (filenameOrMime: string) => {
  const type = filenameOrMime.toLowerCase()

  // 🖼 Rasm fayllar
  if (type.includes('image/svg') || type.endsWith('.svg')) {
    return <FileType2 className="h-4 w-4 text-pink-500" />
  }
  if (
    type.endsWith('.png') ||
    type.endsWith('.jpg') ||
    type.endsWith('.jpeg') ||
    type.endsWith('.webp') ||
    type.endsWith('.gif')
  ) {
    return <FileImage className="h-4 w-4 text-blue-500" />
  }

  // 🎬 Video fayllar
  if (type.includes('video/') || /\.(mp4|avi|mov|webm|mkv)$/.test(type)) {
    return <FileVideo className="h-4 w-4 text-purple-500" />
  }

  // 🎧 Audio fayllar
  if (type.includes('audio/') || /\.(mp3|wav|ogg|flac)$/.test(type)) {
    return <FileAudio className="h-4 w-4 text-green-500" />
  }

  // 📝 Matn fayllar
  if (type.endsWith('.txt') || type.includes('text/plain')) {
    return <FileText className="h-4 w-4 text-gray-500" />
  }

  // 📄 Word fayllar
  if (type.includes('word') || /\.(doc|docx)$/.test(type)) {
    return <FileWordFilled className="h-4 w-4 text-blue-700" />
  }

  // 📊 Excel fayllar
  if (type.includes('excel') || /\.(xls|xlsx)$/.test(type)) {
    return <FileSpreadsheet className="h-4 w-4 text-green-600" />
  }

  // 📑 CSV fayllar
  if (type.endsWith('.csv')) {
    return <FileSpreadsheet className="h-4 w-4 text-lime-500" />
  }

  // 📈 PowerPoint fayllar
  if (type.includes('presentation') || /\.(ppt|pptx)$/.test(type)) {
    return <FileSliders className="h-4 w-4 text-orange-600" />
  }

  // 📚 PDF
  if (type.includes('pdf') || type.endsWith('.pdf')) {
    return <FileText className="h-4 w-4 text-red-600" />
  }

  // 📦 Arxiv fayllar
  if (
    type.endsWith('.zip') ||
    type.endsWith('.rar') ||
    type.endsWith('.7z') ||
    type.endsWith('.tar') ||
    type.includes('compressed')
  ) {
    return <FileArchive className="h-4 w-4 text-yellow-500" />
  }

  // 🛠 Kod fayllar
  if (
    type.endsWith('.js') ||
    type.endsWith('.ts') ||
    type.endsWith('.jsx') ||
    type.endsWith('.tsx')
  ) {
    return <FileCode2 className="h-4 w-4 text-yellow-600" />
  }

  // 🌐 Web fayllar
  if (type.endsWith('.html') || type.endsWith('.htm') || type.endsWith('.xml')) {
    return <FileCode2 className="h-4 w-4 text-rose-500" />
  }

  // 🧾 JSON
  if (type.includes('json') || type.endsWith('.json')) {
    return <FileJson className="h-4 w-4 text-orange-500" />
  }

  // ❌ Noaniq yoki default
  return <FileIcon className="text-muted-foreground h-4 w-4" />
}
