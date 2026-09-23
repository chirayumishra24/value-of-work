import { useMemo, useState, type ReactNode } from 'react'
import { actRoles, connectScenarios, crisisScenarios, detectiveScenarios, hiddenWork, whatIfScenarios, workChains } from '../data/content'
import { buildRippleSteps, predictionMatches } from '../game/rippleEngine'
import type { ChallengeType, QuizQuestion, TeamId, TokenType } from '../game/types'

export interface ChallengeReward {
  points: number
  token: TokenType
  message: string
  discovered?: string[]
  chains?: number
  predictions?: number
  problems?: number
  hiddenWork?: number
  teamId?: TeamId
  recognition?: string
}

interface ChallengePanelProps {
  type: ChallengeType
  activeTeamName: string
  activeTeamId: TeamId
  stealTeamName: string
  stealTeamId: TeamId
  question: QuizQuestion
  variantSeed: number
  onComplete: (reward: ChallengeReward) => void
  onRipple: (nodes: string[]) => void
  onTravel: (item: string, nodes: string[]) => void
  onPassTurn?: (teamId: TeamId) => void
  onUseLifeline?: (type: 'fiftyFifty' | 'clue' | 'extraTime') => boolean
  lifelinesUsed?: { fiftyFifty: boolean; clue: boolean }
  activeTeamScore?: number
}

const chooseVariant = <T,>(items: T[], seed: number) => items[Math.abs(seed) % items.length]

function ChallengeFrame({ children, label, title, instruction }: { children: ReactNode; label: string; title: string; instruction: string }) {
  return <section className="challenge-panel" aria-label={title}>
    <div className="challenge-heading"><span className="challenge-icon" aria-hidden="true">{label}</span><div><p className="eyebrow">Current challenge</p><h2>{title}</h2></div></div>
    <p className="challenge-instruction">{instruction}</p>{children}
  </section>
}

function LifelineBar({
  onUseLifeline,
  lifelinesUsed,
  activeTeamScore,
}: {
  onUseLifeline?: (type: 'fiftyFifty' | 'clue' | 'extraTime') => boolean
  lifelinesUsed?: { fiftyFifty: boolean; clue: boolean }
  activeTeamScore?: number
}) {
  if (!onUseLifeline) return null
  const score = activeTeamScore ?? 0
  const used = lifelinesUsed ?? { fiftyFifty: false, clue: false }

  return (
    <div className="lifeline-bar" role="toolbar" aria-label="Lifelines">
      <span className="lifeline-label">🆘 Lifelines:</span>
      <button
        type="button"
        className={`lifeline-chip ${used.fiftyFifty ? 'used' : ''}`}
        disabled={used.fiftyFifty || score < 3}
        onClick={() => onUseLifeline('fiftyFifty')}
        title="Eliminate two wrong choices (-3 points)"
      >
        <span>✂️ 50:50</span> <small>(-3 pts)</small>
      </button>
      <button
        type="button"
        className={`lifeline-chip ${used.clue ? 'used' : ''}`}
        disabled={used.clue || score < 2}
        onClick={() => onUseLifeline('clue')}
        title="Reveal an extra community clue (-2 points)"
      >
        <span>💡 Clue</span> <small>(-2 pts)</small>
      </button>
      <button
        type="button"
        className="lifeline-chip"
        disabled={score < 2}
        onClick={() => onUseLifeline('extraTime')}
        title="Add +15 seconds to round timer (-2 points)"
      >
        <span>⏱️ +15s</span> <small>(-2 pts)</small>
      </button>
    </div>
  )
}

