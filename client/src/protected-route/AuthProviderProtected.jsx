import React from 'react'
import {Outlet} from 'react-router-dom'
import AuthProvider from '../providers/AuthProvider'

export default function AuthProviderProtected() {
  return (
    <AuthProvider>
        <Outlet/>
    </AuthProvider>
  )
}
