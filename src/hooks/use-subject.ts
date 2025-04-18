import { useMutation, useQuery } from 'react-query'
import { subjectService } from '@/services/subject.service'
import { toast } from 'sonner'
import { SubjectFormValues } from '../../types/subject-types/subject.types'

// GET
export const useSubjectsQuery = (
  pageNumber: number,
  pageSize: number,
  search?: string,
  categoryId?: string
) =>
  useQuery(['subjects', pageNumber, pageSize, search, categoryId], () =>
    subjectService.getSubjects(pageNumber, pageSize, search, categoryId)
  )

// CREATE
export const useCreateSubjectMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation((data: SubjectFormValues) => subjectService.createSubject(data), {
    onSuccess: () => {
      toast.success('Fan muvaffaqiyatli qo‘shildi')
      onSuccess?.()
    },
    onError: () => toast.error('Fan qo‘shishda xatolik'),
  })

// UPDATE
export const useUpdateSubjectMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation(
    ({ id, payload }: { id: string; payload: SubjectFormValues }) =>
      subjectService.updateSubject(id, payload),
    {
      onSuccess: () => {
        toast.success('Fan yangilandi')
        onSuccess?.()
      },
      onError: () => toast.error('Fan yangilashda xatolik'),
    }
  )

// DELETE

export const useDeleteSubjectMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation((id: string) => subjectService.deleteSubject(id), {
    onSuccess: () => {
      toast.success('Fan o‘chirildi')
      onSuccess?.()
    },
    onError: () => toast.error('Fan o‘chirishda xatolik'),
  })
