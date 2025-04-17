import { Outfit } from 'next/font/google'
import './globals.css'
import '@radix-ui/themes/styles.css'
import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import QueryProvider from '@/lib/query.provider'
import { Toaster } from '@/components/ui/sonner'
import { ReduxProvider } from '@/store/provider'

const outfit = Outfit({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <QueryProvider>
          {/*<ReduxProvider>*/}
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
          {/*</ReduxProvider>*/}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
