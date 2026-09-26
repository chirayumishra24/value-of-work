import type { ActRole, ConnectScenario, CrisisScenario, DetectiveScenario, WhatIfScenario, WorkChain } from '../game/types'

export const connectScenarios: ConnectScenario[] = [
  { id: 'food-market', start: 'Farmer', beforeMissing: 'Transport worker', missing: 'Market worker', end: 'Family', options: ['Market worker', 'Football player', 'Movie actor', 'Television watcher'], explanation: 'The market helps food reach families.' },
  { id: 'safe-school', start: 'School community', beforeMissing: 'Problem noticed', missing: 'Repair worker', end: 'Safe gate', options: ['Repair worker', 'Singer', 'Spectator', 'Referee'], explanation: 'Repair work helps make shared school spaces safe.' },
  { id: 'clinic-care', start: 'Clinic', beforeMissing: 'Medical supplies', missing: 'Care worker', end: 'Patient support', options: ['Care worker', 'Audience member', 'Game commentator', 'Tourist'], explanation: 'Care workers help turn available supplies into support for people.' },
  { id: 'clean-park', start: 'Community park', beforeMissing: 'Shared spaces used', missing: 'Cleaning worker', end: 'Welcoming space', options: ['Cleaning worker', 'Cinema actor', 'Goalkeeper', 'TV presenter'], explanation: 'Cleaning work helps shared spaces stay ready for everyone.' },
]

export const workChains: WorkChain[] = [
  { id: 'produce-chain', title: 'From field to family', item: '🥕', order: ['Farmer', 'Harvest', 'Transport', 'Market', 'Family'], explanation: 'Food reaches people through connected contributions, not through one job alone.' },
  { id: 'repair-chain', title: 'A safe school gate', item: '🔧', order: ['Problem noticed', 'Repair worker', 'Tools', 'Safety check', 'School community'], explanation: 'Repair and checking work helps shared places stay safe for everyone.' },
  { id: 'medicine-chain', title: 'Medicine reaches the clinic', item: '💊', order: ['Supplier', 'Packing', 'Transport', 'Clinic', 'Patient'], explanation: 'Care depends on preparing, moving and organising supplies.' },
  { id: 'meal-chain', title: 'A community meal', item: '🍲', order: ['Grower', 'Market', 'Cook', 'Serving', 'Community'], explanation: 'Preparing a shared meal brings together production, service and care.' },
]

export const whatIfScenarios: WhatIfScenario[] = [
  { id: 'transport-stops', stopped: 'Transport work', question: 'If transport work stops, which places could be affected next?', affected: ['shop', 'community'], ripplePath: ['farm', 'shop', 'community'], consequence: 'The market receives fewer supplies, and families in the community have less access to what they need.' },
  { id: 'repair-stops', stopped: 'Repair work', question: 'If repair work stops, which places could be affected next?', affected: ['school', 'hospital'], ripplePath: ['factory', 'school', 'hospital'], consequence: 'A broken water pipe or vehicle may stay out of use, affecting the services that need it.' },
  { id: 'cleaning-stops', stopped: 'Cleaning work', question: 'If cleaning work stops, which places could be affected next?', affected: ['school', 'community'], ripplePath: ['school', 'community'], consequence: 'Shared spaces may become less safe and comfortable for people who use them.' },
  { id: 'care-stops', stopped: 'Care work', question: 'If care work stops, which places could be affected next?', affected: ['hospital', 'community'], ripplePath: ['hospital', 'community'], consequence: 'People who need support may wait longer and their wellbeing can be affected.' },
]

