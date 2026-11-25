import { afterEach, describe, expect, it, vi } from 'vitest'
import { anonymousVisitorId } from '../../server/utils/access-log'

vi.mock('#shared/utils/flag', () => ({ getFlag: vi.fn() }))

afterEach(() => {
  vi.useRealTimers()
})

// Enlight: the Analytics Engine `ip` blob must never hold a real IP
describe('anonymousVisitorId', () => {
  const ua = 'Mozilla/5.0 (iPhone)'

  it('never returns the raw IP', () => {
    const id = anonymousVisitorId('salt', '203.0.113.7', ua)
    expect(id).toMatch(/^[0-9a-f]{16}$/)
    expect(id).not.toContain('203.0.113.7')
  })

  it('is stable within the same Bangkok day and changes the next day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-12-15T01:00:00Z'))
    const morning = anonymousVisitorId('salt', '203.0.113.7', ua)
    vi.setSystemTime(new Date('2026-12-15T16:00:00Z'))
    const evening = anonymousVisitorId('salt', '203.0.113.7', ua)
    vi.setSystemTime(new Date('2026-12-15T18:00:00Z'))
    const nextDay = anonymousVisitorId('salt', '203.0.113.7', ua)
    expect(evening).toBe(morning)
    expect(nextDay).not.toBe(morning)
  })

  it('depends on the secret salt and is empty without an IP', () => {
    expect(anonymousVisitorId('a', '203.0.113.7', ua)).not.toBe(anonymousVisitorId('b', '203.0.113.7', ua))
    expect(anonymousVisitorId('a', undefined, ua)).toBe('')
  })
})