function QuizChallenge({
  question,
  activeTeamName,
  activeTeamId,
  stealTeamName,
  stealTeamId,
  onComplete,
  onPassTurn,
  onUseLifeline,
  lifelinesUsed,
  activeTeamScore,
}: Omit<ChallengePanelProps, 'type' | 'onRipple' | 'onTravel' | 'variantSeed'>) {
  const [phase, setPhase] = useState<'initial' | 'passed'>('initial')
  const [attemptingTeam, setAttemptingTeam] = useState<TeamId>(activeTeamId)
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([])
  const [response, setResponse] = useState<string | null>(null)

  const fiftyFiftyEliminated = useMemo(() => {
    if (!lifelinesUsed?.fiftyFifty) return []
    const wrong = question.options.filter(opt => opt !== question.answer)
    return wrong.slice(0, 2)
  }, [lifelinesUsed?.fiftyFifty, question])

  const allEliminated = [...new Set([...eliminatedOptions, ...fiftyFiftyEliminated])]

  const choose = (option: string) => {
    if (allEliminated.includes(option)) return

    if (option === question.answer) {
      if (phase === 'initial') {
        onComplete({
          points: question.points,
          token: 'work',
          message: `${activeTeamName} answered correctly! ${question.explanation}`,
          discovered: [question.category],
          teamId: activeTeamId,
        })
      } else {
        onComplete({
          points: question.points,
          token: 'connection',
          message: `${stealTeamName} stepped up with the right answer and scored ${question.points} points! ${question.explanation}`,
          discovered: [question.category],
          teamId: stealTeamId,
        })
      }
    } else {
      setEliminatedOptions(prev => [...prev, option])
      if (phase === 'initial') {
        setPhase('passed')
        setAttemptingTeam(stealTeamId)
        onPassTurn?.(stealTeamId)
        setResponse(`❌ Not quite! Turn passed to ${stealTeamName}. Your turn to attempt!`)
      } else {
        setResponse(`❌ Incorrect answer. Neither team got the point! The correct answer was "${question.answer}".`)
        window.setTimeout(() => {
          onComplete({
            points: 0,
            token: 'work',
            message: `Neither team got the right answer. The correct answer was "${question.answer}". ${question.explanation}`,
            teamId: stealTeamId,
          })
        }, 1500)
      }
    }
  }

  return (
    <ChallengeFrame
      label="✦"
      title="Quick Quiz"
      instruction={
        phase === 'passed'
          ? `🔄 Passed to ${stealTeamName}! Choose the contribution that fits best.`
          : `${activeTeamName}, choose the contribution that fits best.`
      }
    >
      <LifelineBar onUseLifeline={onUseLifeline} lifelinesUsed={lifelinesUsed} activeTeamScore={activeTeamScore} />

      {lifelinesUsed?.clue && (
        <div className="lifeline-clue-card" aria-live="polite">
          <b>💡 Community Clue:</b> {question.hint} Look closely at which service or person depends directly on this work!
        </div>
      )}

      <div className="question-card">
        {phase === 'passed' && <span className="passed-badge">🔄 Passed to {stealTeamName}</span>}
        <span className="difficulty">{question.difficulty}</span>
        <h3>{question.question}</h3>
      </div>
      <div className="answer-grid">
        {question.options.map((option, index) => {
          const isEliminated = allEliminated.includes(option)
          return (
            <button
              type="button"
              className={`answer-option ${isEliminated ? 'eliminated' : ''}`}
              disabled={isEliminated}
              onClick={() => choose(option)}
              key={option}
            >
              <b>{String.fromCharCode(65 + index)}</b>
              <span>{option}</span>
              {isEliminated && <span className="eliminated-tag">✕</span>}
            </button>
          )
        })}
      </div>
      <div className="hint-row"><span>Hint:</span> {question.hint}</div>
      {response && <p className="feedback-note" aria-live="polite">{response}</p>}
    </ChallengeFrame>
  )
}

