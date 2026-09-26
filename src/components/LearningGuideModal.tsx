import { useEffect, useState } from 'react'

interface LearningGuideModalProps {
  isOpen: boolean
  initialTab?: 'concepts' | 'careers' | 'tokens'
  onClose: () => void
}

interface CareerCard {
  title: string
  role: string
  icon: string
  category: string
  importance: string
  quote: string
}

const CAREERS: CareerCard[] = [
  {
    title: 'Farmer',
    role: 'Food Production',
    icon: '🌱',
    category: 'EFFORT',
    importance: 'Sows seeds, nurtures crops, and harvests food for the entire population. Without farming, life cannot be sustained.',
    quote: '"The soil feeds the world through patience and toil."',
  },
  {
    title: 'Sanitation Worker',
    role: 'Public Hygiene & Health',
    icon: '🧹',
    category: 'PEOPLE',
    importance: 'Clears waste, keeps streets clean, and prevents deadly disease outbreaks. An essential pillar of public health.',
    quote: '"Every clean street is the gift of unseen care."',
  },
  {
    title: 'Teacher',
    role: 'Education & Mentorship',
    icon: '✏️',
    category: 'SKILLS',
    importance: 'Shapes minds, teaches foundational reading, science, ethics, and prepares the next generation for all kinds of work.',
    quote: '"Knowledge unlocks every door in a community."',
  },
  {
    title: 'Nurse & Doctor',
    role: 'Healthcare & Healing',
    icon: '✚',
    category: 'PEOPLE',
    importance: 'Diagnoses ailments, treats injuries, and cares for community members during illness or emergencies.',
    quote: '"Care and compassion restore hope and strength."',
  },
  {
    title: 'Factory Maker / Artisan',
    role: 'Manufacturing & Tools',
    icon: '🏭',
    category: 'SKILLS',
    importance: 'Transforms raw materials into clothes, utensils, machines, medicines, and daily necessities.',
    quote: '"Skillful hands shape the tools that build our cities."',
  },
  {
    title: 'Shopkeeper / Trader',
    role: 'Distribution & Fair Exchange',
    icon: '🛒',
    category: 'COMMUNITY',
    importance: 'Makes goods accessible within walking distance, connects distant producers with families.',
    quote: '"Commerce connects the farm and workshop to your doorstep."',
  },
  {
    title: 'Caregiver & Homemaker',
    role: 'Foundational Care',
    icon: '🏡',
    category: 'COMMUNITY',
    importance: 'Cooks, cleans, raises children, and looks after elderly relatives. Unpaid yet indispensable labor.',
    quote: '"Love and care create the foundation for all outside labor."',
  },
  {
    title: 'Soldier',
    role: 'National Defense & Security',
    icon: '🛡️',
    category: 'PEOPLE',
    importance: 'Serves in the armed forces to protect national sovereignty, maintain peace, and assist during crises.',
    quote: '"Courage and duty safeguard our freedom and security."',
  },
  {
    title: 'Entrepreneur',
    role: 'Enterprise & Innovation',
    icon: '💡',
    category: 'SKILLS',
    importance: 'Launches new business ventures, takes risks for profit, introduces innovations, and creates employment.',
    quote: '"Initiative and resilience turn ideas into community value."',
  },
]

