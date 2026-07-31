// Simple monitoring data module. Set USE_API = true to call real endpoints.
const USE_API = true

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

function getStaticAlerts() {
  const now = Date.now()
  return [
    {
      id: 's1',
      agent: 'PriceWatch',
      severity: 'warning',
      message: 'Latency increased by 18% in the last 30 minutes.',
      time: now - 1000 * 60 * 20,
    },
    {
      id: 's2',
      agent: 'Sentinel',
      severity: 'critical',
      message: 'Agent heartbeat missed for 10 minutes.',
      time: now - 1000 * 60 * 10,
    },
    {
      id: 's3',
      agent: 'Notifier',
      severity: 'info',
      message: 'Backlog processing returned to normal levels.',
      time: now - 1000 * 60 * 5,
    },
  ]
}

function getMockAgents() {
  return [
    {
      id: 'price-watch',
      name: 'PriceWatch',
      status: 'live',
      uptime: '99.9%',
      tasksPerHour: 124,
      clonedBy: 5000,
      latencyMs: 180,
    },
    {
      id: 'data-sync',
      name: 'DataSync',
      status: 'review',
      uptime: '98.4%',
      tasksPerHour: 32,
      clonedBy: 8792,
      latencyMs: 240,
    },
    {
      id: 'sentinel',
      name: 'Sentinel',
      status: 'down',
      uptime: '87.2%',
      tasksPerHour: 0,
      clonedBy: 6421,
      latencyMs: 1200,
    },
    {
      id: 'notifier',
      name: 'Notifier',
      status: 'live',
      uptime: '99.5%',
      tasksPerHour: 54,
      clonedBy: 7314,
      latencyMs: 95,
    },
  ]
}

function toUiStatus(status) {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'live' || normalized === 'review' || normalized === 'down') {
    return normalized
  }
  if (normalized === 'draft') {
    return 'review'
  }
  return 'live'
}

function mapAgentForMonitor(agent) {
  return {
    id: agent.id,
    name: agent.name,
    status: toUiStatus(agent.status),
    uptime: '99.0%',
    tasksPerHour: 0,
    clonedBy: Number.isInteger(agent.clonedBy) ? agent.clonedBy : 0,
    latencyMs: 120,
  }
}

export async function getMonitoringOverview() {
  if (USE_API) {
    const agents = await getAgents()
    return {
      activeAgents: agents.filter((a) => toUiStatus(a.status) === 'live').length,
      alertsOpen: 0,
      subscriptions: agents.length,
      certifications: 0,
    }
  }
  await delay()
  return {
    activeAgents: 18,
    alertsOpen: 4,
    subscriptions: 124,
    certifications: 52,
  }
}

export async function getAgents() {
  if (USE_API) {
    try {
      const res = await fetch('https://github-cloud-run-service-884188157680.europe-west1.run.app/agents')
      if (!res.ok) {
        return getMockAgents()
      }
      const agents = await res.json()
      if (!Array.isArray(agents) || agents.length === 0) {
        return getMockAgents()
      }
      return agents.map(mapAgentForMonitor)
    } catch {
      return getMockAgents()
    }
  }
  await delay()
  return getMockAgents()
}

export async function getAlerts() {
  if (USE_API) {
    return getStaticAlerts()
  }
  await delay(120)
  return getStaticAlerts()
}

export default {
  getMonitoringOverview,
  getAgents,
  getAlerts,
}
