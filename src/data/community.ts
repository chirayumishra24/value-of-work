import type { CommunityLocation } from '../game/types'

export const locations: CommunityLocation[] = [
  { id: 'farm', title: 'Farm', icon: '🌱', shortContribution: 'grows food for people', position: 'farm', color: 'green' },
  { id: 'workshop', title: 'Workshop', icon: '🛠', shortContribution: 'makes and repairs useful things', position: 'workshop', color: 'orange' },
  { id: 'market', title: 'Market', icon: '🧺', shortContribution: 'brings goods to families', position: 'market', color: 'yellow' },
  { id: 'school', title: 'School', icon: '✏️', shortContribution: 'helps students learn', position: 'school', color: 'blue' },
  { id: 'hospital', title: 'Hospital', icon: '✚', shortContribution: 'provides care and health support', position: 'hospital', color: 'red' },
  { id: 'community', title: 'Community', icon: '🏘', shortContribution: 'connects people and services', position: 'community', color: 'purple' },
]

export const hiddenWork = ['Cleaning', 'Maintenance', 'Transport', 'Repair', 'Care', 'Organisation', 'Cooking', 'Support']
