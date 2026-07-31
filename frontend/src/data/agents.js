const agents = [
  {
    id: 'risk-sentinel',
    name: 'Risk Sentinel',
    type: 'Control',
    status: 'Live',
    owner: 'Controls',
    accuracy: 94,
    latency: '1.8s',
    runs: '18.4k',
    cost: '$284',
    summary: 'Reviews policy breaches, generates evidence packs, and routes exceptions.',
    description:
      'Risk Sentinel is a controls agent that continuously monitors transactions and case activity against active policy rules. When a potential breach is detected, it assembles a supporting evidence pack and routes the exception to the correct approver, cutting manual review time while keeping every decision auditable.',
    skills: ['Policy checks', 'Evidence capture', 'Approvals'],
    tools: [
      {
        id: 'tool-policy-check',
        name: 'Policy Checker',
        description: 'Scans transactions and cases against active policy rules to flag breaches.',
      },
      {
        id: 'tool-evidence-capture',
        name: 'Evidence Capture',
        description: 'Collects and packages supporting evidence for each flagged exception.',
      },
      {
        id: 'tool-approval-router',
        name: 'Approval Router',
        description: 'Routes exceptions to the right approver and tracks sign-off status.',
      },
    ],
    integrations: ['ServiceNow', 'SharePoint', 'OpenShift'],
  },
  {
    id: 'ops-concierge',
    name: 'Ops Concierge',
    type: 'Assistant',
    status: 'Live',
    owner: 'Operations',
    accuracy: 91,
    latency: '2.4s',
    runs: '9.7k',
    cost: '$121',
    summary: 'Answers operating questions, opens tickets, and summarizes handover notes.',
    description:
      'Ops Concierge is the front line for day-to-day operating questions. It searches internal knowledge sources to answer questions directly, opens and routes tickets when a request needs follow-up, and summarizes shift handover notes so incoming teams can get up to speed quickly.',
    skills: ['Ticket routing', 'Knowledge search', 'Summaries'],
    tools: [
      {
        id: 'tool-ticket-routing',
        name: 'Ticket Router',
        description: 'Opens and routes tickets to the correct queue based on request type.',
      },
      {
        id: 'tool-knowledge-search',
        name: 'Knowledge Search',
        description: 'Searches internal knowledge bases and past tickets for relevant answers.',
      },
      {
        id: 'tool-handover-summary',
        name: 'Handover Summarizer',
        description: 'Condenses shift handover notes into a short, shareable summary.',
      },
    ],
    integrations: ['Teams', 'Jira', 'Confluence'],
  },
  {
    id: 'data-copilot',
    name: 'Data Copilot',
    type: 'Analytics',
    status: 'Review',
    owner: 'Data Office',
    accuracy: 88,
    latency: '3.1s',
    runs: '3.2k',
    cost: '$89',
    summary: 'Creates governed SQL, explains datasets, and checks access before execution.',
    description:
      'Data Copilot helps analysts and business users query data safely. It drafts governed SQL from natural-language questions, explains dataset lineage so users understand where fields come from, and checks the requester has the right access before any query runs.',
    skills: ['SQL drafting', 'Lineage', 'Access checks'],
    tools: [
      {
        id: 'tool-sql-drafting',
        name: 'SQL Drafter',
        description: 'Generates governed SQL queries from natural language questions.',
      },
      {
        id: 'tool-lineage',
        name: 'Lineage Explorer',
        description: 'Traces dataset lineage and explains how fields are derived.',
      },
      {
        id: 'tool-access-check',
        name: 'Access Checker',
        description: 'Validates the requester has permission before running a query.',
      },
    ],
    integrations: ['BigQuery', 'Looker', 'GitHub'],
  },
]

export default agents
