import type { QuestionCategory, QuizQuestion } from './types'

export function selectUnusedQuestion(allQuestions: QuizQuestion[], usedIds: string[], preferredCategory?: QuestionCategory, seed = 0): QuizQuestion | null {
  const unused = allQuestions.filter(question => !usedIds.includes(question.id))
  if (!unused.length) return null
  const categoryMatches = preferredCategory ? unused.filter(question => question.category === preferredCategory) : []
  const pool = categoryMatches.length ? categoryMatches : unused
  return pool[Math.abs(seed) % pool.length]
}

export function remainingQuestionCount(allQuestions: QuizQuestion[], usedIds: string[]) {
  return allQuestions.filter(question => !usedIds.includes(question.id)).length
}
