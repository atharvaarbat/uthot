'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft } from 'lucide-react'
import { dur } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { SplitChars } from './split-chars'

gsap.registerPlugin(useGSAP)

export default function Story() {
    const rootRef = useRef<HTMLDivElement>(null)

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
                    '.story-rule',
                    { scaleX: 0 },
                    { scaleX: 1, duration: dur(0.9), ease: 'power2.out' },
                    '<0.35'
                )
                .fromTo(
                    '.story-fade',
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: dur(0.7), stagger: dur(0.12) },
                    '<0.15'
                )
        },
        { scope: rootRef }
    )

    return (
        <div ref={rootRef} className="relative min-h-dvh">
            <header className="story-fade flex items-center justify-between px-6 py-5 opacity-0">
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <img src={'/logo.svg'} className='h-8 w-10' />
                        <img src={'/uthot.svg'} className='h-6 ' />
                    </div>
                </Link>
                <ThemeToggle />
            </header>

            <main className="mx-auto max-w-(--flow-measure) px-6 pb-32">
                <div className="pt-16 sm:pt-24">
                    <p className="story-fade font-mono text-xs tracking-[0.35em] text-muted-foreground/70 uppercase opacity-0">
                        The story
                    </p>

                    <h1 className="story-fade mt-8 font-serif text-[clamp(2rem,5vw,3.75rem)] leading-[1.08] tracking-tight text-balance opacity-0">
                        <SplitChars text="The ideas that burned bright and faded." />
                    </h1>

                    <div className="story-rule mt-8 h-px w-24 origin-center bg-flow-accent" />
                </div>

                <div className="mt-12 space-y-5 text-base leading-[1.75] text-muted-foreground sm:text-lg sm:leading-[1.8]">
                    <p className="story-fade opacity-0">
                        I know the feeling. It&apos;s late, and the idea hits you like a
                        current — sudden, undeniable, yours. You can&apos;t sleep. You&apos;re
                        already mapping the product, drafting the landing page, imagining the
                        pitch. By morning you&apos;re certain: this is it.
                    </p>

                    <p className="story-fade opacity-0">
                        Then you tell someone. A co-founder, an investor, a friend who
                        nods politely and asks the question you hadn&apos;t prepared for. You
                        stumble. The current flickers. By the next week the idea is a folder
                        in your drive you avoid opening.
                    </p>

                    <p className="story-fade opacity-0">
                        I&apos;ve been through that cycle more times than I can count.
                        Each time I told myself the next idea would be different. It never
                        was — until I stopped falling in love with answers and started
                        sitting with questions.
                    </p>

                    <div className="story-fade my-10 h-px w-full bg-border/60 opacity-0" />

                    <p className="story-fade opacity-0">
                        The seven gates didn&apos;t start as a product. They started as a
                        document titled &ldquo;things I forgot to ask.&rdquo; After enough
                        failed launches and polite rejections, patterns emerged — the same
                        blind spots, the same assumptions, the same rush to solution before
                        the problem was even real.
                    </p>

                    <p className="story-fade opacity-0">
                        I began writing down every question that had ever killed an idea of
                        mine. Not to avoid those questions — to face them on purpose, before
                        anyone else could. The list grew. It got organized. It became a
                        ritual.
                    </p>

                    <p className="story-fade opacity-0">
                        Thirty-five questions. Seven gates. No shortcuts.
                    </p>

                    <div className="story-fade my-10 h-px w-full bg-border/60 opacity-0" />

                    <p className="story-fade opacity-0">
                        This is not a validation tool. It won&apos;t tell you if your idea
                        is good. It will show you if you&apos;ve thought deeply enough to
                        deserve an opinion. The questions don&apos;t care about your pitch
                        deck. They care about the truth underneath it.
                    </p>

                    <p className="story-fade opacity-0">
                        What you write here stays here. There is no export to investors, no
                        share button, no score. Just you and the parts of your thinking you
                        usually skip.
                    </p>

                    <p className="story-fade opacity-0">
                        I built this because I needed it. If you&apos;ve ever had an idea
                        that burned bright and faded before you understood why, these gates
                        are for you.
                    </p>
                    <p className="story-fade opacity-0">
                        - Atharva Arbat <br/>
                        <a href="mailto:atharva.arbat@hdtl.in" 
                        className="underline text-sm">
                        atharva.arbat@hdtl.in
                        </a>
                    </p>
                </div>

                <div className="story-fade mt-14 flex items-center gap-4 opacity-0">
                    <Button variant="outline" size="lg" render={<Link href="/" />} className="gap-2">
                        <ArrowLeft data-icon="inline-start" />
                        Back
                    </Button>
                    <Button size="lg" render={<Link href="/reflect" />}>
                        Begin the gates
                    </Button>
                </div>
            </main>
        </div>
    )
}
