'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUPPORTED_LANGUAGES } from '../constants/languages'
import { saveWord } from '../utils/storage'
import { getWordInfo } from '../utils/gemini'
import { toast } from 'sonner'

export default function WordForm() {
  const [word, setWord] = useState('')
  const [language, setLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!word || !language) return

    setIsLoading(true)
    try {
      const wordInfo = await getWordInfo(word, language)
      const newWord = {
        word,
        language,
        meaning: wordInfo.meaning,
        examples: wordInfo.examples,
        date: new Date().toISOString().split('T')[0]
      }
      
      saveWord(newWord)
      toast.success('Word saved successfully!')
      setWord('')
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof Error) {
        if (error.message.includes('UNAUTHENTICATED')) {
          toast.error('API authentication failed. Please check your API key.')
        } else {
          toast.error(`Error: ${error.message}`)
        }
      } else {
        toast.error('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="word">Word</Label>
        <Input
          id="word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading || !word || !language}>
        {isLoading ? 'Loading...' : 'Learn Word'}
      </Button>
    </form>
  )
}

