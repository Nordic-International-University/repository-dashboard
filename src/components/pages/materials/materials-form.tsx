'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'

import { useCollectionsQuery } from '@/hooks/use-collections'
import { useSubjectsQuery } from '@/hooks/use-subject'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import type { ResourceFormValues } from '../../../../types/material/material.types'
import { resourceFormScheme } from '@/schemes/material.scheme'
import { useResourceTypesQuery } from '@/hooks/use-resources'
import { useCreateKeywordMutation, useKeywordsQuery } from '@/hooks/use-keywords'
import FileUpload from '@/components/file.upload'
import { AntdMultiSelect } from '@/components/input/custom-multi-select'
import { Textarea } from '@/components/ui/textarea'
import { useAuthorsQuery, useCreateAuthorMutation } from '@/hooks/use-authors'
import { resourceService } from '@/services/materials.service'

interface Props {
  onSubmitFunction: (data: ResourceFormValues) => void
  initialData?: any
}

export const ResourceForm = ({ onSubmitFunction, initialData }: Props) => {
  const form = useForm<ResourceFormValues>({
    // @ts-ignore
    resolver: zodResolver(resourceFormScheme),
    defaultValues: {
      title: '',
      description: '',
      doi: '',
      language: '',
      license: '',
      collectionId: '',
      subjectId: '',
      resourceTypeId: '',
      authors: [],
      documents: [],
      keywords: [],
    },
  })

  console.log(form.getValues())
  const { data: collections } = useCollectionsQuery(1, 1000)
  const { data: subjects } = useSubjectsQuery(1, 1000)
  const { data: resourceTypes } = useResourceTypesQuery(1, 1000)
  const { data: keywords, refetch } = useKeywordsQuery(1, 1000)
  const { data: authors, refetch: authorRefetch } = useAuthorsQuery(1, 10000)
  const createMutation = useCreateKeywordMutation()

  const [loadedData, setLoadedData] = useState<any>(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      if (initialData?.id) {
        try {
          const data = await resourceService.getResource(initialData.id)
          setLoadedData(data)
        } catch (err) {
          console.error('Resursni yuklashda xatolik:', err)
        }
      }
    }

    fetchInitialData()
  }, [initialData?.id])
  console.log(loadedData)
  useEffect(() => {
    if (
      !loadedData ||
      !collections?.data ||
      !subjects?.data ||
      !resourceTypes?.data ||
      !keywords?.data
    )
      return

    const collectionId = loadedData.collection?.id || ''
    const subjectId = loadedData.subject?.id || ''
    const resourceTypeId = loadedData.resourceType?.id || ''
    const keywordIds =
      loadedData.keywords
        ?.map((k: any) => keywords.data?.find((kw) => kw.value === k.value)?.id)
        .filter(Boolean) || []
    const documentIds = loadedData.documents?.map((d: any) => d.id).filter(Boolean) || []
    const authorIds = loadedData.authors?.map((a: any) => a.id).filter(Boolean) || []

    const normalized = {
      title: loadedData.title,
      description: loadedData.description,
      doi: loadedData.doi || '',
      license: loadedData.license || '',
      language: loadedData.language || '',
      collectionId,
      subjectId,
      resourceTypeId,
      keywords: keywordIds,
      documents: documentIds,
      authors: authorIds,
    }

    console.log('Resetting form with:', normalized)
    setTimeout(() => {
      form.reset(normalized)
    }, 0)
  }, [loadedData, collections, subjects, resourceTypes, keywords, form])

  // @ts-ignore
  const onSubmit = form.handleSubmit(onSubmitFunction)

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="space-y-6"
      >
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sarlavha</FormLabel>
              <FormControl>
                <Input placeholder="Quantum Computing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {[
          { name: 'description', label: 'Tavsif', type: 'textarea' },
          { name: 'doi', label: 'DOI', type: 'input' },
          { name: 'license', label: 'Litsenziya', type: 'input' },
        ].map(({ name, label, type }) => (
          <FormField
            key={name}
            name={name as keyof ResourceFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  {type === 'input' ? <Input {...field} /> : <Textarea {...field} />}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Selects */}
        {[
          {
            name: 'language',
            label: 'Til',
            options: [
              { language: "O'zbekcha", value: 'uzbek' },
              { language: 'Ruscha', value: 'russian' },
            ],
            valueKey: 'value',
            labelKey: 'language',
          },
          {
            name: 'collectionId',
            label: 'To‘plam',
            options: collections?.data,
            valueKey: 'id',
            labelKey: 'title',
          },
          {
            name: 'subjectId',
            label: 'Fan',
            options: subjects?.data,
            valueKey: 'id',
            labelKey: 'name',
          },
          {
            name: 'resourceTypeId',
            label: 'Resurs turi',
            options: resourceTypes?.data,
            valueKey: 'id',
            labelKey: 'name',
          },
        ].map(({ name, label, options, valueKey, labelKey }) => (
          <FormField
            key={name}
            name={name as keyof ResourceFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`${label} tanlang`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options?.map((opt: any) => (
                      <SelectItem key={opt[valueKey]} value={opt[valueKey]}>
                        {opt[labelKey]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kalit so‘zlar</FormLabel>
              <FormControl>
                <AntdMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={
                    keywords?.data?.map((k) => ({
                      label: k.value,
                      value: k.id,
                    })) || []
                  }
                  onCreate={async (input) => {
                    const created = await createMutation.mutateAsync({ value: input })
                    await refetch()

                    return {
                      label: created.value,
                      value: created.id,
                    }
                  }}
                  mode="multiple"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="authors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Muallifni tanlang</FormLabel>
              <FormControl>
                <AntdMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={
                    authors?.data?.map((k) => ({
                      label: k.fullname,
                      value: k.id,
                    })) || []
                  }
                  mode="multiple"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FileUpload
          variant="multiple"
          accept="*"
          initialFiles={
            loadedData?.documents?.map((doc: any) => ({
              id: doc.id,
              name: doc.filename,
              mimetype: doc.mimetype || 'application/octet-stream',
              size: doc.size,
              url: doc.url,
            })) || []
          }
          onChange={(newDocumentIds) => {
            form.setValue('documents', newDocumentIds)
          }}
        />

        <div className="flex justify-end">
          <Button type="submit">Saqlash</Button>
        </div>
      </form>
    </Form>
  )
}
