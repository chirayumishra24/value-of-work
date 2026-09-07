import type { ChallengeType, RoundDefinition, SessionLength } from '../game/types'

export const rounds: RoundDefinition[] = [
  { type: 'quiz', title: 'Quick Quiz', kicker: 'Identify a contribution', time: 20, icon: '✦', questionCategory: 'connections', takeaway: 'A contribution often helps another person take the next step.', discussion: 'Which job in this question depended on another contribution?' },
  { type: 'connect', title: 'Connect the Work', kicker: 'Find the missing link', time: 30, icon: '↗', takeaway: 'Work chains include people and services that can be easy to overlook.', discussion: 'Where else might this missing contribution be needed?' },
  { type: 'chain', title: 'Build the Work Chain', kicker: 'Arrange a real connection', time: 35, icon: '⛓', takeaway: 'A useful item often reaches people through several connected contributions.', discussion: 'What could happen if one card disappeared from this chain?' },
  { type: 'whatIf', title: 'What Happens If?', kicker: 'Predict the ripple', time: 50, icon: '◌', takeaway: 'When one contribution stops, downstream services may be affected.', discussion: 'Which community member would notice this change first?' },
  { type: 'detective', title: 'Work Detective', kicker: 'Investigate the missing contribution', time: 45, icon: '⌕', takeaway: 'Good problem-solving looks for the missing connection, not just the visible problem.', discussion: 'What evidence helped you rule out another answer?' },
  { type: 'act', title: 'Act It Out', kicker: 'Show the role, explain the contribution', time: 30, icon: '★', takeaway: 'A role is valuable because of the contribution it makes to others.', discussion: 'Who could depend on this work during a normal day?' },
  { type: 'hidden', title: 'Look Closer', kicker: 'Discover the work in the background', time: 40, icon: '◈', takeaway: 'Some essential work is less visible, but it still supports the community.', discussion: 'Which less-visible contribution would you notice more now?' },
  { type: 'crisis', title: 'Community Crisis', kicker: 'Plan connected solutions', time: 60, icon: '⚑', takeaway: 'Solving community problems requires choosing actions in a connected order.', discussion: 'Why was the first action important before the next one could work?' },
]

export const sessionPresets: Record<SessionLength, { label: string; description: string; rounds: ChallengeType[] }> = {
  quick: { label: 'Quick Play', description: 'Four high-impact challenges for a short lesson.', rounds: ['quiz', 'connect', 'whatIf', 'crisis'] },
  standard: { label: 'Standard', description: 'Six varied challenges for one class period.', rounds: ['quiz', 'connect', 'chain', 'whatIf', 'detective', 'crisis'] },
  full: { label: 'Full Challenge', description: 'All eight challenges and the complete community story.', rounds: rounds.map(round => round.type) },
}

export function getRound(type: ChallengeType) {
  return rounds.find(round => round.type === type)!
}
