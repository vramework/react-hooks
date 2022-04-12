import { useState, useCallback, useRef, useEffect } from 'react'
import equal from 'fast-deep-equal/react'

function mergeData<T>(original: T, data: Partial<T>): T {
  if (!data) {
    return original
  }
  const result: Partial<T> = {}
  for (const k in original) {
    result[k] = data[k] !== undefined ? data[k] : original[k]
  }
  return result as T
}

export type OnDataError = (error: boolean, field: string) => void
export type OnDataChange = (value: string | string[] | boolean | number | Date | null, field: string) => void
export type OnDataChanges = (data: {
  [index: string]: string | string[] | boolean | number | Date | any | null
}) => void
export interface ChangedDataHook<T> {
  data: T
  changedData: Partial<T>
  changedDataRef: { current: Partial<T> }
  originalDataRef: { current: Partial<T> }
  onChange: OnDataChange
  revertChanges: () => Promise<void>
  clearBlobs: () => void
  onChanges: OnDataChanges
  onDataError: OnDataError
  hasError: boolean
}

export const useChangedData = <T extends unknown>(original: T): ChangedDataHook<T> => {
  const data = useRef<T>(original)
  const cd = useRef<Partial<T>>({})
  const og = useRef<T>(original)
  og.current = original

  const [, setChangedNotifier] = useState<number>(0)
  const mergeChange = useCallback(() => {
    const merged = mergeData(og.current, cd.current)
    if (!equal(merged, data.current)) {
      data.current = merged
      setChangedNotifier(Math.random())
    }
    if (equal(og.current, merged) && !equal(cd.current, {})) {
      cd.current = {}
      setChangedNotifier(Math.random())
    }
  }, [])
  useEffect(() => {
    mergeChange()
  }, [original])
  const onChange = useCallback((value: any, field: string) => {
    if ((cd.current as any)[field] !== value) {
      (cd.current as any)[field] = value
      mergeChange()
    }
  }, [])
  const onChanges = useCallback((data: Record<string, any>) => {
    cd.current = { ...cd.current, ...data }
    mergeChange()
  }, [])
  const revertChanges = useCallback(async () => {
    // Async due to buttons progress indicator
    cd.current = {}
    mergeChange()
  }, [])
  const [fieldsWithErrors, setFieldsWithErrors] = useState<string[]>([])
  const onDataError = useCallback((hasError: boolean, field: string) => {
    const errors = new Set(fieldsWithErrors)
    if (hasError) {
      errors.add(field)
    } else {
      errors.delete(field)
    }
    setFieldsWithErrors(Array.from(errors))
  }, [fieldsWithErrors])
  const clearBlobs = useCallback(() => {
    for (const k in cd.current) {
        const c = cd.current[k] as any
        if (c.startsWith && c.startsWith('blob:')) {
            delete cd.current[k]
        }
    }
    setChangedNotifier(Math.random())
}, [])
  return { originalDataRef: og, data: data.current, changedData: cd.current, onDataError, onChange, onChanges, revertChanges, clearBlobs, changedDataRef: cd, hasError: fieldsWithErrors.length > 0 }
}
