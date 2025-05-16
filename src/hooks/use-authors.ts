import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authorService } from '@/services/author.service'
import { AuthorFormValues } from '../../types/author/author.types'

export const useAuthorsQuery = (pageNumber: number, pageSize: number, search?: string) =>
  useQuery(['authors', pageNumber, pageSize, search], () =>
    authorService.getAuthors(pageNumber, pageSize, search)
  )

export const useCreateAuthorMutation = (refetch: () => void) => {
  return useMutation(authorService.createAuthor, {
    onSuccess: () => {
      refetch()
    },
  })
}

export const useUpdateAuthorMutation = (refetch: () => void) => {
  return useMutation(
    ({ id, payload }: { id: string; payload: AuthorFormValues }) =>
      authorService.updateAuthor(id, payload),
    {
      onSuccess: () => {
        refetch()
      },
    }
  )
}

export const useDeleteAuthorMutation = (refetch: () => void) => {
  return useMutation(authorService.deleteAuthor, {
    onSuccess: () => {
      refetch()
    },
  })
}
