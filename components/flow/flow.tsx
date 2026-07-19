'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, CornerDownLeft } from 'lucide-react'
import { SECTIONS, STEPS, TOTAL_QUESTIONS } from '@/lib/questions'
import { readCursor, useAnswers, useHydrated, writeCursor } from '@/lib/use-answers'
import { dur } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { SectionGate } from './section-gate'
import { QuestionView } from './question-view'

gsap.registerPlugin(useGSAP)

/**
 * The room itself. One step on stage at a time; GSAP carries each
 * step off and the next one on. Everything else stays out of the way.
 */
export default function Flow() {
    const router = useRouter()
    const { answers, setAnswer, loaded } = useAnswers()
    const hydrated = useHydrated()
    // resumes where the founder left off; SSR renders the empty room
    const [cursor, setCursor] = useState<number | null>(() =>
        typeof window === 'undefined' ? null : Math.min(readCursor(), STEPS.length - 1)
    )
    const [focusMode, setFocusMode] = useState(false)

    const rootRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const barRef = useRef<HTMLDivElement>(null)
    const animating = useRef(false)
    const direction = useRef<1 | -1>(1)

    useEffect(() => {
        if (cursor !== null) writeCursor(cursor)
    }, [cursor])

    // running question number for each step index
    const ordinals = useMemo(() => {
        let n = 0
        return STEPS.map((s) => (s.kind === 'question' ? ++n : n))
    }, [])

    const step = cursor === null ? null : STEPS[cursor]
    const section = step ? SECTIONS[step.section] : null

    const leave = useCallback((dirn: 1 | -1, onDone: () => void) => {
        direction.current = dirn
        animating.current = true
        gsap.to(stageRef.current, {
            opacity: 0,
            y: -34 * dirn,
            filter: 'blur(6px)',
            duration: dur(0.32),
            ease: 'power2.in',
            onComplete: onDone,
        })
    }, [])

    const go = useCallback(
        (delta: 1 | -1) => {
            if (cursor === null || animating.current) return
            const next = cursor + delta
            if (next < 0) return
            if (next >= STEPS.length) {
                leave(1, () => router.push('/review'))
                return
            }
            leave(delta, () => setCursor(next))
        },
        [cursor, leave, router]
    )

    const jumpToSection = useCallback(
        (sectionIndex: number) => {
            if (cursor === null || animating.current) return
            const target = STEPS.findIndex((s) => s.kind === 'gate' && s.section === sectionIndex)
            if (target === -1 || target === cursor) return
            leave(target > cursor ? 1 : -1, () => setCursor(target))
        },
        [cursor, leave]
    )

    // each step walks on stage: rise, unblur, pieces settle in order
    useGSAP(
        () => {
            const stage = stageRef.current
            if (!hydrated || cursor === null || !stage) return
            const kind = STEPS[cursor].kind

            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                onComplete: () => {
                    animating.current = false
                    if (kind === 'question') {
                        // first *visible* input — the evidence/why fields start collapsed
                        Array.from(stage.querySelectorAll<HTMLElement>('textarea, input'))
                            .find((el) => el.offsetHeight > 0)
                            ?.focus({ preventScroll: true })
                    }
                },
            })

            tl.fromTo(
                stage,
                { opacity: 0, y: 40 * direction.current, filter: 'blur(6px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: dur(kind === 'question' ? 0.5 : 0.7),
                    clearProps: 'filter',
                }
            )

            if (kind !== 'gate') {
                const pieces = stage.querySelectorAll<HTMLElement>('[data-animate], [data-slot=field] > *')
                if (pieces.length) {
                    tl.fromTo(
                        pieces,
                        { opacity: 0, y: 22 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: dur(kind === 'underneath' ? 0.85 : 0.55),
                            stagger: dur(0.08),
                            clearProps: 'opacity,transform',
                        },
                        '<0.1'
                    )
                }
            }

            if (barRef.current) {
                gsap.to(barRef.current, {
                    scaleX: cursor / (STEPS.length - 1),
                    duration: dur(0.6),
                    ease: 'power2.inOut',
                })
            }
        },
        { dependencies: [cursor, hydrated], scope: rootRef }
    )

    // ↵ steps through gates; ctrl/⌘ + ↵ answers and moves on
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Enter') return
            if (cursor === null) return
            const kind = STEPS[cursor].kind
            if (kind === 'question' && !(e.metaKey || e.ctrlKey)) return
            e.preventDefault()
            go(1)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [cursor, go])

    if (!hydrated || !loaded || cursor === null || !step || !section) {
        return <div className="min-h-dvh" />
    }

    const chromeDim = focusMode ? 'opacity-25' : 'opacity-100'

    return (
        <div
            ref={rootRef}
            className="relative min-h-dvh"
            onFocusCapture={(e) => {
                if (e.target instanceof HTMLElement && e.target.matches('textarea, input')) setFocusMode(true)
            }}
            onBlurCapture={() => setFocusMode(false)}
        >
            {/* hairline of progress */}
            <div className="fixed inset-x-0 top-0 z-40 h-px bg-border/60">
                <div ref={barRef} className="h-px origin-left scale-x-0 bg-flow-accent" />
            </div>

            {/* quiet chrome */}
            <header
                className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 transition-opacity duration-(--dur-gentle) ${chromeDim}`}
            >
                <Link href="/">
                <div className="flex items-center gap-2">
                    <img src={'/logo.svg'} className='h-8 w-10' />
                    <img src={'/uthot.svg'} className='h-6 ' />
                </div>
                </Link>
                <div className="flex items-center gap-4">
                    {step.kind === 'question' && (
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            Q {String(ordinals[cursor]).padStart(2, '0')} / {TOTAL_QUESTIONS}
                        </span>
                    )}
                    <ThemeToggle />
                </div>
            </header>

            {/* the seven gates, in the margin */}
            <nav
                aria-label="sections"
                className={`fixed top-1/2 left-6 z-30 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-(--dur-gentle) lg:flex ${chromeDim}`}
            >
                {SECTIONS.map((s, i) => {
                    const active = i === step.section
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => jumpToSection(i)}
                            data-active={active}
                            className="group flex cursor-pointer items-baseline gap-3 text-left font-mono text-[10px] tracking-widest text-muted-foreground/40 uppercase outline-none transition-colors duration-(--dur-quick) hover:text-muted-foreground data-[active=true]:text-flow-accent"
                        >
                            <span className="tabular-nums">{String(s.number).padStart(2, '0')}</span>
                            <span
                                className="opacity-0 transition-opacity duration-(--dur-standard) group-hover:opacity-100 group-data-[active=true]:opacity-100"
                            >
                                {s.title}
                            </span>
                        </button>
                    )
                })}
            </nav>

            {/* the stage */}
            <main className="flex min-h-dvh items-center justify-center px-6 py-28">
                <div ref={stageRef} className="w-full max-w-(--flow-measure) opacity-0">
                    {step.kind === 'gate' && (
                        <div className="flex justify-center">
                            <SectionGate section={section} onEnter={() => go(1)} />
                        </div>
                    )}

                    {step.kind === 'underneath' && section.underneath && (
                        <div className="flex flex-col items-center gap-8 text-center">
                            <p
                                data-animate
                                className="font-mono text-xs tracking-[0.35em] text-muted-foreground/70 uppercase"
                            >
                                The real question underneath
                            </p>
                            <p data-animate className="max-w-2xl font-serif text-3xl leading-snug italic sm:text-4xl">
                                {section.underneath}
                            </p>
                            <button
                                type="button"
                                data-animate
                                onClick={() => go(1)}
                                className="mt-8 cursor-pointer font-mono text-xs text-muted-foreground/60 underline decoration-border underline-offset-4 outline-none transition-colors duration-(--dur-quick) hover:text-foreground focus-visible:text-foreground"
                            >
                                sit with it, then continue <kbd className="ml-1 rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
                            </button>
                        </div>
                    )}

                    {step.kind === 'question' && (
                        <div className="flex flex-col gap-8">
                            {/* <p data-animate className="font-mono text-xs tracking-[0.3em] text-muted-foreground/70 uppercase">
                                {String(section.number).padStart(2, '0')} · {section.title}
                                <span className="mx-3 text-border">—</span>
                                {step.question + 1} of {section.questions.length}
                            </p> */}

                            <QuestionView
                                question={section.questions[step.question]}
                                value={answers[section.questions[step.question].id]}
                                onChange={(v) => setAnswer(section.questions[step.question].id, v)}
                            />

                            <div data-animate className="flex items-center justify-between pt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => go(-1)}
                                    className="gap-2 text-muted-foreground"
                                >
                                    <ArrowLeft data-icon="inline-start" />
                                    back
                                </Button>
                                <div className="flex items-center gap-3">
                                    <span className={`font-mono text-[10px] text-muted-foreground/50 transition-opacity duration-(--dur-gentle) ${focusMode ? 'opacity-100' : 'opacity-0'}`}>
                                        ctrl ↵
                                    </span>
                                    <Button onClick={() => go(1)} className="gap-2">
                                        Continue
                                        <CornerDownLeft data-icon="inline-end" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
