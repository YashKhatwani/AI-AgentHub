import { useEffect, useState } from 'react'
import { getAgents, getAlerts } from '../data/monitoring'

function SeverityPill({ severity }) {
  return <span className={`severity-pill ${severity}`}>{severity.toUpperCase()}</span>
}

function SummaryIcon({ kind }) {
  if (kind === 'total') {
    return (
      <svg aria-hidden="true" className="monitor-icon-svg" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    )
  }

  if (kind === 'live') {
    return (
      <svg aria-hidden="true" className="monitor-icon-svg" viewBox="0 0 24 24" fill="none">
        <path d="M4 19h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="m6.5 16.5 3.5-4 3 2.5 4.5-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    )
  }

  if (kind === 'review') {
    return (
      <svg aria-hidden="true" className="monitor-icon-svg" viewBox="0 0 24 24" fill="none">
        <rect height="10" rx="2" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="11" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="monitor-icon-svg" viewBox="0 0 24 24" fill="none">
      <path d="M12 5.5 19 18H5L12 5.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M12 10v3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="16.6" r="1" fill="currentColor" />
    </svg>
  )
}

export default function Monitor() {
  const [agents, setAgents] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadAll() {
      setLoading(true)
      const [ag, al] = await Promise.all([getAgents(), getAlerts()])
      if (!mounted) return
      setAgents(ag)
      setAlerts(al)
      setLoading(false)
    }

    loadAll()

    // poll alerts every 10s
    const t = setInterval(async () => {
      const al = await getAlerts()
      if (!mounted) return
      setAlerts(al)
    }, 10000)

    return () => {
      mounted = false
      clearInterval(t)
    }
  }, [])

  const liveAgents = agents.filter((a) => a.status === 'live').length
  const reviewAgents = agents.filter((a) => a.status === 'review').length
  const downAgents = agents.filter((a) => a.status === 'down').length

  return (
    <main className="view monitor-view">
      <section className="page-intro dashboard-intro monitor-intro">
        <p className="eyebrow">Monitor</p>
        <h2>Track agent health, reliability, and exceptions in real time.</h2>
        <p>Monitor deployment state, review queues, and active alerts from one operational view.</p>
        <div className="dashboard-summary-row monitor-summary-row">
          <div className="dashboard-summary-card monitor-summary-card">
            <span className="dashboard-summary-icon monitor-summary-icon" aria-hidden="true"><SummaryIcon kind="total" /></span>
            <div className="monitor-summary-copy">
              <span>Total agents</span>
              <strong>{loading ? '...' : agents.length}</strong>
            </div>
          </div>
          <div className="dashboard-summary-card monitor-summary-card">
            <span className="dashboard-summary-icon monitor-summary-icon" aria-hidden="true"><SummaryIcon kind="live" /></span>
            <div className="monitor-summary-copy">
              <span>Live</span>
              <strong>{loading ? '...' : liveAgents}</strong>
            </div>
          </div>
          <div className="dashboard-summary-card monitor-summary-card">
            <span className="dashboard-summary-icon monitor-summary-icon" aria-hidden="true"><SummaryIcon kind="review" /></span>
            <div className="monitor-summary-copy">
              <span>Review</span>
              <strong>{loading ? '...' : reviewAgents}</strong>
            </div>
          </div>
          <div className="dashboard-summary-card monitor-summary-card">
            <span className="dashboard-summary-icon monitor-summary-icon" aria-hidden="true"><SummaryIcon kind="down" /></span>
            <div className="monitor-summary-copy">
              <span>Down</span>
              <strong>{loading ? '...' : downAgents}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="two-column monitor-layout">
        <div className="table-wrap wide-section monitor-table-wrap">
          <div className="section-heading">
            <h2>Agents</h2>
            <div className="agents-count">{loading ? 'Loading…' : `${agents.length} agents`}</div>
          </div>

          <table className="agents-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Status</th>
                <th>Uptime</th>
                <th>Tasks/hr</th>
                <th>Cloned by</th>
              </tr>
            </thead>
            <tbody>
              {!loading && agents.length === 0 && (
                <tr>
                  <td colSpan={5} className="agents-empty-row">No agents found.</td>
                </tr>
              )}
              {agents.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="agent-name-cell">
                      <div className="agent-avatar">
                        {a.name.charAt(0)}
                      </div>
                      <div>
                        <div className="agent-title">{a.name}</div>
                        <div className="agent-id">id: {a.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${a.status === 'live' ? 'live' : a.status === 'review' ? 'review' : a.status === 'down' ? 'down' : ''}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>{a.uptime}</td>
                  <td>{a.tasksPerHour}</td>
                  <td>{Number.isInteger(a.clonedBy) ? a.clonedBy : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="wide-section review-list monitor-alerts" aria-label="Live alerts">
          <label>
            <div className="alerts-header-row">
              <strong>Live alerts</strong>
              <span className="alerts-count">{alerts.length} open</span>
            </div>
          </label>

          <div className="alerts-list-body">
            {alerts.length === 0 && <div className="alerts-empty">No active alerts.</div>}
            {alerts.map((al) => (
              <div key={al.id} className="alert-item">
                <div className="alert-severity-slot">
                  <SeverityPill severity={al.severity} />
                </div>
                <div className="alert-copy">
                  <div className="alert-message">{al.message}</div>
                  <div className="alert-meta">
                    {al.agent} • {new Date(al.time).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
