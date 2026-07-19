'use client'

/** true when the user has not asked for reduced motion */
export function motionOK(): boolean {
    if (typeof window === 'undefined') return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** duration in seconds, collapsed to near-zero under reduced motion */
export function dur(seconds: number): number {
    return motionOK() ? seconds : 0.001
}
