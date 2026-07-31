import { useMemo } from 'react'

const NODE_SPACING_X = 170
const NODE_SPACING_Y = 150
const PADDING = 90

const styles = {
  wrap: { overflow: 'auto', padding: '0 16px 48px', background: 'radial-gradient(circle at 20% 0%, #1e293b 0%, #0f172a 60%)', borderRadius: 12, marginTop: 140 },
  header: { padding: '24px 32px 8px' },
  h1: { margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#e2e8f0' },
  p: { margin: 0, color: '#94a3b8', fontSize: 13 },
  legend: { display: 'flex', gap: 20, padding: '12px 32px 20px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' },
  canvas: { position: 'relative', margin: '0 auto' },
  svg: { position: 'absolute', top: 0, left: 0, pointerEvents: 'none' },
  nodeBase: { position: 'absolute', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '10px 14px', color: 'white', fontSize: 12.5, fontWeight: 600, boxShadow: '0 4px 14px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'default', lineHeight: 1.3 },
  tag: { position: 'absolute', top: -9, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'rgba(15,23,42,0.9)', padding: '1px 6px', borderRadius: 6, color: '#94a3b8' },
}

const typeStyles = {
  root: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: 14, minWidth: 150, height: 52, fontSize: 14 },
  agent: { background: 'linear-gradient(135deg, #6366f1, #4338ca)', borderRadius: 12, minWidth: 130, height: 46 },
  tool: { background: 'linear-gradient(135deg, #10b981, #047857)', borderRadius: '50%', width: 96, height: 96, whiteSpace: 'normal' },
}

function normalize(raw, depth) {
  const isAgent = Object.prototype.hasOwnProperty.call(raw, 'agent-id')
  const id = isAgent ? raw['agent-id'] : raw['tool-id']
  const type = isAgent ? (depth === 0 ? 'root' : 'agent') : 'tool'
  const children = (raw.children || []).map((c) => normalize(c, depth + 1))
  return { id, type, depth, children }
}

function assignX(node, cursor) {
  if (!node.children.length) { node.x = cursor.value; cursor.value += 1; return node.x }
  const xs = node.children.map((c) => assignX(c, cursor))
  node.x = (Math.min(...xs) + Math.max(...xs)) / 2
  return node.x
}

function flatten(node, acc) {
  acc.nodes.push(node)
  node.children.forEach((c) => { acc.edges.push([node, c]); flatten(c, acc) })
  return acc
}

function prettyLabel(id) {
  return id.replace(/^(agent|tool)-/, '').split('-').join(' ')
}

/**
 * Pass data as the tree JSON object, e.g.:
 * { "agent-id": "agent-main", "children": [{ "tool-id": "tool-search" }] }
 */
export default function AgentTreeVisualizer({ data }) {

    console.log('AgentTreeVisualizer data:', data);
  const { nodes, edges, width, height } = useMemo(() => {
    if (!data) return {}
    const tree = normalize(data, 0)
    assignX(tree, { value: 0 })
    const flat = flatten(tree, { nodes: [], edges: [] })
    const maxX = Math.max(...flat.nodes.map((n) => n.x))
    const maxDepth = Math.max(...flat.nodes.map((n) => n.depth))
    return { nodes: flat.nodes, edges: flat.edges, width: maxX * NODE_SPACING_X + PADDING * 2, height: maxDepth * NODE_SPACING_Y + PADDING * 2 }
  }, [data])

  if (!data) return null

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Agent &amp; Tool Topology</h1>
        <p style={styles.p}>Main agent at top, sub-agents branch below, tools are leaf nodes.</p>
      </div>
      <div style={styles.legend}>
        <div style={styles.legendItem}><span style={{ width: 14, height: 14, borderRadius: 4, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} />Main agent</div>
        <div style={styles.legendItem}><span style={{ width: 14, height: 14, borderRadius: 4, background: 'linear-gradient(135deg, #6366f1, #4338ca)' }} />Sub-agent</div>
        <div style={styles.legendItem}><span style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #047857)' }} />Tool</div>
      </div>
      <div style={{ overflow: 'auto' }}>
        <div style={{ ...styles.canvas, width: width, height: height, minHeight: height }}>
          <svg style={styles.svg} width={width} height={height}>
            {edges.map(([from, to], i) => {
              const x1 = from.x * NODE_SPACING_X + PADDING, y1 = from.depth * NODE_SPACING_Y + PADDING
              const x2 = to.x * NODE_SPACING_X + PADDING, y2 = to.depth * NODE_SPACING_Y + PADDING
              const midY = (y1 + y2) / 2
              return <path key={i} d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`} stroke="#475569" strokeWidth="1.6" fill="none" />
            })}
          </svg>
          {nodes.map((n) => (
            <div key={n.id} style={{ ...styles.nodeBase, ...typeStyles[n.type], left: n.x * NODE_SPACING_X + PADDING, top: n.depth * NODE_SPACING_Y + PADDING }}>
              <span style={styles.tag}>{n.type === 'root' ? 'orchestrator' : n.type}</span>
              {prettyLabel(n.id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}