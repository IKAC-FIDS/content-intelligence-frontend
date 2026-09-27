import axios from 'axios'

interface ApiErrorPayload{error?:{code?:string;message?:string};message?:string}
export interface NormalizedAuthError{code:string;message:string;status:number|null}

export function normalizeAuthError(reason:unknown):NormalizedAuthError{
 if(!axios.isAxiosError<ApiErrorPayload>(reason))return{code:'UNKNOWN',message:'ورود ناموفق بود. دوباره تلاش کنید.',status:null}
 const status=reason.response?.status??null
 const payload=reason.response?.data
 if(!reason.response)return{code:'NETWORK_ERROR',message:'ارتباط با سرور برقرار نشد.',status}
 return{code:payload?.error?.code??'AUTH_ERROR',message:payload?.error?.message??payload?.message??'ورود ناموفق بود. اطلاعات حساب را بررسی کنید.',status}
}
