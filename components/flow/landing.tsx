'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SECTIONS, TOTAL_QUESTIONS } from '@/lib/questions'
import { useHasProgress } from '@/lib/use-answers'
import { dur } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { SplitChars } from './split-chars'

gsap.registerPlugin(useGSAP)

export default function Landing() {
    const rootRef = useRef<HTMLDivElement>(null)
    const hasProgress = useHasProgress()

    useGSAP(
        () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
            tl.to('.split-char', {
                y: 0,
                duration: dur(1),
                stagger: dur(0.018),
                ease: 'expo.out',
            })
                .fromTo(
                    '.landing-rule',
                    { scaleX: 0 },
                    { scaleX: 1, duration: dur(0.9), ease: 'power2.out' },
                    '<0.35'
                )
                .fromTo(
                    '.landing-fade',
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: dur(0.7), stagger: dur(0.12) },
                    '<0.15'
                )
        },
        { scope: rootRef }
    )

    return (
        <div ref={rootRef} className="relative flex min-h-dvh flex-col">
            <header className="landing-fade flex items-center justify-between px-6 py-5 opacity-0">
                <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
                    noai
                </span>
                <ThemeToggle />
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="landing-fade font-mono text-xs tracking-[0.35em] text-muted-foreground/70 uppercase opacity-0">
                    A thinking instrument for founders
                </p>

                <h1 className="mt-8 max-w-4xl font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.04] tracking-tight text-balance">
                    <SplitChars text="Seven gates between you and your next year." />
                </h1>

                <div className="landing-rule mt-10 h-px w-24 origin-center bg-flow-accent" />

                <p className="landing-fade mt-10 max-w-xl text-base leading-relaxed text-muted-foreground opacity-0">
                    {TOTAL_QUESTIONS} questions that want the truth before the pitch.
                    No feed, no copilot, no pasting — just you, thinking.
                    Everything you write stays in this browser.
                </p>

                <div className="landing-fade mt-12 flex items-center gap-4 opacity-0">
                    <Button size="lg" render={<Link href="/reflect" />}>
                        {hasProgress ? 'Resume thinking' : 'Begin'}
                    </Button>
                    {hasProgress && (
                        <Button variant="ghost" size="lg" render={<Link href="/review" />} className="text-muted-foreground">
                            read what you wrote
                        </Button>
                    )}
                </div>
            </main>

            <footer className="landing-fade px-6 pb-8 opacity-0">
                <p className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-widest text-muted-foreground/50 uppercase">
                    {SECTIONS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            {i > 0 && <span className="text-border">·</span>}
                            <span>{s.gate}</span>
                        </React.Fragment>
                    ))}
                </p>
            </footer>
        </div>
    )
}