function ConnectChallenge({
  activeTeamName,
  activeTeamId,
  stealTeamName,
  stealTeamId,
  variantSeed,
  onComplete,
  onPassTurn,
  onUseLifeline,
  lifelinesUsed,
  activeTeamScore,
}: Pick<ChallengePanelProps, 'activeTeamName' | 'activeTeamId' | 'stealTeamName' | 'stealTeamId' | 'variantSeed' | 'onComplete' | 'onPassTurn' | 'onUseLifeline' | 'lifelinesUsed' | 'activeTeamScore'>) {
  const scenario = chooseVariant(connectScenarios, variantSeed)
  const [selected, setSelected] = useState<string | null>(null)
  const [phase, setPhase] = useState<'initial' | 'passed'>('initial')
  const [feedback, setFeedback] = useState('')
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([])

  const submit = () => {
    if (!selected) return
    if (selected === scenario.missing) {
      const recipient = phase === 'initial' ? activeTeamId : stealTeamId
      const name = phase === 'initial' ? activeTeamName : stealTeamName
      onComplete({ points: 10, token: 'connection', message: `Connected! ${name} made the right link: ${scenario.explanation}`, discovered: [scenario.missing], teamId: recipient })
    } else {
      setEliminatedOptions(prev => [...prev, selected])
      if (phase === 'initial') {
        setPhase('passed')
        onPassTurn?.(stealTeamId)
        setSelected(null)
        setFeedback(`❌ Not quite! Turn passed to ${stealTeamName}. Which contribution helps the next step happen?`)
      } else {
        setFeedback(`❌ Incorrect. Neither team got the point! The missing contribution was "${scenario.missing}".`)
        window.setTimeout(() => {
          onComplete({ points: 0, token: 'connection', message: `Neither team got it right. The missing contribution was "${scenario.missing}". ${scenario.explanation}`, teamId: stealTeamId })
        }, 1500)
      }
    }
  }

  return (
    <ChallengeFrame
      label="↗"
      title="Connect the Work"
      instruction={
        phase === 'passed'
          ? `🔄 Passed to ${stealTeamName}! Complete the relationship by choosing the missing contribution.`
          : `${activeTeamName}, complete the relationship by choosing the missing contribution.`
      }
    >
      <LifelineBar onUseLifeline={onUseLifeline} lifelinesUsed={lifelinesUsed} activeTeamScore={activeTeamScore} />

      <div className="vertical-chain">
        <span>{scenario.start}</span><i>↓</i>
        <span>{scenario.beforeMissing}</span><i>↓</i>
        <button type="button" className={`missing-card ${selected ? 'filled' : ''}`} onClick={() => setSelected(null)}>
          {selected || 'Choose the missing contribution'}
        </button><i>↓</i>
        <span>{scenario.end}</span>
      </div>
      <div className="choice-pills">
        {scenario.options.map(option => {
          const isEliminated = eliminatedOptions.includes(option)
          return (
            <button
              type="button"
              key={option}
              disabled={isEliminated}
              className={`${selected === option ? 'chosen' : ''} ${isEliminated ? 'eliminated' : ''}`}
              onClick={() => setSelected(option)}
            >
              {option} {isEliminated && '✕'}
            </button>
          )
        })}
      </div>
      <button type="button" className="primary-action" disabled={!selected} onClick={submit}>
        Connect the chain <span aria-hidden="true">→</span>
      </button>
      {feedback && <p className="feedback-note" aria-live="polite">{feedback}</p>}
    </ChallengeFrame>
  )
}

function WorkChainChallenge({ activeTeamName, variantSeed, onComplete, onTravel }: Pick<ChallengePanelProps, 'activeTeamName' | 'variantSeed' | 'onComplete' | 'onTravel'>) {
  const chain = chooseVariant(workChains, variantSeed)
  const [items, setItems] = useState(() => [...chain.order.slice(2), ...chain.order.slice(0, 2)])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const move = (from: number, to: number) => { const next = [...items]; const [moving] = next.splice(from, 1); next.splice(to, 0, moving); setItems(next) }
  const travelNodes = chain.id === 'produce-chain' || chain.id === 'meal-chain' ? ['farm', 'shop', 'community'] : chain.id === 'medicine-chain' ? ['factory', 'hospital', 'community'] : ['factory', 'school', 'community']
  const check = () => {
    if (items.join('|') === chain.order.join('|')) { onTravel(chain.item, travelNodes); onComplete({ points: 15, token: 'skill', message: `${chain.explanation} Watch the item travel through the board.`, discovered: chain.order, chains: 1, recognition: 'Work Chain Builder' }) }
    else setFeedback(`Not yet. ${chain.explanation} What happens first?`)
  }
  return <ChallengeFrame label="⛓" title="Build the Work Chain" instruction={`${activeTeamName}, drag cards into a logical order. Arrow buttons also work with a keyboard.`}>
    <div className="chain-builder" aria-label={`Arrange ${chain.title}`} aria-live="polite">{items.map((item, index) => <div className="sortable-card" key={item} draggable onDragStart={() => setDragIndex(index)} onDragOver={event => event.preventDefault()} onDrop={() => { if (dragIndex !== null && dragIndex !== index) move(dragIndex, index); setDragIndex(null) }}><span className="grab" aria-hidden="true">⠿</span><b>{item}</b><span className="sort-controls"><button type="button" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label={`Move ${item} earlier`}>←</button><button type="button" disabled={index === items.length - 1} onClick={() => move(index, index + 1)} aria-label={`Move ${item} later`}>→</button></span></div>)}</div>
    <div className="travel-preview"><span aria-hidden="true">{chain.item}</span><p>{chain.title}: build the route, then the item will travel across the board.</p></div>
    <button type="button" className="primary-action" onClick={check}>Test this work chain</button>{feedback && <p className="feedback-note" aria-live="polite">{feedback}</p>}
  </ChallengeFrame>
}

