'use client'

import React, { useEffect, useRef } from 'react'
import type { Section } from '@/lib/questions'
import { SECTIONS } from '@/lib/questions'
import { motionOK } from '@/lib/motion'
import { SplitChars } from './split-chars'

type Props = {
    section: Section
    onEnter: () => void
}

/**
 * The threshold between sections. A held breath: number, title,
 * a rule drawing itself, and the gate question. anime.js territory.
 */
export function SectionGate({ section, onEnter }: Props) {
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        if (!motionOK()) {
            root.querySelectorAll<HTMLElement>('.split-char').forEach((el) => {
                el.style.transform = 'none'
            })
            root.querySelectorAll<HTMLElement>('.gate-fade').forEach((el) => {
                el.style.opacity = '1'
                el.style.transform = 'none'
            })
            const rule = root.querySelector<HTMLElement>('.gate-rule')
            if (rule) rule.style.transform = 'scaleX(1)'
            return
        }

        let scope: { revert: () => void } | undefined
        let cancelled = false
        import('animejs').then(({ createScope, animate, stagger }) => {
            if (cancelled || !rootRef.current) return
            scope = createScope({ root: rootRef.current }).add(() => {
                animate('.split-char', {
                    translateY: ['115%', '0%'],
                    duration: 850,
                    delay: stagger(24, { start: 150 }),
                    ease: 'outExpo',
                })
                animate('.gate-rule', {
                    scaleX: [0, 1],
                    duration: 900,
                    delay: 500,
                    ease: 'outQuart',
                })
                animate('.gate-fade', {
                    opacity: [0, 1],
                    translateY: [10, 0],
                    duration: 700,
                    delay: stagger(140, { start: 700 }),
                    ease: 'outQuart',
                })
            })
        })
        return () => {
            cancelled = true
            scope?.revert()
        }
    }, [section.id])

    return (
        <div
            ref={rootRef}
            onClick={onEnter}
            className="flex cursor-pointer flex-col items-center gap-0 text-center select-none"
        >
            <p className="gate-fade font-mono text-xs tracking-[0.35em] text-muted-foreground/70 uppercase opacity-0">
                Gate {String(section.number).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')}
            </p>

            <h1 className="mt-6 font-serif text-(length:--gate-display) leading-[1.05] tracking-tight">
                <SplitChars text={section.title} />
            </h1>

            <div className="gate-rule mt-8 h-px w-24 origin-left bg-flow-accent" style={{ transform: 'scaleX(0)' }} />

            <p className="gate-fade mt-8 font-serif text-2xl italic text-muted-foreground opacity-0">
                &ldquo;{section.gate}&rdquo;
            </p>

            <p className="gate-fade mt-16 font-mono text-xs text-muted-foreground/60 opacity-0">
                {section.questions.length} questions —{' '}
                <button
                    type="button"
                    onClick={onEnter}
                    className="cursor-pointer underline decoration-border underline-offset-4 outline-none transition-colors duration-(--dur-quick) hover:text-foreground focus-visible:text-foreground"
                >
                    step through
                </button>{' '}
                <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
            </p>
        </div>
    )
}
