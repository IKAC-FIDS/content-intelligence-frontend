import { create } from 'zustand'
export interface AuthUser { id:string; fullName:string; email:string; role:string; organizationId:string|null; permissions:string[]; roleId:string|null; roleCode:string; roleName:string; avatarObjectKey?:string|null }
export interface AuthSession { accessToken:string; user:AuthUser }
type Status='loading'|'authenticated'|'anonymous'|'error'
interface AuthState { user:AuthUser|null; accessToken:string|null; status:Status; setSession:(u:AuthUser,t:string)=>void; clear:()=>void; setStatus:(s:Status)=>void }
export const useAuthStore=create<AuthState>((set)=>({user:null,accessToken:null,status:'loading',setSession:(user,accessToken)=>set({user,accessToken,status:'authenticated'}),clear:()=>set({user:null,accessToken:null,status:'anonymous'}),setStatus:(status)=>set({status})}))
