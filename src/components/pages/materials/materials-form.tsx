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
import { useEffect } from 'react'

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
import { CustomMultiSelectInput } from '@/components/input/custom-multi-select'

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
      documents: [],
      keywords: [],
    },
  })

  console.log(form.getValues())
  const { data: collections } = useCollectionsQuery(1, 1000)
  const { data: subjects } = useSubjectsQuery(1, 1000)
  const { data: resourceTypes } = useResourceTypesQuery(1, 1000)
  const { data: keywords, refetch } = useKeywordsQuery(1, 1000)
  const createMutation = useCreateKeywordMutation()

  useEffect(() => {
    if (!initialData) {
      form.reset({
        title: '',
        description: '',
        doi: '',
        language: '',
        license: '',
        collectionId: '',
        subjectId: '',
        resourceTypeId: '',
        documents: [],
        keywords: [],
      })
      return
    }

    console.log(form.getValues())
    if (collections?.data && subjects?.data && resourceTypes?.data && keywords?.data) {
      console.log('Normalizing and setting form data', initialData)

      const collectionId = collections.data.find((c) => c.title === initialData.collection)?.id
      console.log('Found collection ID:', collectionId)

      // Find the subject ID
      const subjectId = subjects.data.find((s) => s.name === initialData.subject)?.id
      console.log('Found subject ID:', subjectId)

      // Find the resource type ID
      const resourceTypeId = resourceTypes.data.find((r) => r.name === initialData.resourceType)?.id
      console.log('Found resource type ID:', resourceTypeId)

      // Map keywords
      const keywordIds =
        initialData.keywords
          ?.map((k: any) => {
            const found = keywords.data?.find((kw) => kw.value === k.value)
            return found?.id
          })
          .filter(Boolean) || []
      console.log('Mapped keyword IDs:', keywordIds)

      // Map documents
      const documentIds = initialData.documents?.map((d: any) => d.id).filter(Boolean) || []

      const normalized = {
        title: initialData.title,
        description: initialData.description,
        doi: initialData.doi || '',
        license: initialData.license || '',
        language: initialData.language || '',
        collectionId: collectionId || '',
        subjectId: subjectId || '',
        resourceTypeId: resourceTypeId || '',
        keywords: keywordIds,
        documents: documentIds,
      }

      console.log('Setting form values to:', initialData)

      setTimeout(() => {
        form.reset(normalized)
      }, 0)
    }
  }, [initialData, collections, subjects, resourceTypes, keywords, form])

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
          { name: 'description', label: 'Tavsif' },
          { name: 'doi', label: 'DOI' },
          { name: 'license', label: 'Litsenziya' },
        ].map(({ name, label }) => (
          <FormField
            key={name}
            name={name as keyof ResourceFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <CustomMultiSelectInput
                  value={field.value || []}
                  options={
                    keywords?.data?.map((k) => ({
                      label: k.value,
                      value: k.id,
                    })) || []
                  }
                  onChange={field.onChange}
                  onCreate={async (input) => {
                    const created = await createMutation.mutateAsync({ value: input })
                    await refetch()

                    return {
                      label: created.value,
                      value: created.id,
                    }
                  }}
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
            initialData?.documents?.map((doc: any) => ({
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
