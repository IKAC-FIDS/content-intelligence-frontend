import { describe, expect, it } from 'vitest'
import { workspaceLanguageCodePattern } from './WorkspaceForm'

describe('WorkspaceForm validation contract', () => {
  const pattern = new RegExp(`^(?:${workspaceLanguageCodePattern})$`)

  it.each(['fa', 'fa-IR', 'en-Latn-US', 'zh-Hans-CN', 'de-CH-1901'])(
    'accepts backend-compatible language code %s',
    (value) => expect(pattern.test(value)).toBe(true),
  )

  it.each(['f', 'fa-IR-x', 'fa-12', 'fa--IR'])(
    'rejects language code outside the backend pattern: %s',
    (value) => expect(pattern.test(value)).toBe(false),
  )
})
