import { useEffect, useMemo, useState } from 'react'
import '../App.css'

export default function MyAgents({ openAgent, agents = [], owner = 'Operations', selectedAgentId }) {
  const currentUser = owner
  const myAgents = useMemo(() => agents.filter((a) => a.owner === currentUser), [agents, currentUser])
  const [selectedId, setSelectedId] = useState(myAgents[0]?.id ?? null)
  const selected = myAgents.find((a) => a.id === selectedId) ?? myAgents[0]

  useEffect(() => {
    if (selectedAgentId) {
      setSelectedId(selectedAgentId)
      return
    }
    if (!selectedId && myAgents.length > 0) {
      setSelectedId(myAgents[0].id)
    }
  }, [selectedAgentId, myAgents, selectedId])

  return (
    <main className="view two-column">
      <section className="page-intro">
        <p className="eyebrow">My agents</p>
        <h2>Manage, monitor, and configure agents you own.</h2>
        <p>Agents owned by <strong>{currentUser}</strong>. Data is currently local dummy data.</p>
      </section>

      <div className="wide-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">My agents</p>
            <h2>Manage, monitor, and configure agents you own.</h2>
          </div>
          <button className="primary-action" type="button">+ New Agent</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {myAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedId(agent.id)}
              style={{
                background: selectedId === agent.id ? 'rgba(66,79,90,0.04)' : '#fff',
                border: selectedId === agent.id ? '1px solid rgba(31,122,140,0.12)' : '1px solid var(--line)',
                borderRadius: 8,
                padding: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontWeight: 800 }}>{agent.name} <span style={{ color: 'var(--muted)', fontSize: 12 }}>v1.0.0</span></div>
                <div style={{ color: 'var(--muted)' }}>{agent.summary}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`status ${agent.status.toLowerCase()}`}>{agent.status}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>2 min ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="detail-panel">
        {selected ? (
          <div>
            <h3>{selected.name}</h3>
            <p style={{ color: 'var(--muted)' }}>{selected.summary}</p>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr', marginTop: 12 }}>
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: 12 }}>
                <p className="eyebrow">Tasks</p>
                <strong>8,340</strong>
              </div>
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: 12 }}>
                <p className="eyebrow">Uptime</p>
                <strong>99.9%</strong>
              </div>
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: 12 }}>
                <p className="eyebrow">Model</p>
                <strong>opus-4</strong>
              </div>
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: 12 }}>
                <p className="eyebrow">Author</p>
                <strong>{selected.owner}</strong>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <p className="eyebrow">AI Suggestions</p>
              <div className="prompt-bar" style={{ marginTop: 8 }}>
                <input placeholder="Suggest improvements for this" />
                <button type="button">Send</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="secondary-action" type="button">Review</button>
              <button className="primary-action" type="button">Build & Deploy</button>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--muted)' }}>Select an agent to view details.</div>
        )}
      </aside>
    </main>
  )
}
