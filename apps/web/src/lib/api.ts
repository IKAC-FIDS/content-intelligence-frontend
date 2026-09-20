import axios from 'axios'
import { apiBaseUrl } from './httpConfig'
import { useAuthStore } from '@/store/authStore'
export interface ApiEnvelope<T>{success:boolean;data:T;requestId?:string;timestamp?:string}
export function unwrapApiData<T>(payload:T|ApiEnvelope<T>):T{return typeof payload==='object'&&payload!==null&&'success' in payload&&'data' in payload?(payload as ApiEnvelope<T>).data:payload as T}
export const api=axios.create({baseURL:apiBaseUrl,timeout:30000,withCredentials:true,headers:{'Content-Type':'application/json'}})
api.interceptors.request.use((config)=>{const token=useAuthStore.getState().accessToken;if(token) config.headers.Authorization=`Bearer ${token}`;return config})
let refreshing:Promise<string|null>|null=null
async function refresh(){try{const r=await axios.post(`${apiBaseUrl}/auth/refresh`,{}, {withCredentials:true});const {accessToken,user}=unwrapApiData(r.data);useAuthStore.getState().setSession(user,accessToken);return accessToken as string}catch{useAuthStore.getState().clear();return null}}
api.interceptors.response.use(r=>r,async(error)=>{const original=error.config;if(error.response?.status!==401||original?._retry||String(original?.url||'').includes('/auth/login')) throw error;original._retry=true;refreshing??=refresh().finally(()=>{refreshing=null});const token=await refreshing;if(!token) throw error;original.headers.Authorization=`Bearer ${token}`;return api(original)})
