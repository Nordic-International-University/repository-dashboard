'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ResourceForm } from '@/components/pages/materials/materials-form'
import { ResourceTable } from '@/components/pages/materials/materials-table'
import { ResourceDeleteDialog } from '@/components/pages/materials/materials-delete-dialog'
import {
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} from '@/hooks/use-materials'
import { useQueryClient } from 'react-query'
import { Resource } from '../../../../../../types/material/material.types'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Input } from '@/components/ui/input'
import { useCollectionsQuery } from '@/hooks/use-collections'
import { useResourceTypesQuery } from '@/hooks/use-resources'
import { useKeywordsQuery } from '@/hooks/use-keywords'
import { useSubjectsQuery } from '@/hooks/use-subject'
import { ResourceFilterDropdown } from '@/components/pages/materials/ Resource-filter-dropdown'

export default function AdminResourcePage() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState<any>({})


  const { data: collections } = useCollectionsQuery(1, 1000)
  const { data: resourceTypes } = useResourceTypesQuery(1, 1000)
  const { data: keywords } = useKeywordsQuery(1, 1000)
  const queryClient = useQueryClient()

  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'resources'

  const createMutation = useCreateResourceMutation(() => {
    queryClient.invalidateQueries({ queryKey: ['resources'] })
    setFormKey((prev) => prev + 1)
    router.push('?tab=resources')
  })

  const updateMutation = useUpdateResourceMutation(() => {
    queryClient.invalidateQueries({ queryKey: ['resources'] })
    setSelectedResource(null)
    setFormKey((prev) => prev + 1)
    router.push('?tab=resources')
  })

  const deleteMutation = useDeleteResourceMutation(() => {
    queryClient.invalidateQueries({ queryKey: ['resources'] })
    setOpenDialog(false)
  })

  const onEdit = (res: Resource) => {
    setSelectedResource(res)
    setFormKey((prev) => prev + 1)
    router.push('?tab=add-resource')
  }

  const onDelete = (res: Resource) => {
    setDeleteId(res.id)
    setOpenDialog(true)
  }

  const onSubmit = (data: any) => {
    console.log(data)
    if (selectedResource) {
      updateMutation.mutate({ id: selectedResource.id, payload: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleTabChange = (val: string) => {
    router.push(`?tab=${val}`)

    if (val === 'resources') {
      setSelectedResource(null)
      setFormKey((prev) => prev + 1)
    }
  }

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle="Barcha resurslar" />
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted mb-4 grid grid-cols-2 rounded-md p-1">
            <TabsTrigger value="resources">Resurslar</TabsTrigger>
            <TabsTrigger value="add-resource">
              {selectedResource ? 'Resursni tahrirlash' : "Resurs qo'shish"}
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center justify-between gap-3">
            {collections && resourceTypes && keywords &&  (
              <ResourceFilterDropdown
                initialValues={filters}
                onChange={(vals) => setFilters(vals)}
                collections={collections.data}
                resourceTypes={resourceTypes.data}
                keywords={keywords.data}
                subjects={[]}
              />
            )}
            <Input
              placeholder="Resurs qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <TabsContent value="resources">
          <ResourceTable
            filters={filters}
            debouncedSearch={debouncedSearch}
            setSearch={setSearch}
            search={search}
            setDebouncedSearch={setDebouncedSearch}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TabsContent>

        <TabsContent value="add-resource">
          <div className="rounded-md border bg-white p-6 shadow-md dark:bg-[#181F2F]">
            <ResourceForm
              key={`resource-form-${formKey}`}
              onSubmitFunction={onSubmit}
              initialData={selectedResource || undefined}
            />
          </div>
        </TabsContent>
      </Tabs>
      <ResourceDeleteDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  )
}
