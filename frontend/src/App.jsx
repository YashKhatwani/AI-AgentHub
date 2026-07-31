import { useMemo, useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import Discover from './pages/Discover.jsx'
import CreateAgent from './pages/CreateAgent.jsx'
import AgentDetail from './pages/AgentDetail.jsx'
import AgentsList from './pages/AgentsList.jsx'
import MyAgents from './pages/MyAgents.jsx'
import Monitor from './pages/Monitor.jsx'
import Control from './pages/Control.jsx'
import initialAgents from './data/agents'

const defaultUser = 'Operations'

function NavIcon({ children }) {
  return (
    <svg aria-hidden="true" className="nav-icon-svg" fill="none" viewBox="0 0 24 24">
      {children}
    </svg>
  )
}

const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <NavIcon>
        <path d="M3 10.5 12 3l9 7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M5.5 9.5V21h13V9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </NavIcon>
    ),
  },
  {
    id: 'discover',
    label: 'Discover',
    icon: (
      <NavIcon>
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
        <path d="m16 16 5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </NavIcon>
    ),
  },
  {
    id: 'create',
    label: 'Create',
    icon: (
      <NavIcon>
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </NavIcon>
    ),
  },
  // {
  //   id: 'myagents',
  //   label: 'My Agents',
  //   icon: (
  //     <NavIcon>
  //       <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
  //       <path d="M5.5 19a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  //     </NavIcon>
  //   ),
  // },
  {
    id: 'monitor',
    label: 'Monitor',
    icon: (
      <NavIcon>
        <path d="M4 19h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="m6.5 16.5 3.5-4 3 2.5 4.5-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </NavIcon>
    ),
  },
  {
    id: 'control',
    label: 'Control',
    icon: (
      <NavIcon>
        <rect height="10" rx="2" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="11" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </NavIcon>
    ),
  },
]

const suggestions = [
  'Show agents that can help with control testing',
  'Create an onboarding assistant for platform teams',
  'Which agents are near budget limits?',
]

