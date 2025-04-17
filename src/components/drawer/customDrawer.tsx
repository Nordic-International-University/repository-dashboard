import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface CustomDrawerProps {
  open: boolean
  setOpen: (value: boolean) => void
  direction?: 'top' | 'bottom' | 'left' | 'right'
  title: string
  description?: string
  children: ReactNode
}

const CustomDrawer = ({
  open,
  setOpen,
  direction = 'right',
  title,
  description,
  children,
}: CustomDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={setOpen} direction={direction}>
      <DrawerContent className="right-0 ml-auto">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        <div className="space-y-4 p-4">{children}</div>

        <DrawerFooter>
          <Button type="submit">Saqlash</Button>
          <DrawerClose asChild>
            <Button variant="outline">Bekor qilish</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CustomDrawer
