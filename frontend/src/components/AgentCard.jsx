export default function AgentCard({ agent, onOpen }) {
  const isTool = agent.catalogKind === 'Tool'
  const markerLabel = isTool ? 'Tool' : 'Agent'

  return (
    <article className="agent-card">
      <div className="agent-card-header">
        <div>
          <span className={`catalog-marker ${isTool ? 'tool' : 'agent'}`}>{markerLabel}</span>
          <p className="eyebrow">{agent.type}</p>
          <h3>{agent.name}</h3>
        </div>
        <span className={`status ${agent.status.toLowerCase()}`}>{agent.status}</span>
      </div>
      <p>{agent.summary}</p>
      <div className="metric-row">
        <span>{agent.accuracy}% quality</span>
        <span>{agent.latency} latency</span>
        <span>{agent.runs} runs</span>
      </div>
      <button className="secondary-action" onClick={() => onOpen?.(agent)} type="button">
        View details
      </button>
    </article>
  )
}