export function LearningGuideModal({ isOpen, initialTab = 'concepts', onClose }: LearningGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'concepts' | 'careers' | 'tokens'>(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="learning-guide-dialog"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
        <header className="guide-header">
          <div className="guide-header-title">
            <span className="guide-icon" aria-hidden="true">📖</span>
            <div>
              <p className="eyebrow">Grade 6 Social Science • Chapter 13</p>
              <h2 id="guide-modal-title">The Value of Work Handbook</h2>
            </div>
          </div>
          <button type="button" className="guide-close-btn" onClick={onClose} aria-label="Close guide">
            ✕
          </button>
        </header>

        {/* Tab switcher */}
        <nav className="guide-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'concepts'}
            className={activeTab === 'concepts' ? 'active' : ''}
            onClick={() => setActiveTab('concepts')}
          >
            📚 Core Concepts
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'careers'}
            className={activeTab === 'careers' ? 'active' : ''}
            onClick={() => setActiveTab('careers')}
          >
            👥 Work in Our Community
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tokens'}
            className={activeTab === 'tokens' ? 'active' : ''}
            onClick={() => setActiveTab('tokens')}
          >
            ✦ Token Codex
          </button>
        </nav>

        <div className="guide-body">
          {activeTab === 'concepts' && (
            <div className="guide-content-tab">
              <article className="concept-card">
                <h3>1. Economic vs. Non-Economic Activities</h3>
                <p>
                  <strong>Economic activities</strong> are performed in exchange for money, wages, or profit (such as teaching, trade, soldiering, entrepreneurship, and manufacturing). <strong>Non-economic activities</strong> are done out of love, care, or duty without expecting payment (such as cooking family meals, caregiving, tutoring children at home, and community service).
                </p>
              </article>

              <article className="concept-card">
                <h3>2. "Work is Worship" &amp; Dignity of Labour</h3>
                <p>
                  In the chapter, work is compared to the spiritual act of <strong>worship</strong>. The <strong>dignity of labour</strong> teaches that all honest work — whether manual, technical, or intellectual — deserves equal respect, value, and consideration. No honest task is inferior or superior.
                </p>
              </article>

              <article className="concept-card">
                <h3>3. Interdependence &amp; Division of Labour</h3>
                <p>
                  No individual can produce everything alone. Through the <strong>division of labour</strong>, different people specialize in specific tasks (farming, transport, repair, medicine, education). We all rely on each other in an interconnected web of work.
                </p>
              </article>

              <article className="concept-card">
                <h3>4. Invisible &amp; Unpaid Household Labour</h3>
                <p>
                  <strong>Homemakers</strong> and caregivers provide foundational labor that sustains families and society without receiving a monetary wage. Recognizing and respecting this invisible care work is vital to appreciating the true value of work.
                </p>
              </article>

              <article className="concept-card">
                <h3>5. Trade, Business &amp; The Ripple Effect</h3>
                <p>
                  <strong>Trade</strong> and <strong>business</strong> circulate goods and services to where they are needed. When any link in this chain breaks — like transport or sanitation stopping — the ripple effect is felt across schools, clinics, and homes.
                </p>
              </article>
            </div>
          )}

          {activeTab === 'careers' && (
            <div className="guide-careers-grid">
              {CAREERS.map(c => (
                <div key={c.title} className="career-card">
                  <div className="career-card-top">
                    <span className="career-icon" aria-hidden="true">{c.icon}</span>
                    <div>
                      <h4>{c.title}</h4>
                      <small className="career-role">{c.role}</small>
                    </div>
                    <span className={`career-badge ${c.category.toLowerCase()}`}>{c.category}</span>
                  </div>
                  <p className="career-importance">{c.importance}</p>
                  <blockquote className="career-quote">{c.quote}</blockquote>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="guide-tokens-tab">
              <div className="token-def-card">
                <span className="token-symbol work">✦</span>
                <div>
                  <h4>Work Token</h4>
                  <p>Awarded for identifying primary production and practical labor that creates goods.</p>
                </div>
              </div>
              <div className="token-def-card">
                <span className="token-symbol skill">◆</span>
                <div>
                  <h4>Skill Token</h4>
                  <p>Recognizes specialised technical knowledge, craft precision, and problem-solving.</p>
                </div>
              </div>
              <div className="token-def-card">
                <span className="token-symbol connection">⛓</span>
                <div>
                  <h4>Connection Token</h4>
                  <p>Earned by mapping supply chains, transport links, and understanding the ripple effect.</p>
                </div>
              </div>
              <div className="token-def-card">
                <span className="token-symbol cooperation">♧</span>
                <div>
                  <h4>Cooperation Token</h4>
                  <p>Celebrates collaborative team efforts, empathy, and collective negotiation.</p>
                </div>
              </div>
              <div className="token-def-card">
                <span className="token-symbol community">♥</span>
                <div>
                  <h4>Community Token</h4>
                  <p>Granted when public health, invisible care, and collective wellbeing are protected.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="guide-footer">
          <p className="guide-tip">💡 Tip: Encourage students to discuss how each concept appears in their own neighbourhood!</p>
          <button type="button" className="primary-action" onClick={onClose}>
            Back to Game →
          </button>
        </footer>
      </div>
    </div>
  )
}
