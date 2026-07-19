'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { Download, Flame, Undo2 } from 'lucide-react'
import {
    SECTIONS,
    TOTAL_QUESTIONS,
    answerToPlainText,
    isAnswered,
} from '@/lib/questions'
import { clearAll, useAnswers } from '@/lib/use-answers'
import { motionOK } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { FormattedText } from '@/components/custom/rich-text'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** strip the rich-text authoring tokens for plain output */
const plain = (s: string) => s.replace(/#\$/g, '').replace(/[*_]/g, '')

export default function Review() {
    const router = useRouter()
    const { answers, loaded } = useAnswers()
    const rootRef = useRef<HTMLDivElement>(null)
    const articleRef = useRef<HTMLDivElement>(null)
    const barRef = useRef<HTMLDivElement>(null)

    const answeredCount = SECTIONS.flatMap((s) => s.questions).filter((q) =>
        isAnswered(q, answers[q.id])
    ).length

    // Lenis drives the scroll; GSAP's ticker drives Lenis
    useEffect(() => {
        if (!motionOK()) return
        const lenis = new Lenis({ autoRaf: false })
        lenis.on('scroll', () => ScrollTrigger.update())
        const raf = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)
        return () => {
            gsap.ticker.remove(raf)
            lenis.destroy()
        }
    }, [])

    useGSAP(
        () => {
            if (!loaded || !articleRef.current) return

            if (barRef.current) {
                gsap.fromTo(
                    barRef.current,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: articleRef.current,
                            start: 'top top',
                            end: 'bottom bottom',
                            scrub: true,
                        },
                    }
                )
            }

            if (!motionOK()) return
            gsap.utils.toArray<HTMLElement>('.review-block').forEach((block) => {
                gsap.fromTo(
                    block,
                    { opacity: 0, y: 36 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: block,
                            start: 'top 88%',
                            once: true,
                        },
                    }
                )
            })
        },
        { dependencies: [loaded], scope: rootRef }
    )

    const download = () => {
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        const lines: string[] = [
            '# uthot — the record',
            '',
            `_${today} · ${answeredCount} of ${TOTAL_QUESTIONS} answered_`,
            '',
        ]
        for (const section of SECTIONS) {
            lines.push(`## ${String(section.number).padStart(2, '0')} — ${section.title} · “${section.gate}”`, '')
            for (const q of section.questions) {
                lines.push(`**${plain(q.label)}**`, '')
                const text = answerToPlainText(q, answers[q.id])
                lines.push(text || '_left unanswered_', '')
            }
            if (section.underneath) {
                lines.push(`> The real question underneath: ${section.underneath}`, '')
            }
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'uthot-record.md'
        a.click()
        URL.revokeObjectURL(url)
    }

    const burn = () => {
        if (!window.confirm('Burn every answer and start from nothing?')) return
        clearAll()
        router.push('/')
    }

    if (!loaded) return <div className="min-h-dvh" />

    return (
        <div ref={rootRef} className="relative">
            <div className="fixed inset-x-0 top-0 z-40 h-px bg-border/60">
                <div ref={barRef} className="h-px origin-left scale-x-0 bg-flow-accent" />
            </div>

            <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-sm">
                
                <Link href="/">
                <div className="flex items-center gap-2">
                    <img src={'/logo.svg'} className='h-8 w-10' />
                    <img src={'/uthot.svg'} className='h-6 ' />
                </div>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={download} className="gap-2 text-muted-foreground">
                        <Download data-icon="inline-start" />
                        <span className="hidden sm:inline">keep it</span>
                    </Button>
                    <Button variant="ghost" size="sm" render={<Link href="/reflect" />} className="gap-2 text-muted-foreground">
                        <Undo2 data-icon="inline-start" />
                        <span className="hidden sm:inline">revisit</span>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={burn} className="gap-2">
                        <Flame data-icon="inline-start" />
                        <span className="hidden sm:inline">burn it</span>
                    </Button>
                    <ThemeToggle />
                </div>
            </header>

            <div ref={articleRef} className="mx-auto max-w-(--flow-measure) px-6 pt-40 pb-40">
                <div className="review-block text-center">
                    <p className="font-mono text-xs tracking-[0.35em] text-muted-foreground/70 uppercase">
                        The record
                    </p>
                    <h1 className="mt-6 font-serif text-5xl tracking-tight sm:text-6xl">
                        What you wrote.
                    </h1>
                    <p className="mt-6 font-mono text-xs text-muted-foreground tabular-nums">
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        <span className="mx-3 text-border">—</span>
                        {answeredCount} / {TOTAL_QUESTIONS} answered
                    </p>
                </div>

                {SECTIONS.map((section) => (
                    <section key={section.id} className="mt-28">
                        <div className="review-block">
                            <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground/70 uppercase">
                                Gate {String(section.number).padStart(2, '0')} — &ldquo;{section.gate}&rdquo;
                            </p>
                            <h2 className="mt-3 font-serif text-3xl tracking-tight">{section.title}</h2>
                            <div className="mt-6 h-px w-16 bg-flow-accent" />
                        </div>

                        <div className="mt-10 flex flex-col gap-10">
                            {section.questions.map((q) => {
                                const text = answerToPlainText(q, answers[q.id])
                                return (
                                    <div key={q.id} className="review-block">
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            <FormattedText text={q.label} />
                                        </p>
                                        {text ? (
                                            <p className="mt-3 font-serif text-lg leading-relaxed whitespace-pre-wrap">
                                                {text}
                                            </p>
                                        ) : (
                                            <p className="mt-3 font-serif text-lg italic text-muted-foreground/50">
                                                — left unanswered
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {section.underneath && (
                            <p className="review-block mt-12 border-l border-flow-accent pl-6 font-serif text-xl italic text-muted-foreground">
                                {section.underneath}
                            </p>
                        )}
                    </section>
                ))}

                <div className="review-block mt-32 text-center">
                    <p className="font-serif text-2xl italic text-muted-foreground">
                        Read it once more, slowly. Then go build the smallest true version.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Button onClick={download} className="gap-2">
                            <Download data-icon="inline-start" />
                            Download the record
                        </Button>
                        <Button variant="ghost" render={<Link href="/reflect" />} className="text-muted-foreground">
                            revisit the gates
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
