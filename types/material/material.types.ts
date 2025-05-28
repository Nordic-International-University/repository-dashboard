export interface ResourceAuthor {
  degree:string
  department:string
  fullname: string
  username: string
  id:string
  institution:string
}
export interface Resource {
  id: string
  title: string
  description: string
  resourceType: string
  slug: string
  language: string
  doi: string
  license: string
  subject: string
  collection: string
  isPublic: boolean
  authors: ResourceAuthor[]
  keywords: string[]
  downloadCount: number
  viewCount: number
  publisher: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION' | 'DELETED' | 'ARCHIVED'
  publishedAt: string
}

export interface SingleResource {
  id: string
  title: string
  description: string
  resourceType: {
    id: string
    name: string
  }
  slug: string
  language: string
  doi: string
  license: string
  subject: {
    id: string
    name: string
  }
  collection: {
    id: string
    title: string
  }
  isPublic: boolean
  authors: ResourceAuthor[]
  keywords: {
    value: string
  }[]
  downloadCount: number
  viewCount: number
  documents: any[]
  publisher: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION' | 'DELETED' | 'ARCHIVED'
  publishedAt: string
  youtubeVideos: { url: string; title: string } | any
}

export interface ResourceFormValues {
  title: string
  description: string
  resourceTypeId: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION' | 'DELETED' | 'ARCHIVED' | undefined
  doi: string
  language: string
  license: string
  categoryId: string
  collectionId: string
  publisherId: string
  documents: string[]
  isPublic: boolean
  authors: string[]
  keywords: string[]
  youtubeVideos: { url: string; title: string } | any
}

export interface PaginatedResourceResponse {
  data: Resource[]
  count: number
  pageNumber: number
  pageSize: number
  pageCount: number
}
