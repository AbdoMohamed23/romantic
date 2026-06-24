import { useCallback, useState } from 'react'
import { config } from '../data/config'
import { setAdminPasswordForSync } from '../utils/supabaseContent'

const ADMIN_KEY = config.auth.adminStorageKey
const VISITOR_KEY = config.auth.storageKey

function readKey(key) {
  return sessionStorage.getItem(key) === 'true'
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(() => readKey(ADMIN_KEY))

  const adminLoginWithPassword = useCallback((password) => {
    setAdminPasswordForSync(password)
    sessionStorage.setItem(ADMIN_KEY, 'true')
    setIsAdmin(true)
  }, [])

  const adminLogout = useCallback(() => {
    setAdminPasswordForSync('')
    sessionStorage.removeItem(ADMIN_KEY)
    setIsAdmin(false)
  }, [])

  return { isAdmin, adminLoginWithPassword, adminLogout }
}

export function checkAdminAuth() {
  return readKey(ADMIN_KEY)
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => readKey(VISITOR_KEY))

  const login = useCallback(() => {
    sessionStorage.setItem(VISITOR_KEY, 'true')
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(VISITOR_KEY)
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, login, logout }
}

export function checkAuth() {
  return readKey(VISITOR_KEY)
}

export function grantVisitorPreviewAccess() {
  sessionStorage.setItem(VISITOR_KEY, 'true')
}
