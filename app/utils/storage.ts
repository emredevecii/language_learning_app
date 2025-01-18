'use client'

import { WordInfo } from '../types/word'

export function saveWord(wordInfo: WordInfo) {
  const words = getWords()
  words.push(wordInfo)
  localStorage.setItem('learned_words', JSON.stringify(words))
}

export function getWords(): WordInfo[] {
  if (typeof window === 'undefined') return []
  const words = localStorage.getItem('learned_words')
  return words ? JSON.parse(words) : []
}

export function getWordsByDate(date: string): WordInfo[] {
  return getWords().filter(word => word.date === date)
}

