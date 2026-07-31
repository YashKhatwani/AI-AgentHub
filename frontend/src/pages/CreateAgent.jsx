import { useState } from 'react'
import { createAgentVisualization, generateAgentDraft, saveAgent } from '../services/agentCreation'
import '../App.css'
import AgentTreeVisualizer from '../components/AgentTreeVisualizer'

const emptyDraft = {
  id: null,
  name: '',
  prompt: '',
  summary: '',
  status: 'Draft',
  owner: 'Operations',
  tools: [],
  integrations: [],
}

export default function CreateAgent({ onCreate }) {
  const [name, setName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [draft, setDraft] = useState(emptyDraft)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [dataForVisualization, setDataForVisualization] = useState(null)

  const canGenerate = name.trim() && prompt.trim()
  const hasDraft = Boolean(draft.summary || draft.tools.length)

  const handleGenerate = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    if (!canGenerate) return
    setLoading(true)
    try {
      const interactQuery = `Agent name: ${name.trim()}\nAgent brief: ${prompt.trim()}`
      const visualization = await createAgentVisualization(interactQuery)
      setDataForVisualization(visualization)

      const generated = await generateAgentDraft(name.trim(), prompt.trim())
      setDraft(generated)
      setSuccessMessage('Agent successfully created')
    } catch (err) {
      setError(err.message || 'Failed to generate draft')
    } finally {
      setLoading(false)
    }
  }

  const handleToolChange = (toolId, key, value) => {
    setDraft((current) => ({
      ...current,
      tools: current.tools.map((tool) => (tool.id === toolId ? { ...tool, [key]: value } : tool)),
    }))
  }

  const handleRemoveTool = (toolId) => {
    setDraft((current) => ({
      ...current,
      tools: current.tools.filter((tool) => tool.id !== toolId),
    }))
  }

  const handleComplete = async () => {
    // setError('')
    // if (!draft.name.trim() || draft.tools.length === 0) {
    //   setError('Agent draft must include a name and at least one tool.')
    //   return
    // }
    // setSaving(true)
    // try {
    //   const saved = await saveAgent(draft)
    //   onCreate(saved)
    // } catch (err) {
    //   setError(err.message || 'Failed to save agent')
    // } finally {
    //   setSaving(false)
    // }
     window.open('https://reporting-agent-tpijys3ltq-ew.a.run.app/dev-ui/', '_blank', 'noopener,noreferrer')
  }

  const canComplete = hasDraft && draft.tools.length > 0 && !loading && !saving

  const successBoxStyle = {
    marginTop: 12,
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(22, 163, 74, 0.35)',
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.16), rgba(21, 128, 61, 0.14))',
    color: '#14532d',
    fontWeight: 600,
    fontSize: 13,
    width: 'fit-content',
    boxShadow: '0 10px 24px rgba(20, 83, 45, 0.12)',
  }

  return (
    <main className="view create-view">
      <section className="create-hero">
        <div className="create-hero-main">
          <section className="page-intro create-page-intro">
            <p className="eyebrow">Create agent</p>
            <h2>Design and launch a reliable AI agent draft.</h2>
            <p>Describe the objective, generate a guided draft, then refine the tools before publishing.</p>
          </section>

          <form className="create-form" onSubmit={handleGenerate}>
            <label>
              Agent name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Exception Triage Agent"
              />
            </label>
            <label className="full-field">
              Agent brief
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe the workflow, data context, and expected output from this agent"
              />
            </label>
            <button className="primary-action full-field" type="submit" disabled={!canGenerate || loading}>
              {loading ? 'Generating draft…' : 'Generate AI draft'}
            </button>
          </form>

          {error && (
            <div className="create-alert" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div style={successBoxStyle} role="status" aria-live="polite">
              {successMessage}
            </div>
          )}
       
       
        </div>

        <aside className="create-hero-visual" aria-label="Agent creation processing flow">
          <div className="create-visual-grid" aria-hidden="true" />
          <div className="create-visual-shell" aria-hidden="true">
            <p className="create-visual-eyebrow">Build stages</p>
            <div className="create-stage-list">
              <span className="create-stage active">1. Intent brief</span>
              <span className="create-stage active delayed">2. Draft model</span>
              <span className="create-stage">3. Tool plan</span>
              <span className="create-stage">4. Ready to publish</span>
            </div>
            <div className="create-progress" role="presentation">
              <span className="create-progress-track">
                <span className="create-progress-fill" />
              </span>
              <div className="create-signal-dots">
                <span className="create-dot" />
                <span className="create-dot" />
                <span className="create-dot" />
              </div>
            </div>
          </div>

          <div className="create-visual-bridge" aria-hidden="true">
            <span className="create-bridge-halo" />
            <span className="create-bridge-wisp wisp-1" />
            <span className="create-bridge-wisp wisp-2" />
            <span className="create-bridge-wisp wisp-3" />
            <span className="create-bridge-spark spark-1" />
            <span className="create-bridge-spark spark-2" />
            <span className="create-bridge-spark spark-3" />
            <span className="create-bridge-spark spark-4" />
            <span className="create-bridge-spark spark-5" />
            <span className="create-bridge-spark spark-6" />
            <span className="create-bridge-star star-1" />
            <span className="create-bridge-star star-2" />
            <span className="create-bridge-star star-3" />
          </div>
          <p className="create-visual-caption">Blueprint compiling with validation checks</p>
        </aside>
      </section>
      {dataForVisualization && <AgentTreeVisualizer data={dataForVisualization} />}

      {hasDraft && (
        <section className="wide-section create-draft">
          <div className="section-heading create-draft-head">
            <div>
              <p className="eyebrow">Draft preview</p>
              <h2>{draft.name}</h2>
            </div>
            <button className="secondary-action" type="button" onClick={() => setDraft(emptyDraft)}>
              Clear draft
            </button>
          </div>

          <p className="create-draft-summary">{draft.summary}</p>

          <div className="section-heading create-tool-heading">
            <div>
              <p className="eyebrow">Generated tools</p>
              <h3>Refine tool names and descriptions before publishing.</h3>
            </div>
          </div>

          <div className="create-tool-list">
            {draft.tools.map((tool) => (
              <div className="create-tool-card" key={tool.id}>
                <div className="create-tool-card-top">
                  <div className="create-tool-fields">
                    <label className="create-tool-label">
                      Tool name
                      <input
                        className="create-tool-input"
                        value={tool.name}
                        onChange={(event) => handleToolChange(tool.id, 'name', event.target.value)}
                      />
                    </label>
                    <label className="create-tool-label">
                      Description
                      <textarea
                        className="create-tool-textarea"
                        value={tool.description}
                        onChange={(event) => handleToolChange(tool.id, 'description', event.target.value)}
                      />
                    </label>
                  </div>
                  <button className="secondary-action" type="button" onClick={() => handleRemoveTool(tool.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="create-draft-actions">
            <button className="secondary-action" type="button" onClick={() => setDraft(emptyDraft)}>
              Start over
            </button>
            <button className="primary-action" type="button" onClick={handleComplete} disabled={!canComplete}>
              {saving ? 'Saving agent…' : 'Publish agent draft'}
            </button>
          </div>

          <div className="create-json-block">
            <div className="create-json-head">
              <p className="eyebrow">AI draft JSON</p>
              <span className="create-json-note">Generated payload preview</span>
            </div>
            <pre className="create-json-pre">
              {JSON.stringify(draft, null, 2)}
            </pre>
          </div>
          
        </section>
      )}
    </main>
  )
}
