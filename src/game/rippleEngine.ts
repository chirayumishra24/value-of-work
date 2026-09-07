import type { WhatIfScenario } from './types'

export function buildRippleSteps(scenario: WhatIfScenario) {
  return [...new Set(scenario.ripplePath)]
}

export function predictionMatches(scenario: WhatIfScenario, selected: string[]) {
  return scenario.affected.length === selected.length && scenario.affected.every(location => selected.includes(location))
}

export function rippleExplanation(scenario: WhatIfScenario) {
  return `${scenario.stopped} is connected to ${scenario.affected.join(' and ')} through the community work network.`
}
