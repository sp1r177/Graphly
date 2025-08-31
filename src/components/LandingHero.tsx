'use client'

import { useLanguage, useUser } from '@/app/providers'
import { Button, Input, Textarea, Select, Card } from '@/components/ui'
import { Copy, Download, Sparkles, Wand2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export function LandingHero() {
  const { t } = useLanguage()
  const { user } = useUser()
  const [prompt, setPrompt] = useState('')
  const [templateType, setTemplateType] = useState('VK_POST')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    text?: string
    imageUrl?: string
  } | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          templateType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Произошла ошибка при генерации. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Текст скопирован в буфер обмена!')
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип контента
                </label>
                <Select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                >
                  <option value="VK_POST">{t('template.vk_post')}</option>
                  <option value="TELEGRAM_POST">{t('template.telegram_post')}</option>
                  <option value="EMAIL_CAMPAIGN">{t('template.email')}</option>
                  <option value="BLOG_ARTICLE">{t('template.article')}</option>
                  <option value="VIDEO_SCRIPT">{t('template.video_script')}</option>
                  <option value="IMAGE_GENERATION">{t('template.image')}</option>
                </Select>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание контента
                </label>
                <Textarea
                  placeholder={t('hero.placeholder')}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Wand2 className="animate-spin mr-2" size={20} />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    {t('hero.generate')}
                  </>
                )}
              </Button>

              {/* Result Display */}
              {result && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Результат генерации
                    </h3>
                    <div className="flex space-x-2">
                      {result.text && (
                        <Button
                          onClick={() => handleCopy(result.text!)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy size={16} className="mr-1" />
                          {t('hero.copy')}
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download size={16} className="mr-1" />
                        {t('hero.export')}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {result.text && (
                      <Card className="p-4">
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                            {result.text}
                          </pre>
                        </div>
                      </Card>
                    )}
                    
                    {result.imageUrl && (
                      <Card className="p-4">
                        <Image
                          src={result.imageUrl}
                          alt="Generated content"
                          width={512}
                          height={384}
                          className="max-w-full h-auto rounded-lg"
                        />
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}