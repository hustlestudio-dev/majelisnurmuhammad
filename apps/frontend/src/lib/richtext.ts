// Minimal Portable Text (EmDash richtext) → HTML serializer.
// Handles blocks (paragraphs, headings, blockquote), lists, and inline marks.

type Span = { _type?: string; text?: string; marks?: string[] }
type MarkDef = { _key?: string; _type?: string; href?: string }
type Block = {
  _type?: string
  style?: string
  listItem?: string
  level?: number
  children?: Span[]
  markDefs?: MarkDef[]
}

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const DECORATORS: Record<string, [string, string]> = {
  strong: ['<strong>', '</strong>'],
  em: ['<em>', '</em>'],
  underline: ['<u>', '</u>'],
  'strike-through': ['<s>', '</s>'],
  strike: ['<s>', '</s>'],
  code: ['<code>', '</code>'],
}

const renderSpan = (span: Span, markDefs: MarkDef[]): string => {
  let text = escapeHtml(String(span.text ?? ''))
  for (const mark of span.marks ?? []) {
    const dec = DECORATORS[mark]
    if (dec) {
      text = `${dec[0]}${text}${dec[1]}`
      continue
    }
    const def = markDefs.find((m) => m._key === mark)
    if (def?._type === 'link' && def.href) {
      const safe = /^(https?:|\/|#)/.test(def.href) ? def.href : '#'
      const url = escapeHtml(safe)
      text = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
    }
  }
  return text
}

const renderBlockInner = (block: Block): string =>
  (block.children ?? [])
    .map((span) => renderSpan(span, block.markDefs ?? []))
    .join('')

const blockTag = (style?: string): string => {
  if (style && /^h[1-6]$/.test(style)) return style
  if (style === 'blockquote') return 'blockquote'
  return 'p'
}

const toBlocks = (value: unknown): Block[] =>
  Array.isArray(value) ? (value as Block[]) : []

export const renderRichText = (value: unknown): string => {
  const blocks = toBlocks(value)
  const html: string[] = []
  let listTag: 'ul' | 'ol' | null = null

  const closeList = () => {
    if (listTag) {
      html.push(`</${listTag}>`)
      listTag = null
    }
  }

  for (const block of blocks) {
    if (block._type && block._type !== 'block') continue
    const inner = renderBlockInner(block)
    if (block.listItem) {
      const wanted = block.listItem === 'number' ? 'ol' : 'ul'
      if (listTag !== wanted) {
        closeList()
        listTag = wanted
        html.push(`<${listTag}>`)
      }
      html.push(`<li>${inner}</li>`)
      continue
    }
    closeList()
    if (!inner) continue
    const tag = blockTag(block.style)
    html.push(`<${tag}>${inner}</${tag}>`)
  }
  closeList()
  return html.join('')
}

export const richTextToPlain = (value: unknown, max = 200): string => {
  const blocks = toBlocks(value)
  const text = blocks
    .filter((b) => !b._type || b._type === 'block')
    .map((b) => (b.children ?? []).map((s) => s.text ?? '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max).trim()}…` : text
}
