'use client'

import React, { useEffect, useRef } from 'react'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { FormattedText } from './rich-text'
import { motionOK } from '@/lib/motion'

export type ChoiceValue = { choice: string; why: string }

type Props = {
    label: string
    instruction?: string
    options: string[]
    whyPrompt?: string
    value?: ChoiceValue
    onChange?: (value: ChoiceValue) => void
    labelClassName?: string
}

const LETTERS = ["a", "b", "c", "d", "e", "f"]

/**
 * An editorial single-select: quiet rows divided by hairlines.
 * Choosing one reveals the "why" beneath it.
 */
const CustomChoice = ({ label, instruction, options, whyPrompt, value, onChange, labelClassName }: Props) => {
    const choice = value?.choice ?? ""
    const why = value?.why ?? ""
    const dotRefs = useRef<(HTMLSpanElement | null)[]>([])

    // the dot only exists after the selection renders, so pop it in here
    useEffect(() => {
        if (!choice || !motionOK()) return
        const dot = dotRefs.current[options.indexOf(choice)]
        if (!dot) return
        import('animejs').then(({ animate }) => {
            animate(dot, {
                scale: [0.3, 1],
                duration: 400,
                ease: 'outBack',
            })
        })
    }, [choice, options])

    return (
        <Field>
            <FieldLabel className={labelClassName ?? "text-xl"}>
                <FormattedText text={label} />
            </FieldLabel>

            <div role="radiogroup" className="flex flex-col border-t border-border">
                {options.map((option, i) => {
                    const selected = option === choice
                    return (
                        <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onChange?.({ choice: option, why })}
                            className="group flex cursor-pointer items-baseline gap-4 border-b border-border py-3.5 text-left outline-none transition-colors duration-(--dur-quick) hover:bg-muted/40 focus-visible:bg-muted/40"
                        >
                            <span className="w-4 shrink-0 font-mono text-xs text-muted-foreground/60">
                                {LETTERS[i]}.
                            </span>
                            <span
                                data-selected={selected}
                                className="flex-1 text-base text-muted-foreground transition-colors duration-(--dur-quick) group-hover:text-foreground data-[selected=true]:text-foreground"
                            >
                                {option}
                            </span>
                            <span className="relative flex size-4 shrink-0 translate-y-0.5 items-center justify-center">
                                <span
                                    data-selected={selected}
                                    className="size-2 rounded-full border border-border transition-colors duration-(--dur-quick) data-[selected=true]:border-flow-accent"
                                />
                                {selected && (
                                    <span
                                        ref={(el) => { dotRefs.current[i] = el }}
                                        className="absolute size-2 rounded-full bg-flow-accent"
                                    />
                                )}
                            </span>
                        </button>
                    )
                })}
            </div>

            {whyPrompt && (
                <div
                    className="grid transition-[grid-template-rows] duration-(--dur-gentle) ease-(--ease-out-quart)"
                    style={{ gridTemplateRows: choice ? "1fr" : "0fr" }}
                >
                    <div className="overflow-hidden">
                        <Textarea
                            placeholder={whyPrompt}
                            className="h-24"
                            value={why}
                            onChange={(e) => onChange?.({ choice, why: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {instruction && (
                <FieldDescription>
                    <FormattedText text={instruction} />
                </FieldDescription>
            )}
        </Field>
    )
}

export default CustomChoice
