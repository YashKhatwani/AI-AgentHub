import { useEffect, useMemo, useState } from 'react'

function mapBackendAgent(agent) {
  return {
    id: agent.id,
    name: agent.name,
    summary: agent.description || 'No data yet',
    description: agent.description || 'No description available.',
    owner: agent.owner || '-',
    status: agent.status || '-',
    cost: '$0',
    type: agent.category || 'Assistant',
    skills: agent.skills || [],
    tools: agent.tools || [],
    integrations: agent.integrations || [],
  }
}

function mapBackendTool(tool) {
  return {
    id: tool.id,
    catalogKind: 'Tool',
    name: tool.name,
    summary: tool.description || 'No data yet',
    description: tool.description || 'No description available.',
    owner: tool.owner || '-',
    status: tool.status || '-',
    cost: '$0',
    type: 'Tool',
    skills: [],
    tools: [],
    integrations: [],
  }
}

export default function AgentDetail({ selectedAgent, selectedAgentId, onBack }) {
  const [remoteAgent, setRemoteAgent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isToolSelected = selectedAgent?.catalogKind === 'Tool'

  useEffect(() => {
    if (!selectedAgentId) {
      setRemoteAgent(null)
      setError('')
      return
    }

    let mounted = true

    async function loadAgent() {
      setLoading(true)
      setError('')
      try {
        const endpoint = isToolSelected
          ? `/tools/${selectedAgentId}`
          : `/monitoring/agents/${selectedAgentId}`

        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error('Failed to load details')
        }
        const data = await response.json()
        if (!mounted) return
        setRemoteAgent(isToolSelected ? mapBackendTool(data) : mapBackendAgent(data))
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Unable to load details')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadAgent()

    return () => {
      mounted = false
    }
  }, [selectedAgentId, isToolSelected])

  const fallbackAgent = useMemo(() => {
    if (!selectedAgent) {
      return null
    }
    return {
      id: selectedAgent.id,
      catalogKind: selectedAgent.catalogKind || 'Agent',
      name: selectedAgent.name,
      summary: selectedAgent.summary || 'No data yet',
      description: selectedAgent.description || selectedAgent.summary || 'No description available.',
      owner: selectedAgent.owner || '-',
      status: selectedAgent.status || '-',
      cost: selectedAgent.cost || '$0',
      skills: selectedAgent.skills || [],
      tools: selectedAgent.tools || [],
      integrations: selectedAgent.integrations || [],
    }
  }, [selectedAgent])

  const agent = remoteAgent || fallbackAgent || {
    id: '-',
    catalogKind: 'Agent',
    name: 'Unknown agent',
    summary: 'No data yet',
    description: 'No description available.',
    owner: '-',
    status: '-',
    cost: '$0',
    skills: [],
    tools: [],
    integrations: [],
  }

  const skills = agent.skills ?? []
  const tools = agent.tools ?? []
  const integrations = agent.integrations ?? []
  const detailTitle = isToolSelected ? 'Tool Details' : 'Agent Details'
  const detailsLoadingCopy = isToolSelected ? 'Loading latest tool details...' : 'Loading latest agent details...'

  return (
    <main className="view two-column">
      <section className="page-intro">
        {onBack && (
          <button className="secondary-action" type="button" onClick={onBack} style={{ marginBottom: 12 }}>
            Back
          </button>
        )}
        <p className="eyebrow">{detailTitle}</p>
        <h2>{agent.name}</h2>
        <p>{agent.summary}</p>
        {loading && <p>{detailsLoadingCopy}</p>}
        {error && <p>{error}</p>}
      </section>
      <aside className="detail-panel">
        <h3>Specifications</h3>
        <dl>
          <dt>Owner</dt>
          <dd>{agent.owner ?? '—'}</dd>
          <dt>Status</dt>
          <dd>{agent.status ?? '—'}</dd>
          <dt>Monthly cost</dt>
          <dd>{agent.cost ?? '—'}</dd>
          <dt>{isToolSelected ? 'Type' : 'Runtime'}</dt>
          <dd>{isToolSelected ? 'Tool component' : 'OpenShift service with managed prompts'}</dd>
        </dl>
      </aside>
      <section className="wide-section">
        <h3>Description</h3>
        <p>{agent.description ?? agent.summary ?? 'No description available.'}</p>

        {!isToolSelected && (
          <>
            <h3>Capabilities</h3>
            <div className="chip-row">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </>
        )}

        {!isToolSelected && (
          <>
            <h3>Tools</h3>
            <div className="tool-list">
              {tools.map((tool) => (
                <div className="tool-list-item" key={tool.id}>
                  <p className="tool-name">{tool.name}</p>
                  <p className="tool-description">{tool.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {!isToolSelected && (
          <>
            <h3>Connected systems</h3>
            <div className="chip-row muted">
              {integrations.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
