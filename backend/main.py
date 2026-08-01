from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

app = FastAPI(title="AI AgentHub Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InteractRequest(BaseModel):
    query: str


AGENTS: List[Dict[str, Any]] = [
    {
        "id": "risk-sentinel",
        "name": "Risk Sentinel",
        "category": "Control",
        "status": "Live",
        "owner": "Controls",
        "description": "Monitors transactions and exceptions against policy rules, builds evidence packs, and routes approvals.",
        "skills": ["Policy checks", "Evidence capture", "Approvals"],
        "tools": [
            {
                "id": "tool-policy-check",
                "name": "Policy Checker",
                "description": "Scans transactions and cases against active policy rules to flag breaches.",
            },
            {
                "id": "tool-evidence-capture",
                "name": "Evidence Capture",
                "description": "Collects and packages supporting evidence for each flagged exception.",
            },
            {
                "id": "tool-approval-router",
                "name": "Approval Router",
                "description": "Routes exceptions to the right approver and tracks sign-off status.",
            },
        ],
        "integrations": ["ServiceNow", "SharePoint", "OpenShift"],
    },
    {
        "id": "ops-concierge",
        "name": "Ops Concierge",
        "category": "Assistant",
        "status": "Live",
        "owner": "Operations",
        "description": "Answers operating questions, opens tickets, and summarizes handover notes.",
        "skills": ["Ticket routing", "Knowledge search", "Summaries"],
        "tools": [
            {
                "id": "tool-ticket-routing",
                "name": "Ticket Router",
                "description": "Opens and routes tickets to the correct queue based on request type.",
            },
            {
                "id": "tool-knowledge-search",
                "name": "Knowledge Search",
                "description": "Searches internal knowledge bases and past tickets for relevant answers.",
            },
            {
                "id": "tool-handover-summary",
                "name": "Handover Summarizer",
                "description": "Condenses shift handover notes into a short, shareable summary.",
            },
        ],
        "integrations": ["Teams", "Jira", "Confluence"],
    },
]

TOOLS: List[Dict[str, Any]] = [
    {
        "id": "tool-policy-check",
        "name": "Policy Checker",
        "description": "Scans transactions and cases against active policy rules to flag breaches.",
        "owner": "Controls",
        "status": "Live",
    },
    {
        "id": "tool-knowledge-search",
        "name": "Knowledge Search",
        "description": "Searches internal knowledge bases and past tickets for relevant answers.",
        "owner": "Operations",
        "status": "Live",
    },
    {
        "id": "tool-workflow",
        "name": "Workflow Orchestrator",
        "description": "Creates and tracks tasks for agent workflows.",
        "owner": "Operations",
        "status": "Live",
    },
    {
        "id": "tool-report",
        "name": "Report Builder",
        "description": "Generates summaries and reports for stakeholders.",
        "owner": "Operations",
        "status": "Live",
    },
]


def find_agent(agent_id: str) -> Optional[Dict[str, Any]]:
    return next((agent for agent in AGENTS if agent["id"] == agent_id), None)


def find_tool(tool_id: str) -> Optional[Dict[str, Any]]:
    return next((tool for tool in TOOLS if tool["id"] == tool_id), None)


@app.get("/agents")
async def list_agents() -> List[Dict[str, Any]]:
    return AGENTS


@app.get("/tools")
async def list_tools() -> List[Dict[str, Any]]:
    return TOOLS


@app.get("/monitoring/agents/{agent_id}")
async def get_monitoring_agent(agent_id: str) -> Dict[str, Any]:
    agent = find_agent(agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@app.get("/tools/{tool_id}")
async def get_tool(tool_id: str) -> Dict[str, Any]:
    tool = find_tool(tool_id)
    if tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool


@app.post("/agents")
async def create_agent(agent: Dict[str, Any]) -> Dict[str, Any]:
    agent_id = agent.get("id") or f"agent-{len(AGENTS) + 1}"
    agent["id"] = agent_id
    if "status" not in agent:
        agent["status"] = "Live"
    if "owner" not in agent:
        agent["owner"] = "Operations"
    if "description" not in agent and "summary" in agent:
        agent["description"] = agent["summary"]
    AGENTS.append(agent)
    return agent


@app.post("/interact")
async def interact(request: InteractRequest) -> Dict[str, Any]:
    return {
        "agent-id": "agent-main",
        "children": [
            {
                "tool-id": "tool-knowledge-search",
                "children": [
                    {
                        "agent-id": "agent-data-copilot",
                        "children": [
                            {"tool-id": "tool-report"},
                        ],
                    },
                ],
            },
            {
                "tool-id": "tool-workflow",
            },
        ],
        "query": request.query,
    }
