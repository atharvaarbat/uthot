import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
    text: string
    className?: string
    /** applied to every animatable character span (`.split-char`) */
    charClassName?: string
    /** initial transform so text is masked until the animation runs */
    hidden?: boolean
}

/**
 * Splits text into per-character spans (grouped by word so wrapping
 * stays clean), each word wrapped in an overflow mask. Animate the
 * `.split-char` spans with GSAP or anime.js.
 */
export function SplitChars({ text, className, charClassName, hidden = true }: Props) {
    const words = text.split(' ')
    return (
        <span className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden>
                {words.map((word, wi) => (
                    <span
                        key={wi}
                        className="inline-block overflow-hidden align-bottom whitespace-pre pb-[0.1em] -mb-[0.1em]"
                    >
                        {[...word].map((char, ci) => (
                            <span
                                key={ci}
                                className={cn('split-char inline-block will-change-transform', charClassName)}
                                style={hidden ? { transform: 'translateY(115%)' } : undefined}
                            >
                                {char}
                            </span>
                        ))}
                        {wi < words.length - 1 && <span> </span>}
                    </span>
                ))}
            </span>
        </span>
    )
}