function WhatIfChallenge({ activeTeamName, variantSeed, onComplete, onRipple }: Pick<ChallengePanelProps, 'activeTeamName' | 'variantSeed' | 'onComplete' | 'onRipple'>) {
  const scenario = chooseVariant(whatIfScenarios, variantSeed)
  const [selected, setSelected] = useState<string[]>([])
  const [hasRun, setHasRun] = useState(false)
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const correct = predictionMatches(scenario, selected)
  return <ChallengeFrame label="◌" title="What Happens If?" instruction={`${activeTeamName}, predict first. Then run the ripple across the community board.`}>
    <div className="scenario-banner"><span aria-hidden="true">⚠</span><div><p>CONSEQUENCE MODE</p><h3>{scenario.stopped} stops.</h3></div></div><h3 className="prompt">{scenario.question}</h3>
    <div className="impact-choices">{['farm', 'factory', 'shop', 'school', 'hospital', 'community'].map(place => <button type="button" key={place} className={selected.includes(place) ? 'selected' : ''} onClick={() => toggle(place)}>{selected.includes(place) ? '✓ ' : ''}{place}</button>)}</div>
    {!hasRun ? <button type="button" className="primary-action" disabled={!selected.length} onClick={() => { setHasRun(true); onRipple(buildRippleSteps(scenario)) }}>Make prediction &amp; run the ripple</button> : <div className="ripple-result"><p><b>What happened:</b> {scenario.consequence}</p><p>{correct ? 'Your prediction matches the main ripple.' : 'You found part of the ripple. Look again at which places depend on this work.'}</p><button type="button" className="primary-action" onClick={() => onComplete({ points: correct ? 15 : 8, token: 'connection', message: correct ? 'Excellent prediction! One contribution can affect many others.' : 'You tested a useful prediction and saw a community connection.', predictions: 1, recognition: correct ? 'Connection Thinker' : undefined })}>Collect insight <span aria-hidden="true">→</span></button></div>}
  </ChallengeFrame>
}

