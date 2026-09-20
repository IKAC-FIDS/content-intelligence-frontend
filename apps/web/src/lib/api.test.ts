import { describe, expect, it } from 'vitest'
import { unwrapApiData } from './api'
describe('unwrapApiData',()=>{
 it('unwraps the backend success envelope',()=>{expect(unwrapApiData({success:true,data:{accessToken:'token'}})).toEqual({accessToken:'token'})})
 it('keeps an unwrapped payload compatible',()=>{expect(unwrapApiData({accessToken:'token'})).toEqual({accessToken:'token'})})
})
