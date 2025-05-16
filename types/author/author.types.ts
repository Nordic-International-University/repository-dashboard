export interface Author {
  id: string
  fullname: string
  institution: string
  degree: string
  department: string
  createdAt: string
}

export interface AuthorFormValues {
  fullname: string
  institution: string
  degree: string
  department: string
}
