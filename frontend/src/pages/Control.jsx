import '../App.css'

function normalizeStatus(status) {
  return String(status || '').toLowerCase()
}

function SummaryIcon({ kind }) {
  if (kind === 'queue') {
    return (
      <svg aria-hidden="true" className="monitor-icon-svg" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 9.5h8M8 12.5h8M8 15.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    )
  }

  if (kind === 'approved') {
    return (
      <svg aria-hidden="true" className="monitor-icon-svg" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="m8.6 12.3 2.2 2.2 4.6-4.6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    )
  }

  if (kind === 'pending') {
    return (
      <svg aria-hidden="true" className="monitor-icon-svg" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8.6v3.8l2.5 1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="monitor-icon-svg" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9.1 9.1 5.8 5.8M14.9 9.1l-5.8 5.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}

export default function Control({ agents = [], onUpdateStatus }) {
  const liveAgents = agents.filter((agent) => normalizeStatus(agent.status) === 'live').length
  const reviewAgents = agents.filter((agent) => normalizeStatus(agent.status) === 'review').length
  const downAgents = agents.filter((agent) => normalizeStatus(agent.status) === 'down').length

  const handleApprove = (agentId) => onUpdateStatus(agentId, 'Live')
  const handleReject = (agentId) => onUpdateStatus(agentId, 'Down')

  return (
    <main className="view control-view">
      <section className="page-intro dashboard-intro control-intro">
        <p className="eyebrow">Admin control</p>
        <h2>Govern agent release decisions.</h2>
        <p>Approve access, enforce ownership checks, and protect production readiness.</p>

        <div className="dashboard-summary-row control-summary-row">
          <div className="dashboard-summary-card monitor-summary-card control-summary-card">
            <span className="dashboard-summary-icon monitor-summary-icon" aria-hidden="true"><SummaryIcon kind="queue" /></span>
            <div className="monitor-summary-copy">
              <span>Queue</span>
              <strong>{agents.length}</strong>
            </div>
          </div>
          <div className="dashboard-summary-card monitor-summary-card control-summary-card">
            <span className="dashboard-summary-icon monitor-summary-icon" aria-hidden="true"><SummaryIcon kind="approved" /></span>
            <div className="monitor-summary-copy">
              <span>Approved</span>
              <strong>{liveAgents}</strong>
            </div>
          </div>
          <div className="dashboard-summary-card monitor-summary-card control-summary-card">
            <span className="dashboard-summary-icon monitor-summary-icon" aria-hidden="true"><SummaryIcon kind="pending" /></span>
            <div className="monitor-summary-copy">
              <span>Pending</span>
              <strong>{reviewAgents}</strong>
            </div>
          </div>
          <div className="dashboard-summary-card monitor-summary-card control-summary-card">
            <span className="dashboard-summary-icon monitor-summary-icon" aria-hidden="true"><SummaryIcon kind="rejected" /></span>
            <div className="monitor-summary-copy">
              <span>Rejected</span>
              <strong>{downAgents}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="table-wrap control-table-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Admin queue</p>
            <h2>Agents awaiting oversight</h2>
          </div>
          <div className="agents-count">{agents.length} agents</div>
        </div>

        <table className="agents-table control-table">
          <thead>
            <tr>
              <th>Agent</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => {
              const normalizedStatus = normalizeStatus(agent.status)
              return (
                <tr key={agent.id}>
                  <td>
                    <div className="agent-name-cell">
                      <div className="agent-avatar">{agent.name.charAt(0)}</div>
                      <div>
                        <div className="agent-title">{agent.name}</div>
                        <div className="agent-id">id: {agent.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{agent.owner}</td>
                  <td>{agent.type}</td>
                  <td>
                    <span className={`status ${normalizedStatus === 'live' ? 'live' : normalizedStatus === 'review' ? 'review' : normalizedStatus === 'down' ? 'down' : ''}`}>
                      {normalizedStatus}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="approve-btn"
                        disabled={normalizedStatus === 'live'}
                        onClick={() => handleApprove(agent.id)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="disapprove-btn"
                        disabled={normalizedStatus === 'down'}
                        onClick={() => handleReject(agent.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </main>
  )
}