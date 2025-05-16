'use client'

import React, { useEffect, useState } from 'react'
import { Settings2 } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

const themes = [
  { name: "ko'k", value: 'blue', color: 'bg-[#3B5BA4]' },
  { name: 'yashil', value: 'green', color: 'bg-[#3B7C57]' },
  { name: 'qizil', value: 'red', color: 'bg-[#964444]' },
  { name: 'sariq', value: 'yellow', color: 'bg-[#B08934]' },
  { name: 'monoxrom', value: 'mono', color: 'bg-[#4B5563]' },
]

export default function SettingsDrawer() {
  const [theme, setTheme] = useState('light')
  const [colorTheme, setColorTheme] = useState('blue')
  const [fontSize, setFontSize] = useState('base')
  const [rounded, setRounded] = useState(true)

  useEffect(() => {
    document.documentElement.classList.remove(...themes.map((t) => `theme-${t.value}`))
    document.documentElement.classList.add(`theme-${colorTheme}`)
    localStorage.setItem('color-theme', colorTheme)
  }, [colorTheme])

  useEffect(() => {
    const size = fontSize === 'base' ? '1rem' : fontSize === 'lg' ? '1.125rem' : '1.25rem'
    document.documentElement.style.fontSize = size
    localStorage.setItem('font-size', fontSize)
  }, [fontSize])

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--radius', rounded ? '0.5rem' : '0.1rem')
    document.documentElement.style.setProperty('--button-radius', rounded ? '0.5rem' : '0.1rem')
  }, [rounded])

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Sheet>
        <SheetTrigger className="bg-muted rounded-full p-3 shadow">
          <Settings2 className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] space-y-6 overflow-auto p-4 sm:w-[400px]">
          <h2 className="text-xl font-semibold">Sozlamalar</h2>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Rejimni tanlang</Label>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Yorug‘</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Qorong‘i</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Rang mavzusi</Label>
            <div className="flex flex-wrap gap-2">
              {themes.map(({ name, value, color }) => (
                <button
                  key={value}
                  onClick={() => setColorTheme(value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all duration-300 ${
                    colorTheme === value ? 'ring-ring ring-2' : ''
                  } ${color}`}
                  title={name}
                  aria-label={`Tanlang: ${name}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Shrift hajmi</Label>
            <RadioGroup value={fontSize} onValueChange={setFontSize}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="base" id="font-base" />
                <Label htmlFor="font-base">Standart</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="lg" id="font-lg" />
                <Label htmlFor="font-lg">Katta</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="xl" id="font-xl" />
                <Label htmlFor="font-xl">Juda katta</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Qo‘shimcha sozlamalar</Label>
            <div className="flex items-center justify-between">
              <Label>Animatsiyalar</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Qirrali/aylana tugmalar</Label>
              <Switch checked={rounded} onCheckedChange={setRounded} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
