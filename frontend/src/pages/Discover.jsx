import { useEffect, useMemo, useState } from 'react'
import AgentCard from '../components/AgentCard'
import initialAgents from '../data/agents'

const catalogFilterOptions = ['All', 'Agents', 'Tools']

function mapBackendAgent(agent) {
  return {
    id: agent.id,
    name: agent.name,
    catalogKind: 'Agent',
    type: agent.category || 'Assistant',
    status: agent.status || 'Live',
    owner: agent.owner || 'Operations',
    summary: agent.description || 'No description available.',
    accuracy: 90,
    latency: '2.5s',
    runs: '0',
    cost: '$0',
    skills: [],
    integrations: [],
  }
}

function mapBackendTool(tool) {
  return {
    id: tool.id,
    name: tool.name,
    catalogKind: 'Tool',
    type: 'Tool',
    status: tool.status || 'Live',
    owner: tool.owner || 'Operations',
    summary: tool.description || 'No description available.',
    accuracy: 0,
    latency: 'N/A',
    runs: 'N/A',
    cost: '$0',
    skills: [],
    integrations: [],
  }
}

function extractLocalTools(agentList) {
  const seen = new Set()
  const tools = []
  for (const agent of agentList) {
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
  return tools
}

export default function Discover({ openAgent }) {
  const [query, setQuery] = useState('')
  const [catalogFilter, setCatalogFilter] = useState('All')
  const [catalogItems, setCatalogItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadCatalog() {
      setLoading(true)
      setError('')
      try {
        const [agentsResponse, toolsResponse] = await Promise.allSettled([
          fetch('http://127.0.0.1:8000/agents'),
          fetch('http://127.0.0.1:8000/tools'),
        ])

        let agentItems = []
        let toolItems = []

        if (agentsResponse.status === 'fulfilled' && agentsResponse.value.ok) {
          const agentData = await agentsResponse.value.json()
          if (Array.isArray(agentData)) {
            agentItems = agentData.map(mapBackendAgent)
          }
        }

        if (toolsResponse.status === 'fulfilled' && toolsResponse.value.ok) {
          const toolData = await toolsResponse.value.json()
          if (Array.isArray(toolData)) {
            toolItems = toolData.map(mapBackendTool)
          }
        }

        if (!agentItems.length) {
          agentItems = initialAgents.map((agent) => ({ ...agent, catalogKind: 'Agent' }))
        }

        if (!toolItems.length) {
          toolItems = extractLocalTools(initialAgents)
        }

        if (!mounted) return
        setCatalogItems([...agentItems, ...toolItems])
      } catch (err) {
        if (!mounted) return
        const fallbackAgents = initialAgents.map((agent) => ({ ...agent, catalogKind: 'Agent' }))
        const fallbackTools = extractLocalTools(initialAgents)
        setCatalogItems([...fallbackAgents, ...fallbackTools])
        setError('')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadCatalog()

    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalogItems.filter((item) => {
      if (catalogFilter === 'Agents' && item.catalogKind !== 'Agent') return false
      if (catalogFilter === 'Tools' && item.catalogKind !== 'Tool') return false
      if (!q) return true
      if (item.name.toLowerCase().includes(q)) return true
      if (item.summary && item.summary.toLowerCase().includes(q)) return true
      if (item.skills && item.skills.join(' ').toLowerCase().includes(q)) return true
      return false
    })
  }, [query, catalogFilter, catalogItems])

  const discoverStats = useMemo(() => {
    if (!filtered.length) {
      return [
        { label: 'Live now', value: '0' },
        { label: 'Avg quality', value: '0%' },
        { label: 'Owner teams', value: '0' },
      ]
    }

    const liveCount = filtered.filter((agent) => agent.status === 'Live').length
    const avgAccuracy = Math.round(
      filtered.reduce((sum, agent) => sum + Number(agent.accuracy || 0), 0) / filtered.length,
    )
    const ownerTeams = new Set(filtered.map((agent) => agent.owner)).size

    return [
      { label: 'Live now', value: String(liveCount) },
      { label: 'Avg quality', value: `${avgAccuracy}%` },
      { label: 'Owner teams', value: String(ownerTeams) },
    ]
  }, [filtered])

  const activeFilterLabel =
    catalogFilter === 'All' ? 'all catalog items' : `${catalogFilter.toLowerCase()} only`

  return (
    <main className="view discover-view">
      <section className="page-intro discover-intro">
        <div className="discover-intro-copy">
          <p className="eyebrow">Agent catalog</p>
          <h2>Choose the right agent for each workflow.</h2>
          <p>Search by capability, filter by category, and review detailed specs in one streamlined flow.</p>
        </div>
        <div className="discover-intro-spacer" aria-hidden="true" />
      </section>

      <section className="discover-toolbar" aria-label="Discover filters and search">
        <div className="prompt-bar discover-search">
          <input
            aria-label="Search agents"
            placeholder="Search by name, summary, or capabilities"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" onClick={() => setQuery('')}>Clear</button>
        </div>

        <div className="discover-toolbar-row">
          <div className="segmented discover-segmented" role="tablist" aria-label="Filter by type">
            {catalogFilterOptions.map((option) => (
              <button
                className={catalogFilter === option ? 'selected' : ''}
                key={option}
                onClick={() => setCatalogFilter(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <p className="discover-result-copy">
            Showing {filtered.length} of {catalogItems.length} for {activeFilterLabel}
          </p>
        </div>
      </section>

      <section className="discover-summary" aria-label="Discover overview">
        {discoverStats.map((item) => (
          <article className="discover-kpi" key={item.label}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <div className="agent-grid">
        {loading ? (
          <div className="empty-state">
            <p>Loading agents...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <section className="empty-state discover-empty" aria-live="polite">
            <h3>No results found</h3>
            <p>Try a broader search or switch the category filter.</p>
            <button
              className="secondary-action"
              onClick={() => {
                setQuery('')
                setCatalogFilter('All')
              }}
              type="button"
            >
              Reset filters
            </button>
          </section>
        ) : (
          filtered.map((item) => (
            <AgentCard key={item.id} agent={item} onOpen={openAgent} />
          ))
        )}
      </div>
    </main>
  )
}
