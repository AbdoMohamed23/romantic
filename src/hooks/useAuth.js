import { useCallback, useEffect, useState } from 'react'
import { config } from '../data/config'
import {
  getAdminPasswordForSync,
  setAdminPasswordForSync,
} from '../utils/supabaseContent'

const ADMIN_KEY = config.auth.adminStorageKey
const VISITOR_KEY = config.auth.storageKey

function readKey(key) {
  return sessionStorage.getItem(key) === 'true'
}

function hasValidAdminSession() {
  return readKey(ADMIN_KEY) && Boolean(getAdminPasswordForSync())
}

function clearAdminSession() {
  setAdminPasswordForSync('')
  sessionStorage.removeItem(ADMIN_KEY)
}

export function useAdminAuth() {
  const [adminPassword, setAdminPassword] = useState(() => getAdminPasswordForSync())
  const [isAdmin, setIsAdmin] = useState(() => hasValidAdminSession())

  useEffect(() => {
    if (readKey(ADMIN_KEY) && !getAdminPasswordForSync()) {
      clearAdminSession()
      setAdminPassword('')
      setIsAdmin(false)
    }
  }, [])

  const adminLoginWithPassword = useCallback((password) => {
    setAdminPasswordForSync(password)
    sessionStorage.setItem(ADMIN_KEY, 'true')
    setAdminPassword(password)
    setIsAdmin(true)
  }, [])

  const updateAdminPassword = useCallback((password) => {
    setAdminPasswordForSync(password)
    setAdminPassword(password)
  }, [])

  const adminLogout = useCallback(() => {
    clearAdminSession()
    setAdminPassword('')
    setIsAdmin(false)
  }, [])

  return {
    isAdmin,
    adminPassword,
    adminLoginWithPassword,
    updateAdminPassword,
    adminLogout,
  }
}

export function checkAdminAuth() {
  return hasValidAdminSession()
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
