const USE_API = true

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

function toBackendPayload(agent) {
  return {
    id: agent.id && agent.id.startsWith('draft-') ? `agent-${Date.now()}` : agent.id || `agent-${Date.now()}`,
    name: agent.name || 'New Agent',
    owner: agent.owner || 'Operations',
    category: agent.type || 'Assistant',
    status: (agent.status || 'Draft').toLowerCase() === 'draft' ? 'review' : agent.status,
    description: agent.summary || agent.prompt || 'Generated agent draft',
  }
}

function toFrontendAgent(agent) {
  return {
    id: agent.id,
    name: agent.name,
    type: agent.category || 'Assistant',
    status: agent.status || 'Live',
    owner: agent.owner || 'Operations',
    accuracy: 90,
    latency: '2.5s',
    runs: '0',
    cost: '$0',
    summary: agent.description || '',
    skills: [],
    tools: [],
    integrations: [],
  }
}

export async function generateAgentDraft(name, prompt) {
  await delay()
  return {
    id: `draft-${Date.now()}`,
    name: name || 'New Agent',
    type: 'Assistant',
    status: 'Draft',
    owner: 'Operations',
    summary: `Generated agent summary for ${name || 'this agent'} based on the prompt.`,
    prompt,
    accuracy: 90,
    latency: '2.5s',
    runs: '1.2k',
    cost: '$0',
    skills: ['Knowledge search', 'Workflow orchestration', 'Reporting'],
    tools: [
      {
        id: 'tool-search',
        name: 'Knowledge Search',
        description: 'Search internal and external information sources for answers.',
      },
      {
        id: 'tool-workflow',
        name: 'Workflow Orchestrator',
        description: 'Create and track tasks for agent workflows.',
      },
      {
        id: 'tool-report',
        name: 'Report Builder',
        description: 'Generate summaries and reports for stakeholders.',
      },
    ],
    integrations: ['Slack', 'ServiceNow', 'Confluence'],
  }
}

export async function saveAgent(agent) {
  await delay()
  if (USE_API) {
    const payload = toBackendPayload(agent)
    const response = await fetch('https://github-cloud-run-service-884188157680.europe-west1.run.app/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error('Failed to save agent')
    }
    const saved = await response.json()
    return toFrontendAgent(saved)
  }

  const generatedId = agent.id && agent.id.startsWith('draft-') ? `agent-${Date.now()}` : agent.id || `agent-${Date.now()}`
  return {
    ...agent,
    id: generatedId,
    status: 'Live',
  }
}

export async function createAgentVisualization(query) {
  await delay()

  const response = await fetch('https://github-cloud-run-service-884188157680.europe-west1.run.app/interact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate agent topology')
  }

  const payload = await response.json()
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid topology response')
  }

  return payload
}
