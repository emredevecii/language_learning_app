'use client'

import { useState, useEffect } from 'react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getWordsByDate } from '../utils/storage'
import type { WordInfo } from '../types/word'
import { SUPPORTED_LANGUAGES } from '../constants/languages'

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [words, setWords] = useState<WordInfo[]>([])

  useEffect(() => {
    if (date) {
      const dateString = date.toISOString().split('T')[0]
      const wordsForDate = getWordsByDate(dateString)
      setWords(wordsForDate)
    }
  }, [date])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          
          {words.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                Words learned on {date?.toLocaleDateString()}:
              </h3>
              <div className="space-y-4">
                {words.map((word, index) => {
                  const language = SUPPORTED_LANGUAGES.find(
                    lang => lang.code === word.language
                  )
                  return (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="font-semibold">{word.word}</p>
                            <p className="text-sm text-muted-foreground">
                              {language?.name}
                            </p>
                          </div>
                          <p className="text-sm">{word.meaning}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

