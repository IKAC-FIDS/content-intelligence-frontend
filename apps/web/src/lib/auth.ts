import { api, authTransport, refreshSession, unwrapApiData } from './api'
import { useAuthStore, type AuthSession } from '@/store/authStore'

export interface LoginRequest{email:string;password:string}
export interface SwitchTenantRequest{organizationId:string}
export interface LogoutAllResult{success:true;revokedCount:number}

export async function login(request:LoginRequest):Promise<AuthSession>{const response=await authTransport.post('/auth/login',request);const session=unwrapApiData<AuthSession>(response.data);useAuthStore.getState().setSession(session);return session}
export async function initializeSession(){return refreshSession()}
export async function logout():Promise<void>{try{await authTransport.post('/auth/logout')}finally{useAuthStore.getState().clear()}}
export async function logoutAll():Promise<LogoutAllResult>{try{const response=await api.post('/auth/logout-all');return response.data as LogoutAllResult}finally{useAuthStore.getState().clear()}}
export async function switchTenant(request:SwitchTenantRequest):Promise<AuthSession>{const response=await api.post('/auth/switch-tenant',request);const session=unwrapApiData<AuthSession>(response.data);useAuthStore.getState().setSession(session);return session}
