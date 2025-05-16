'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Category } from '../../../../../../types/category/category.types'
import { CategoryTable } from '@/components/pages/categories/category-table'
import { CategoryDialog } from '@/components/pages/categories/categories-dialog'
import { DeleteCategoryDialog } from '@/components/pages/categories/delete-category-dialog'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'

export default function Page() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setEditDialogOpen(true)
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Barcha yo‘nalishlar" />
      <CategoryTable
        onEdit={handleEdit}
        onDelete={handleDelete}
        AddCategoryButton={() => (
          <div className="flex items-center justify-between">
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yo‘nalish qo‘shish
            </Button>
          </div>
        )}
      />

      <CategoryDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} mode="create" />

      <CategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={selectedCategory}
        mode="edit"
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={selectedCategory}
      />
    </div>
  )
}
