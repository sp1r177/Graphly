import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import { ChunkErrorBoundary } from '@/components/ChunkErrorBoundary'

export const metadata: Metadata = {
  title: 'AIКонтент - Генерация маркетингового контента с ИИ',
  description: 'Создавайте профессиональный контент для социальных сетей, email-кампаний и блогов с помощью искусственного интеллекта',
  keywords: 'ИИ, контент, маркетинг, SMM, ВКонтакте, Telegram, блог, email, генерация',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <ChunkErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ChunkErrorBoundary>
      </body>
    </html>
  )
}