function DetectiveChallenge({
  activeTeamName,
  activeTeamId,
  stealTeamName,
  stealTeamId,
  variantSeed,
  onComplete,
  onPassTurn,
  onUseLifeline,
  lifelinesUsed,
  activeTeamScore,
}: Pick<ChallengePanelProps, 'activeTeamName' | 'activeTeamId' | 'stealTeamName' | 'stealTeamId' | 'variantSeed' | 'onComplete' | 'onPassTurn' | 'onUseLifeline' | 'lifelinesUsed' | 'activeTeamScore'>) {
  const scenario = chooseVariant(detectiveScenarios, variantSeed)
  const [seen, setSeen] = useState<number[]>([])
  const [answer, setAnswer] = useState<string | null>(null)
  const [phase, setPhase] = useState<'initial' | 'passed'>('initial')
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')
  const inspect = (index: number) => setSeen(current => current.includes(index) ? current : [...current, index])
  const solve = () => {
    if (!answer) return
    if (answer === scenario.answer) {
      const recipient = phase === 'initial' ? activeTeamId : stealTeamId
      const name = phase === 'initial' ? activeTeamName : stealTeamName
      onComplete({
        points: 15,
        token: 'skill',
        message: `Case solved! ${name} found the answer: ${scenario.explanation}`,
        problems: 1,
        discovered: ['Investigation', 'Problem solving'],
        recognition: 'Careful Investigator',
        teamId: recipient,
      })
    } else {
      setEliminatedOptions(prev => [...prev, answer])
      if (phase === 'initial') {
        setPhase('passed')
        onPassTurn?.(stealTeamId)
        setAnswer(null)
        setFeedback(`❌ Case not solved! Clues passed to ${stealTeamName}. What is your deduction?`)
      } else {
        setFeedback(`❌ Incorrect deduction. Neither team got the point! The answer was "${scenario.answer}".`)
        window.setTimeout(() => {
          onComplete({
            points: 0,
            token: 'skill',
            message: `Neither team solved the case. The missing contribution was "${scenario.answer}". ${scenario.explanation}`,
            teamId: stealTeamId,
          })
        }, 1500)
      }
    }
  }

  return (
    <ChallengeFrame
      label="⌕"
      title="Work Detective"
      instruction={
        phase === 'passed'
          ? `🔄 Passed to ${stealTeamName}! Review the clues and solve the community problem.`
          : `${activeTeamName}, inspect every clue, then solve the community problem.`
      }
    >
      <LifelineBar onUseLifeline={onUseLifeline} lifelinesUsed={lifelinesUsed} activeTeamScore={activeTeamScore} />

      <div className="detective-title">
        <span aria-hidden="true">🔎</span>
        <div>
          <p>CASE FILE {phase === 'passed' && `• PASSED TO ${stealTeamName.toUpperCase()}`}</p>
          <h3>{scenario.title}</h3>
        </div>
      </div>
      <div className="clue-grid">
        {scenario.clues.map((clue, index) => (
          <button type="button" className={seen.includes(index) ? 'seen' : ''} onClick={() => inspect(index)} key={clue}>
            <span>{seen.includes(index) ? '✓' : '?'}</span>
            {seen.includes(index) ? clue : 'Inspect clue'}
          </button>
        ))}
      </div>
      {seen.length === scenario.clues.length && (
        <>
          <h3 className="prompt">{scenario.question}</h3>
          <div className="choice-pills">
            {scenario.options.map(option => {
              const isEliminated = eliminatedOptions.includes(option)
              return (
                <button
                  type="button"
                  key={option}
                  disabled={isEliminated}
                  className={`${answer === option ? 'chosen' : ''} ${isEliminated ? 'eliminated' : ''}`}
                  onClick={() => setAnswer(option)}
                >
                  {option} {isEliminated && '✕'}
                </button>
              )
            })}
          </div>
          <button type="button" className="primary-action" disabled={!answer} onClick={solve}>
            Solve the problem
          </button>
        </>
      )}
      {feedback && <p className="feedback-note" aria-live="polite">{feedback}</p>}
    </ChallengeFrame>
  )
}

function ActItOutChallenge({ activeTeamName, variantSeed, onComplete }: Pick<ChallengePanelProps, 'activeTeamName' | 'variantSeed' | 'onComplete'>) {
  const role = chooseVariant(actRoles, variantSeed); const [roleShown, setRoleShown] = useState(false); const [answer, setAnswer] = useState<string | null>(null); const [feedback, setFeedback] = useState('')
  const check = () => answer === role.contribution ? onComplete({ points: 10, token: 'cooperation', message: 'Great teamwork! You named both the role and the contribution.', discovered: [role.role] }) : setFeedback('Think about what people rely on this role to keep working.')
  return <ChallengeFrame label="★" title="Act It Out" instruction={`${activeTeamName}, use a real-world action, then connect it to a contribution.`}>
    {!roleShown ? <div className="act-stage"><span aria-hidden="true">🎭</span><h3>30-second team moment</h3><p>Pass the screen to the acting team. They should show the role without saying its name.</p><button type="button" className="primary-action" onClick={() => setRoleShown(true)}>Reveal role to acting team</button></div> : <div className="act-stage revealed"><p className="eyebrow">Act this out</p><h3>{role.role}</h3><p>Other team: guess the role. Then everyone chooses the contribution it makes.</p><div className="choice-pills">{role.options.map(option => <button type="button" className={answer === option ? 'chosen' : ''} onClick={() => setAnswer(option)} key={option}>{option}</button>)}</div><button type="button" className="primary-action" disabled={!answer} onClick={check}>Check contribution</button></div>}{feedback && <p className="feedback-note" aria-live="polite">{feedback}</p>}
  </ChallengeFrame>
}