export const detectiveScenarios: DetectiveScenario[] = [
  { id: 'bread-delivery', title: 'The market has no bread', clues: ['Flour is available.', 'The bakery is ready.', 'The market is open.', 'The delivery vehicle is not working.'], question: 'What is most likely preventing bread from reaching the market?', options: ['A transport or repair contribution is missing', 'The market needs fewer customers', 'The baker should stop working', 'The flour should be hidden'], answer: 'A transport or repair contribution is missing', explanation: 'The food can be made, but a vehicle needs repair or another transport option to connect the bakery and market.' },
  { id: 'school-water', title: 'The school tap is leaking', clues: ['The school is open.', 'Students need clean water.', 'A pipe is leaking.', 'A repair worker has the needed tools.'], question: 'Which contribution can restore the water supply?', options: ['Repair and maintenance work', 'Closing all lessons forever', 'Ignoring the leak', 'Moving the playground'], answer: 'Repair and maintenance work', explanation: 'Maintenance work protects shared services so people can use them safely.' },
  { id: 'clinic-queue', title: 'The clinic is crowded', clues: ['A nurse is ready to help.', 'People are arriving at the same time.', 'Medicine is available.', 'No one is organising the waiting area.'], question: 'What contribution could help the clinic work more smoothly?', options: ['Organisation and support work', 'Hiding the medicine', 'Closing the entrance', 'Removing the chairs'], answer: 'Organisation and support work', explanation: 'Organisation helps people receive support fairly and safely.' },
  { id: 'park-lights', title: 'The park lights are off', clues: ['The park is open after school.', 'The light switch has a fault.', 'The repair team has tools.', 'Families use the path home.'], question: 'What contribution could make the path safer?', options: ['Repair work on the lights', 'More posters at the gate', 'Closing the library', 'Moving the market'], answer: 'Repair work on the lights', explanation: 'Repair work can restore a service that helps people use shared spaces safely.' },
]

export const actRoles: ActRole[] = [
  { role: 'Teacher', contribution: 'Imparts knowledge, skills, and mentors students', options: ['Imparts knowledge, skills, and mentors students', 'Repairs heavy road vehicles', 'Trades commodities on the stock exchange', 'Operates farm harvest machinery'] },
  { role: 'Soldier', contribution: 'Serves in the armed forces to defend national peace and security', options: ['Serves in the armed forces to defend national peace and security', 'Sells groceries in the local market', 'Cooks family meals at home', 'Writes software in an office'] },
  { role: 'Homemaker', contribution: 'Manages household work and provides foundational care for family', options: ['Manages household work and provides foundational care for family', 'Navigates international cargo ships', 'Builds commercial skyscrapers', 'Conducts traffic surveys'] },
  { role: 'Entrepreneur', contribution: 'Starts and runs a business, taking risks to create value and jobs', options: ['Starts and runs a business, taking risks to create value and jobs', 'Avoids all responsibility', 'Waits for instructions without initiating', 'Stops all economic trade'] },
  { role: 'Caregiver', contribution: 'Provides support, care, and comfort for elderly or ill individuals', options: ['Provides support, care, and comfort for elderly or ill individuals', 'Repairs electrical power grids', 'Issues parking fines', 'Operates heavy drilling machines'] },
  { role: 'Sanitation Worker', contribution: 'Maintains public cleanliness and safeguards community health', options: ['Maintains public cleanliness and safeguards community health', 'Directs television commercials', 'Composes musical scores', 'Audits corporate accounts'] },
]

export const crisisScenarios: CrisisScenario[] = [
  { id: 'delivery-crisis', alerts: ['🚚 food supply delayed', '🔧 vehicle repair needed', '🧹 public space needs maintenance', '📦 school resource delivery'], plan: ['Repair the delivery vehicle', 'Deliver urgent supplies', 'Maintain the public space'], distractors: ['Close the market', 'Ignore the public space'], explanation: 'Supplies cannot travel until the vehicle works, so repair is the first connected action.' },
  { id: 'water-crisis', alerts: ['💧 school water pipe leaking', '🛠 repair tools available', '🏥 clinic needs a safe route', '🧺 market receives deliveries'], plan: ['Repair the water pipe', 'Check water is safe', 'Support the school community'], distractors: ['Hide the repair tools', 'Close every service'], explanation: 'The pipe must be repaired before the water can be checked and used safely.' },
  { id: 'park-crisis', alerts: ['💡 park lights stopped working', '🔧 repair team available', '🧹 path needs cleaning', '🏘 families use the park'], plan: ['Repair the park lights', 'Clean the shared path', 'Reopen the safe route'], distractors: ['Remove the benches', 'Ignore the path'], explanation: 'Repairing the lights and cleaning the path help people safely use their shared space.' },
]
