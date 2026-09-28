import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/lib/api'
import { archiveWorkspace, createWorkspace, getWorkspace, listAllActiveWorkspaces, listWorkspaces, updateWorkspace } from './workspaceApi'

vi.mock('@/lib/api', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/api')>()
  return { ...original, api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() } }
})

const record = { id: 'workspace-a', organizationId: 'tenant-a', name: 'A', code: 'a', status: 'ACTIVE', settings: {}, defaultLanguageId: null, defaultLanguage: null, inputLanguages: [], outputLanguages: [], timezone: 'Asia/Tehran', archivedAt: null, createdAt: 'now', updatedAt: 'now' }
const envelope = (data: unknown) => ({ success: true, data })

describe('workspace API', () => {
  beforeEach(() => vi.clearAllMocks())

  it('passes supported list filters to the backend', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { ...envelope([record]), meta: { total: 1, page: 2, limit: 20, totalPages: 2, hasNext: false, hasPrevious: true } } })
    await expect(listWorkspaces({ page: 2, limit: 20, search: 'alpha', status: 'ARCHIVED' })).resolves.toMatchObject({ data: [record], meta: { page: 2 } })
    expect(api.get).toHaveBeenCalledWith('/workspaces', { params: { page: 2, limit: 20, search: 'alpha', status: 'ARCHIVED' } })
  })

  it('loads every active workspace page for the selector', async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: { ...envelope([record]), meta: { total: 2, page: 1, limit: 100, totalPages: 2, hasNext: true, hasPrevious: false } } })
      .mockResolvedValueOnce({ data: { ...envelope([{ ...record, id: 'workspace-b' }]), meta: { total: 2, page: 2, limit: 100, totalPages: 2, hasNext: false, hasPrevious: true } } })
    await expect(listAllActiveWorkspaces()).resolves.toHaveLength(2)
    expect(api.get).toHaveBeenNthCalledWith(1, '/workspaces', { params: { page: 1, limit: 100, status: 'ACTIVE' } })
    expect(api.get).toHaveBeenNthCalledWith(2, '/workspaces', { params: { page: 2, limit: 100, status: 'ACTIVE' } })
  })

  it('uses the exact read, create, update, and archive routes', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: envelope(record) })
    vi.mocked(api.post).mockResolvedValue({ data: envelope(record) })
    vi.mocked(api.patch).mockResolvedValue({ data: envelope(record) })
    await getWorkspace('workspace-a')
    await createWorkspace({ name: 'A', code: 'a', timezone: 'Asia/Tehran' })
    await updateWorkspace('workspace-a', { name: 'B' })
    await archiveWorkspace('workspace-a')
    expect(api.get).toHaveBeenCalledWith('/workspaces/workspace-a')
    expect(api.post).toHaveBeenCalledWith('/workspaces', { name: 'A', code: 'a', timezone: 'Asia/Tehran' })
    expect(api.patch).toHaveBeenNthCalledWith(1, '/workspaces/workspace-a', { name: 'B' })
    expect(api.patch).toHaveBeenNthCalledWith(2, '/workspaces/workspace-a/archive')
  })

  it('propagates backend failures for the page to normalize and render', async () => {
    const failure = new Error('request failed')
    vi.mocked(api.get).mockRejectedValue(failure)
    await expect(listWorkspaces()).rejects.toBe(failure)
  })
})
