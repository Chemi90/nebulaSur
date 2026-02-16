/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import en from '../data/translations/en.json'
import it from '../data/translations/it.json'
import es from '../data/translations/es.json'

const translations = { en, it, es }
const DEFAULT_LANGUAGE = 'en'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('nebula-language')
    return saved || DEFAULT_LANGUAGE
  })

  useEffect(() => {
    localStorage.setItem('nebula-language', language)
  }, [language])

  const resolveKey = useCallback((source, key) => {
    const keys = key.split('.')
    let value = source
    for (const k of keys) {
      value = value?.[k]
    }
    return value
  }, [])

  const t = useCallback((key) => {
    const value = resolveKey(translations[language], key)
    if (value !== undefined) return value
    const fallbackValue = resolveKey(translations[DEFAULT_LANGUAGE], key)
    if (fallbackValue !== undefined) return fallbackValue
    return key
  }, [language, resolveKey])

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