function HiddenWorkChallenge({ activeTeamName, onComplete }: Pick<ChallengePanelProps, 'activeTeamName' | 'onComplete'>) {
  const [selected, setSelected] = useState<string[]>([]); const [revealed, setRevealed] = useState(false)
  const toggle = (role: string) => setSelected(current => current.includes(role) ? current.filter(item => item !== role) : [...current, role])
  return <ChallengeFrame label="◈" title="Look Closer" instruction={`${activeTeamName}, choose work that can be less visible but still helps the community function.`}>
    <div className="normal-view"><span aria-hidden="true">🏫 🏥 🧺</span><p>At first, we might notice teachers, doctors and shopkeepers. What work might be happening in the background?</p></div><div className="hidden-grid">{hiddenWork.map(role => <button type="button" key={role} onClick={() => toggle(role)} className={selected.includes(role) ? 'selected' : ''}>{selected.includes(role) ? '✓ ' : ''}{role}</button>)}</div>
    {!revealed ? <button type="button" className="primary-action" disabled={selected.length < 3} onClick={() => setRevealed(true)}>Look closer</button> : <div className="reveal-note"><p><b>Look closer:</b> Cleaning, maintenance, transport, repair, care, organisation, cooking and support all help communities function.</p><button type="button" className="primary-action" onClick={() => onComplete({ points: 15, token: 'community', message: 'You noticed essential work happening in the background.', hiddenWork: selected.length, discovered: selected, recognition: 'Hidden Work Spotter' })}>Add to community report</button></div>}
  </ChallengeFrame>
}

function CrisisChallenge({ activeTeamName, variantSeed, onComplete }: Pick<ChallengePanelProps, 'activeTeamName' | 'variantSeed' | 'onComplete'>) {
  const scenario = chooseVariant(crisisScenarios, variantSeed); const options = useMemo(() => [...scenario.plan, ...scenario.distractors], [scenario]); const [plan, setPlan] = useState<string[]>([]); const [feedback, setFeedback] = useState('')
  const add = (task: string) => setPlan(current => current.includes(task) ? current.filter(item => item !== task) : current.length === 3 ? current : [...current, task])
  const solve = () => plan.join('|') === scenario.plan.join('|') ? onComplete({ points: 25, token: 'community', message: `Community restored! ${scenario.explanation}`, problems: 2, discovered: ['Transport', 'Repair', 'Maintenance', 'Care'], recognition: 'Community Planner' }) : setFeedback(`Think about the connections. ${scenario.explanation}`)
  return <ChallengeFrame label="⚑" title="The Community Needs You" instruction={`${activeTeamName}, build a three-step plan. Each decision affects the next.`}>
    <div className="crisis-strip">{scenario.alerts.map(alert => <span key={alert}>{alert}</span>)}</div><h3 className="prompt">What should happen first, next, and then?</h3><div className="plan-slots">{[0, 1, 2].map(index => <div key={index} className="plan-slot"><b>{index + 1}</b><span>{plan[index] || 'Choose a response'}</span></div>)}</div><div className="choice-pills">{options.map(option => <button type="button" key={option} onClick={() => add(option)} className={plan.includes(option) ? 'chosen' : ''}>{plan.includes(option) ? '✓ ' : ''}{option}</button>)}</div><button type="button" className="primary-action" disabled={plan.length !== 3} onClick={solve}>Restore the community</button>{feedback && <p className="feedback-note" aria-live="polite">{feedback}</p>}
  </ChallengeFrame>
}

export function ChallengePanel({ type, ...props }: ChallengePanelProps) {
  switch (type) {
    case 'quiz': return <QuizChallenge {...props} />
    case 'connect': return <ConnectChallenge {...props} />
    case 'chain': return <WorkChainChallenge {...props} />
    case 'whatIf': return <WhatIfChallenge {...props} />
    case 'detective': return <DetectiveChallenge {...props} />
    case 'act': return <ActItOutChallenge {...props} />
    case 'hidden': return <HiddenWorkChallenge {...props} />
    case 'crisis': return <CrisisChallenge {...props} />
  }
}
