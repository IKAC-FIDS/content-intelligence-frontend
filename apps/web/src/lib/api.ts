import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { apiBaseUrl } from './httpConfig'
import { useAuthStore, type AuthSession } from '@/store/authStore'

export interface ApiEnvelope<T>{success:boolean;data:T;requestId?:string;timestamp?:string}
export function unwrapApiData<T>(payload:T|ApiEnvelope<T>):T{return typeof payload==='object'&&payload!==null&&'success' in payload&&'data' in payload?(payload as ApiEnvelope<T>).data:payload as T}

export const authTransport=axios.create({baseURL:apiBaseUrl,timeout:30000,withCredentials:true,headers:{'Content-Type':'application/json'}})
export const api=axios.create({baseURL:apiBaseUrl,timeout:30000,withCredentials:true,headers:{'Content-Type':'application/json'}})

api.interceptors.request.use((config)=>{const token=useAuthStore.getState().accessToken;if(token)config.headers.Authorization=`Bearer ${token}`;return config})

let refreshInFlight:Promise<AuthSession|null>|null=null
export async function refreshSession():Promise<AuthSession|null>{
 refreshInFlight??=authTransport.post('/auth/refresh').then((response)=>{const session=unwrapApiData<AuthSession>(response.data);useAuthStore.getState().setSession(session);return session}).catch(()=>{useAuthStore.getState().clear();return null}).finally(()=>{refreshInFlight=null})
 return refreshInFlight
}

const noRefreshEndpoints=['/auth/login','/auth/refresh','/auth/logout','/auth/logout-all']
function shouldSkipRefresh(config?:InternalAxiosRequestConfig){const url=String(config?.url??'');return noRefreshEndpoints.some((endpoint)=>url.includes(endpoint))}
type RetryableConfig=InternalAxiosRequestConfig&{_retry?:boolean}

api.interceptors.response.use((response)=>response,async(error:AxiosError)=>{
 const original=error.config as RetryableConfig|undefined
 if(error.response?.status===403){useAuthStore.getState().setForbidden();throw error}
 if(error.response?.status!==401||!original||original._retry||shouldSkipRefresh(original))throw error
 original._retry=true
 const session=await refreshSession()
 if(!session)throw error
 original.headers.Authorization=`Bearer ${session.accessToken}`
 return api(original)
})
