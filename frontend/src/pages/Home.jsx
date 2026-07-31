import { useMemo, useState } from 'react'
import '../App.css'
import AgentCard from '../components/AgentCard'

function PromptBar({ placeholder = 'Ask about agent health, ownership, spend, or next actions' }) {
  const [prompt, setPrompt] = useState('')
  return (
    <form className="prompt-bar" onSubmit={(e) => e.preventDefault()}>
      <input aria-label="Agent prompt" placeholder={placeholder} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button type="submit">Ask</button>
    </form>
  )
}

export default function Home({ setActiveView, openAgent, agents = [] }) {
  const featuredTools = useMemo(() => {
    const seen = new Set()
    const tools = []

    for (const agent of agents) {
      for (const tool of agent.tools || []) {
        if (!tool?.id || seen.has(tool.id)) continue
        seen.add(tool.id)
        tools.push({
          id: tool.id,
          name: tool.name,
          catalogKind: 'Tool',
          type: 'Tool',
          status: 'Live',
          owner: agent.owner || 'Operations',
          summary: tool.description || 'No description available.',
          accuracy: 0,
          latency: 'N/A',
          runs: 'N/A',
          cost: '$0',
          skills: [],
          integrations: [],
        })
      }
    }

    return tools.slice(0, 3)
  }, [agents])

  return (
    <main className="view">
      <section className="hero-panel">
        <div className="hero-copy">
          <h2>Run trusted AI agents in one place.</h2>
          <PromptBar />
          <div className="quick-actions">
            <button onClick={() => setActiveView('discover')} type="button">Explore catalog</button>
            <button onClick={() => setActiveView('create')} type="button">Start new agent</button>
            <button onClick={() => setActiveView('monitor')} type="button">Open monitoring</button>
          </div>
        </div>
        <div className="hero-visual" aria-label="Animated agent operations network">
          <div className="hero-grid-overlay" aria-hidden="true" />
          <div className="hero-visual-glow" aria-hidden="true" />
          <div className="hero-scanline" aria-hidden="true" />
          <div className="hero-orb orb-a" aria-hidden="true" />
          <div className="hero-orb orb-b" aria-hidden="true" />

          <div className="hero-network" aria-hidden="true">
            <span className="network-ring ring-1" />
            <span className="network-ring ring-2" />
            <span className="network-ring ring-3" />

            <span className="network-link link-1" />
            <span className="network-link link-2" />
            <span className="network-link link-3" />

            <span className="network-node node-core" />
            <span className="network-node node-1" />
            <span className="network-node node-2" />
            <span className="network-node node-3" />

            <span className="network-pulse pulse-1" />
          </div>

          <p className="hero-caption">Real-time agent orchestration</p>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow featured-eyebrow">Featured agents</p>
          <h2 className="featured-title">Recommended agents for your workflow</h2>
        </div>
        <button className="text-action" onClick={() => setActiveView('discover')} type="button">Browse all</button>
      </section>

      <div className="agent-grid">
        {agents.map((agent) => (
          <AgentCard agent={agent} key={agent.id} onOpen={openAgent} />
        ))}
      </div>

      <section className="section-heading">
        <div>
          <p className="eyebrow featured-eyebrow">Featured tools</p>
          <h2 className="featured-title">High-impact tools used by top agents</h2>
        </div>
        <button className="text-action" onClick={() => setActiveView('discover')} type="button">Browse all</button>
      </section>

      <div className="agent-grid">
        {featuredTools.map((tool) => (
          <AgentCard agent={tool} key={tool.id} onOpen={openAgent} />
        ))}
      </div>
    </main>
  )
}
