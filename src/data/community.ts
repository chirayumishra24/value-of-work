import type { CommunityLocation } from '../game/types'

export const locations: CommunityLocation[] = [
  { id: 'farm', title: 'Farm', icon: '🌾', shortContribution: 'grows food for people', position: 'farm', color: 'green', buildingImage: '/assets/building_farm.jpg' },
  { id: 'factory', title: 'Factory', icon: '🏭', shortContribution: 'makes and repairs useful things', position: 'factory', color: 'orange', buildingImage: '/assets/building_factory.jpg' },
  { id: 'shop', title: 'Shop', icon: '🛒', shortContribution: 'brings goods to families', position: 'shop', color: 'yellow', buildingImage: '/assets/building_shop.jpg' },
  { id: 'school', title: 'School', icon: '📚', shortContribution: 'helps students learn', position: 'school', color: 'blue', buildingImage: '/assets/building_school.jpg' },
  { id: 'hospital', title: 'Hospital', icon: '🏥', shortContribution: 'provides care and health support', position: 'hospital', color: 'red', buildingImage: '/assets/building_hospital.jpg' },
  { id: 'community', title: 'Community', icon: '🏘', shortContribution: 'connects people and services', position: 'community', color: 'purple', buildingImage: '/assets/building_community.jpg' },
]

export const hiddenWork = ['Cleaning', 'Maintenance', 'Transport', 'Repair', 'Care', 'Organisation', 'Cooking', 'Support']
