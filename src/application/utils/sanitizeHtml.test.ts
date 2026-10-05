import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from './sanitizeHtml'

describe('sanitizeHtml', () => {
  it('preserves safe formatting tags and links', () => {
    const dirty =
      '<p>Hello <strong>world</strong> and <em>friends</em></p><p><a href="https://example.com" title="Example">Visit</a><br></p>'

    const clean = sanitizeHtml(dirty)

    expect(clean).toContain('<p>')
    expect(clean).toContain('<strong>world</strong>')
    expect(clean).toContain('<em>friends</em>')
    expect(clean).toContain('<a href="https://example.com" title="Example">Visit</a>')
    expect(clean).toContain('<br>')
  })

  it('strips dangerous scripts, event handlers and javascript URIs', () => {
    const dirty = [
      '<p>Safe</p>',
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<a href="javascript:alert(1)">Bad link</a>',
    ].join('')

    const clean = sanitizeHtml(dirty)

    expect(clean).toContain('<p>Safe</p>')
    expect(clean).not.toContain('<script')
    expect(clean).not.toContain('onerror')
    expect(clean).not.toContain('<iframe')
    expect(clean).not.toContain('javascript:')
  })
})
