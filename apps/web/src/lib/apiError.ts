import axios from 'axios'

interface ApiErrorPayload { error?: { code?: string; message?: string }; message?: string }
export interface NormalizedApiError { code: string; message: string; status: number | null }

export function normalizeApiError(reason: unknown): NormalizedApiError {
  if (!axios.isAxiosError<ApiErrorPayload>(reason)) {
    return { code: 'UNKNOWN', message: 'عملیات انجام نشد. دوباره تلاش کنید.', status: null }
  }
  const status = reason.response?.status ?? null
  const payload = reason.response?.data
  if (!reason.response) return { code: 'NETWORK_ERROR', message: 'ارتباط با سرور برقرار نشد.', status }
  return {
    code: payload?.error?.code ?? 'API_ERROR',
    message: payload?.error?.message ?? payload?.message ?? 'عملیات انجام نشد. دوباره تلاش کنید.',
    status,
  }
}
