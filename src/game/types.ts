export type TeamId = 'A' | 'B'
export type ChallengeType = 'quiz' | 'connect' | 'chain' | 'whatIf' | 'detective' | 'act' | 'hidden' | 'crisis'
export type TokenType = 'work' | 'skill' | 'connection' | 'cooperation' | 'community'
export type GameMode = 'teams' | 'players'
export type GameScreen = 'home' | 'setup' | 'game' | 'results'
export type SessionLength = 'quick' | 'standard' | 'full'
export type ReadingMode = 'standard' | 'focus'
export type UiLanguage = 'en' | 'hi'
export type QuestionCategory = 'contribution' | 'skills' | 'connections' | 'care' | 'maintenance' | 'cooperation'
export type LifelineType = 'fiftyFifty' | 'clue' | 'extraTime'

export interface TeamState { id: TeamId; name: string; score: number; tokens: Record<TokenType, number>; contributions: number }
export interface GameSettings { timerEnabled: boolean; soundEnabled: boolean; reducedMotion: boolean; readingMode: ReadingMode; language: UiLanguage }
export interface GameState {
  screen: GameScreen; mode: GameMode; sessionLength: SessionLength; activeRounds: ChallengeType[]; sessionSeed: number
  teams: Record<TeamId, TeamState>; activeTeam: TeamId; currentRound: number; usedQuestionIds: string[]; completedChallenges: ChallengeType[]
  discoveredWork: string[]; completedChains: number; predictions: number; problemsSolved: number; hiddenWorkDiscovered: number
  recognitions: string[]; challengeHistory: ChallengeType[]; settings: GameSettings
}
export interface QuizQuestion { id: string; category: QuestionCategory; difficulty: 'easy' | 'medium' | 'hard'; question: string; options: string[]; answer: string; explanation: string; hint: string; points: number }
export interface WorkChain { id: string; title: string; item: string; order: string[]; explanation: string }
export interface ConnectScenario { id: string; start: string; beforeMissing: string; missing: string; end: string; options: string[]; explanation: string }
export interface DetectiveScenario { id: string; title: string; clues: string[]; question: string; options: string[]; answer: string; explanation: string }
export interface WhatIfScenario { id: string; stopped: string; question: string; affected: string[]; ripplePath: string[]; consequence: string }
export interface ActRole { role: string; contribution: string; options: string[] }
export interface CrisisScenario { id: string; alerts: string[]; plan: string[]; distractors: string[]; explanation: string }
export interface RoundDefinition { type: ChallengeType; title: string; kicker: string; time: number; icon: string; questionCategory?: QuestionCategory; takeaway: string; discussion: string }
export interface CommunityLocation { id: string; title: string; icon: string; shortContribution: string; position: string; color: string; buildingImage?: string }
