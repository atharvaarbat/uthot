'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { AnswerMap, AnswerValue } from './questions'

const ANSWERS_KEY = 'uthot:answers:v1'
const CURSOR_KEY = 'uthot:cursor:v1'
const ANSWERS_EVENT = 'uthot:answers-changed'

export function readCursor(): number {
    if (typeof window === 'undefined') return 0
    const raw = window.localStorage.getItem(CURSOR_KEY)
    const n = raw === null ? 0 : Number(raw)
    return Number.isFinite(n) && n >= 0 ? n : 0
}

export function writeCursor(cursor: number) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(CURSOR_KEY, String(cursor))
}

export function clearAll() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(ANSWERS_KEY)
    window.localStorage.removeItem(CURSOR_KEY)
    window.dispatchEvent(new Event(ANSWERS_EVENT))
}

/* answers live in localStorage; the parsed map is cached per raw string
   so snapshots stay referentially stable for useSyncExternalStore */

const EMPTY: AnswerMap = {}
let cachedRaw: string | null = null
let cachedParsed: AnswerMap = EMPTY

function answersSnapshot(): AnswerMap {
    const raw = window.localStorage.getItem(ANSWERS_KEY)
    if (raw === cachedRaw) return cachedParsed
    cachedRaw = raw
    try {
        cachedParsed = raw ? (JSON.parse(raw) as AnswerMap) : EMPTY
    } catch {
        cachedParsed = EMPTY
    }
    return cachedParsed
}

function subscribeAnswers(onChange: () => void) {
    window.addEventListener('storage', onChange)
    window.addEventListener(ANSWERS_EVENT, onChange)
    return () => {
        window.removeEventListener('storage', onChange)
        window.removeEventListener(ANSWERS_EVENT, onChange)
    }
}

const emptySubscribe = () => () => {}

/** false during SSR/hydration, true once mounted on the client */
export function useHydrated(): boolean {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    )
}

/** whether the founder has anything saved — for "Resume" affordances */
export function useHasProgress(): boolean {
    return useSyncExternalStore(
        subscribeAnswers,
        () => readCursor() > 0 || window.localStorage.getItem(ANSWERS_KEY) !== null,
        () => false
    )
}

export function useAnswers() {
    const answers = useSyncExternalStore(subscribeAnswers, answersSnapshot, () => EMPTY)
    const loaded = useHydrated()

    const setAnswer = useCallback((id: string, value: AnswerValue) => {
        const next = { ...answersSnapshot(), [id]: value }
        window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(ANSWERS_EVENT))
    }, [])

    return { answers, setAnswer, loaded }
}
