'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'
import { Collection } from '@/../types/colecctions/collections.types'
import { Keyword } from '@/../types/keyword/keyword.types'
import { Subject } from '@/../types/subject-types/subject.types'
import { ResourceType } from '@/../types/resources/rosurce.types'
import { useState } from 'react'
import {
  ResourceFilterForm,
  ResourceFilterValues,
} from '@/components/pages/materials/materials-filter'

interface Props {
  initialValues?: ResourceFilterValues
  onChange: (filters: ResourceFilterValues) => void
  collections: Collection[]
  subjects: Subject[]
  resourceTypes: ResourceType[]
  keywords: Keyword[]
}

export const ResourceFilterDropdown = ({
  initialValues,
  onChange,
  collections,
  subjects,
  resourceTypes,
  keywords,
}: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-32">
          <FilterIcon className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[550px] max-w-full p-4">
        <ResourceFilterForm
          initialValues={initialValues}
          onChange={(values) => {
            onChange(values)
            setOpen(false)
          }}
          collections={collections}
          subjects={subjects}
          resourceTypes={resourceTypes}
          keywords={keywords}
        />
      </PopoverContent>
    </Popover>
  )
}