function DeutscheBankLogo() {
  return (
    <svg aria-hidden="true" className="db-logo" viewBox="0 0 48 48">
      <rect x="5" y="5" width="38" height="38" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M14 34 34 14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function TopBar() {
  return (
    <header className="top-bar">
      <div className="brand-wrap" aria-label="Application identity">
        <div className="brand-mark" aria-hidden="true">
          <DeutscheBankLogo />
        </div>
        <div>
          <p className="eyebrow">Agent operations platform</p>
          <h1>DB Agent System</h1>
        </div>
      </div>
    </header>
  )
}

function SideNav({ activeView, setActiveView, isCollapsed, setIsCollapsed }) {
  const handleNavItemClick = (nextView) => {
    setActiveView(nextView)
    setIsCollapsed(true)
  }

  return (
    <nav
      className={isCollapsed ? 'side-nav collapsed' : 'side-nav'}
      aria-label="Primary"
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {navItems.map(({ id, label, icon }) => (
        <button
          className={activeView === id ? 'nav-item active' : 'nav-item'}
          key={id}
          onClick={() => handleNavItemClick(id)}
          type="button"
        >
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}

// function PromptBar({ placeholder = 'Ask for agents, controls, owners, costs, or next actions' }) {
//   const [prompt, setPrompt] = useState('')

//   return (
//     <form className="prompt-bar" onSubmit={(event) => event.preventDefault()}>
//       <input
//         aria-label="Agent prompt"
//         onChange={(event) => setPrompt(event.target.value)}
//         placeholder={placeholder}
//         value={prompt}
//       />
//       <button type="submit">Ask</button>
//     </form>
//   )
// }

// function AgentCard({ agent, onOpen }) {
//   return (
//     <article className="agent-card">
//       <div className="agent-card-header">
//         <div>
//           <p className="eyebrow">{agent.type}</p>
//           <h3>{agent.name}</h3>
//         </div>
//         <span className={`status ${agent.status.toLowerCase()}`}>{agent.status}</span>
//       </div>
//       <p>{agent.summary}</p>
//       <div className="metric-row">
//         <span>{agent.accuracy}% quality</span>
//         <span>{agent.latency}</span>
//         <span>{agent.runs} runs</span>
//       </div>
//       <button className="secondary-action" onClick={() => onOpen(agent.id)} type="button">
//         Open specs
//       </button>
//     </article>
//   )
// }

// function HomeView({ setActiveView, openAgent, agents }) {
//   return (
//     <main className="view">
//       <section className="hero-panel">
//         <div className="hero-copy">
//           <p className="eyebrow">Home page</p>
//           <h2>Find, build, monitor, and control AI agents from one workspace.</h2>
//           <PromptBar />
//           <div className="quick-actions">
//             <button onClick={() => setActiveView('discover')} type="button">View agents</button>
//             <button onClick={() => setActiveView('create')} type="button">Create agent</button>
//             <button onClick={() => setActiveView('monitor')} type="button">Monitor agents</button>
//           </div>
//         </div>
//         <div className="hero-visual" aria-label="Agent platform overview">
//           <div className="flow-node main-node">Home</div>
//           <div className="flow-grid">
//             <span>Discover</span>
//             <span>Create</span>
//             <span>Monitor</span>
//             <span>Control</span>
//           </div>
//         </div>
//       </section>

//       <section className="section-heading">
//         <div>
//           <p className="eyebrow">Popular agents</p>
//           <h2>Recommended for your team</h2>
//         </div>
//         <button className="text-action" onClick={() => setActiveView('discover')} type="button">
//           Browse all
//         </button>
//       </section>
//       <div className="agent-grid">
//         {agents.map((agent) => (
//           <AgentCard agent={agent} key={agent.id} onOpen={openAgent} />
//         ))}
//       </div>
//     </main>
//   )
// }

// function DiscoverView({ openAgent, agents }) {
//   const [filter, setFilter] = useState('All')
//   const filteredAgents = agents.filter((agent) => filter === 'All' || agent.type === filter)

//   return (
//     <main className="view">
//       <section className="page-intro">
//         <p className="eyebrow">Agent / tool discovery</p>
//         <h2>Discover agent cards matched to your prompt.</h2>
//         <PromptBar placeholder="Describe the problem, workflow, or control you want covered" />
//       </section>
//       <div className="suggestion-row">
//         {suggestions.map((suggestion) => (
//           <button key={suggestion} type="button">{suggestion}</button>
//         ))}
//       </div>
//       <div className="segmented">
//         {['All', 'Control', 'Assistant', 'Analytics'].map((item) => (
//           <button
//             className={filter === item ? 'selected' : ''}
//             key={item}
//             onClick={() => setFilter(item)}
//             type="button"
//           >
//             {item}
//           </button>
//         ))}
//       </div>
//       <div className="agent-grid">
//         {filteredAgents.map((agent) => (
//           <AgentCard agent={agent} key={agent.id} onOpen={openAgent} />
//         ))}
//       </div>
//     </main>
//   )
// }

// function SpecsView({ selectedAgent }) {
//   return (
//     <main className="view two-column">
//       <section className="page-intro">
//         <p className="eyebrow">Agent / tool specs</p>
//         <h2>{selectedAgent.name}</h2>
//         <p>{selectedAgent.summary}</p>
//         <PromptBar placeholder={`Ask about ${selectedAgent.name} compatibility, data use, or ownership`} />
//       </section>
//       <aside className="detail-panel">
//         <h3>Specifications</h3>
//         <dl>
//           <dt>Owner</dt>
//           <dd>{selectedAgent.owner}</dd>
//           <dt>Status</dt>
//           <dd>{selectedAgent.status}</dd>
//           <dt>Monthly cost</dt>
//           <dd>{selectedAgent.cost}</dd>
//           <dt>Runtime</dt>
//           <dd>OpenShift service with managed prompts</dd>
//         </dl>
//       </aside>
//       <section className="wide-section">
//         <h3>Capabilities</h3>
//         <div className="chip-row">
//           {selectedAgent.skills.map((skill) => <span key={skill}>{skill}</span>)}
//         </div>
//         <h3>Connected systems</h3>
//         <div className="chip-row muted">
//           {selectedAgent.integrations.map((item) => <span key={item}>{item}</span>)}
//         </div>
//       </section>
//     </main>
//   )
// }

// function CreateView({ onCreate }) {
//   const [form, setForm] = useState({
//     name: '',
//     owner: 'Operations',
//     purpose: '',
//     access: false,
//     deployment: 'Managed',
//   })

//   const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }))

//   return (
//     <main className="view">
//       <section className="page-intro">
//         <p className="eyebrow">Create agent</p>
//         <h2>Register the agent details, then preview the owner page.</h2>
//         <PromptBar placeholder="Generate a draft agent from a use case or existing repo" />
//       </section>
//       <form className="create-form" onSubmit={(event) => {
//         event.preventDefault()
//         onCreate(form)
//       }}>
//         <label>
//           Agent name
//           <input
//             onChange={(event) => updateForm('name', event.target.value)}
//             placeholder="Exception Triage Agent"
//             value={form.name}
//           />
//         </label>
//         <label>
//           Owner team
//           <select onChange={(event) => updateForm('owner', event.target.value)} value={form.owner}>
//             <option>Operations</option>
//             <option>Controls</option>
//             <option>Data Office</option>
//             <option>Developer Platform</option>
//           </select>
//         </label>
//         <label className="full-field">
//           Purpose
//           <textarea
//             onChange={(event) => updateForm('purpose', event.target.value)}
//             placeholder="Describe the jobs this agent should perform"
//             value={form.purpose}
//           />
//         </label>
//         <label>
//           Deployment
//           <select onChange={(event) => updateForm('deployment', event.target.value)} value={form.deployment}>
//             <option>Managed</option>
//             <option>Private endpoint</option>
//             <option>Sandbox only</option>
//           </select>
//         </label>
//         <label className="toggle-field">
//           <input
//             checked={form.access}
//             onChange={(event) => updateForm('access', event.target.checked)}
//             type="checkbox"
//           />
//           Requires privileged access
//         </label>
//         <button className="primary-action full-field" type="submit">Create agent page</button>
//       </form>
//     </main>
//   )
// }

// function AgentPageView({ selectedAgent, setActiveView }) {
//   return (
//     <main className="view">
//       <section className="agent-page-header">
//         <div>
//           <p className="eyebrow">Agent page</p>
//           <h2>{selectedAgent.name}</h2>
//           <p>{selectedAgent.summary}</p>
//         </div>
//         <span className={`status ${selectedAgent.status.toLowerCase()}`}>{selectedAgent.status}</span>
//       </section>
//       <div className="operations-grid">
//         <button onClick={() => setActiveView('review')} type="button">
//           <strong>Review</strong>
//           <span>Approve version, owner, and prompt changes</span>
//         </button>
//         <button onClick={() => setActiveView('monitor')} type="button">
//           <strong>Monitoring</strong>
//           <span>Track subscriptions, performance, and spend</span>
//         </button>
//         <button onClick={() => setActiveView('control')} type="button">
//           <strong>Controls</strong>
//           <span>Manage access, developer support, and approvals</span>
//         </button>
//       </div>
//       <PromptBar placeholder={`Use ${selectedAgent.name} or ask a query about its output`} />
//     </main>
//   )
// }

// function ReviewView({ selectedAgent }) {
//   const reviewItems = ['Owner verified', 'Prompt policy aligned', 'Data sources approved']
//   return (
//     <main className="view">
//       <section className="page-intro">
//         <p className="eyebrow">Review agent</p>
//         <h2>Review and approve {selectedAgent.name}.</h2>
//         <PromptBar placeholder="Ask for missing approvals or risk summary" />
//       </section>
//       <div className="review-list">
//         {reviewItems.map((item, index) => (
//           <label key={item}>
//             <input defaultChecked={index < 2} type="checkbox" />
//             {item}
//           </label>
//         ))}
//       </div>
//       <div className="approval-actions">
//         <button className="secondary-action" type="button">Request changes</button>
//         <button className="primary-action" type="button">Approve release</button>
//       </div>
//     </main>
//   )
// }

// function MonitorView({ controlMode = false, agents }) {
//   const totalRuns = agents.reduce((sum, agent) => sum + Number(agent.runs.replace('k', '')) * 1000, 0)

//   return (
//     <main className="view">
//       <section className="page-intro">
//         <p className="eyebrow">{controlMode ? 'Control agent' : 'Monitor agent'}</p>
//         <h2>{controlMode ? 'Access, approvals, and developer support.' : 'Track agent specs, prompts, usage, and vulnerabilities.'}</h2>
//       </section>
//       <div className="monitor-grid">
//         <Metric title="Total runs" value={Intl.NumberFormat('en-US').format(totalRuns)} />
//         <Metric title="Open approvals" value="7" />
//         <Metric title="Avg quality" value="91%" />
//         <Metric title="Monthly spend" value="$494" />
//       </div>
//       <div className="table-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>Agent</th>
//               <th>Owner</th>
//               <th>Status</th>
//               <th>Quality</th>
//               <th>Cost</th>
//               <th>{controlMode ? 'Access' : 'Prompt version'}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agents.map((agent, index) => (
//               <tr key={agent.id}>
//                 <td>{agent.name}</td>
//                 <td>{agent.owner}</td>
//                 <td><span className={`status ${agent.status.toLowerCase()}`}>{agent.status}</span></td>
//                 <td>{agent.accuracy}%</td>
//                 <td>{agent.cost}</td>
//                 <td>{controlMode ? (index === 1 ? 'Restricted' : 'Standard') : `v${index + 3}.0`}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   )
// }

function Metric({ title, value }) {
  return (
    <div className="metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState('home')
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)
  const [previousView, setPreviousView] = useState('discover')
  const [agents, setAgents] = useState(initialAgents)
  const [selectedAgentId, setSelectedAgentId] = useState(initialAgents[0]?.id ?? null)
  const [selectedCatalogItem, setSelectedCatalogItem] = useState(initialAgents[0] ?? null)
  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? null,
    [selectedAgentId, agents],
  )

  const openAgent = (agentRef) => {
    const selected = typeof agentRef === 'string'
      ? agents.find((agent) => agent.id === agentRef) ?? null
      : agentRef

    setPreviousView(activeView)
    setSelectedCatalogItem(selected)
    setSelectedAgentId(selected?.id ?? (typeof agentRef === 'string' ? agentRef : null))
    setActiveView('specs')
  }

  const createAgent = (agent) => {
    setAgents((current) => [agent, ...current])
    setSelectedCatalogItem(agent)
    setSelectedAgentId(agent.id)
    setActiveView('myagents')
  }

  const detailItem = selectedCatalogItem || selectedAgent
  const updateAgentStatus = (agentId, nextStatus) => {
    setAgents((current) => current.map((agent) => (agent.id === agentId ? { ...agent, status: nextStatus } : agent)))
  }

  const renderView = () => {
    if (activeView === 'discover') return <Discover openAgent={openAgent} agents={agents} />
    if (activeView === 'create') return <CreateAgent onCreate={createAgent} />
    if (activeView === 'specs') return <AgentDetail selectedAgentId={selectedAgentId} selectedAgent={detailItem} onBack={() => setActiveView(previousView)} />
    if (activeView === 'agent') return <AgentDetail selectedAgentId={selectedAgentId} selectedAgent={detailItem} onBack={() => setActiveView(previousView)} setActiveView={setActiveView} />
    if (activeView === 'review') return <AgentDetail selectedAgentId={selectedAgentId} selectedAgent={detailItem} onBack={() => setActiveView(previousView)} />
    if (activeView === 'monitor') return <Monitor agents={agents} />
    if (activeView === 'control') return <Control agents={agents} onUpdateStatus={updateAgentStatus} />
    if (activeView === 'agents') return <AgentsList openAgent={openAgent} />
    if (activeView === 'myagents') return <MyAgents openAgent={openAgent} agents={agents} owner={defaultUser} selectedAgentId={selectedAgentId} />
    return <Home openAgent={openAgent} setActiveView={setActiveView} agents={agents} />
  }

  return (
    <div className={isNavCollapsed ? 'app-shell nav-collapsed' : 'app-shell'}>
      <SideNav
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isNavCollapsed}
        setIsCollapsed={setIsNavCollapsed}
      />
      <div className="workspace">
        <TopBar />
        <div className="workspace-main">{renderView()}</div>
      </div>
    </div>
  )
}

export default App
