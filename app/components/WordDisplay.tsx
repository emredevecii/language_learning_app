'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getWords } from '../utils/storage'
import type { WordInfo } from '../types/word'
import { SUPPORTED_LANGUAGES } from '../constants/languages'

export default function WordDisplay() {
  const [latestWord, setLatestWord] = useState<WordInfo | null>(null)

  useEffect(() => {
    const words = getWords()
    if (words.length > 0) {
      setLatestWord(words[words.length - 1])
    }

    const handleStorage = () => {
      const updatedWords = getWords()
      if (updatedWords.length > 0) {
        setLatestWord(updatedWords[updatedWords.length - 1])
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (!latestWord) return null

  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === latestWord.language)

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Latest Word: {latestWord.word}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Language:</p>
            <p>{language?.name || latestWord.language}</p>
          </div>
          <div>
            <p className="font-semibold">Meaning:</p>
            <p>{latestWord.meaning}</p>
          </div>
          <div>
            <p className="font-semibold">Example Sentences:</p>
            <ul className="list-disc pl-5 space-y-2">
              {latestWord.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

