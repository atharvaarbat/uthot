'use client'

import React, { useEffect, useRef } from 'react'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { FormattedText } from './rich-text'

export type ScaleValue = { level: number; evidence: string }

type Props = {
    label: string
    instruction?: string
    steps: string[]
    evidencePlaceholder: string
    value?: ScaleValue
    onChange?: (value: ScaleValue) => void
    labelClassName?: string
}

/**
 * A severity dial: a hairline with notches, from "annoying" to
 * "I would pay today". Picking a notch reveals the evidence field.
 */
const CustomScale = ({ label, instruction, steps, evidencePlaceholder, value, onChange, labelClassName }: Props) => {
    const level = value?.level ?? -1
    const evidence = value?.evidence ?? ""
    const chosen = level >= 0
    const stepLabelRef = useRef<HTMLParagraphElement>(null)

    // the chosen step's name settles in below the dial
    useEffect(() => {
        if (!chosen || !stepLabelRef.current) return
        import('animejs').then(({ animate }) => {
            if (!stepLabelRef.current) return
            animate(stepLabelRef.current, {
                opacity: [0, 1],
                translateY: [6, 0],
                duration: 350,
                ease: 'outQuart',
            })
        })
    }, [level, chosen])

    return (
        <Field>
            <FieldLabel className={labelClassName ?? "text-xl"}>
                <FormattedText text={label} />
            </FieldLabel>

            <div role="radiogroup" aria-label="severity" className="pt-4">
                <div className="relative flex h-8 items-center">
                    <div className="absolute inset-x-0 h-px bg-border" />
                    <div
                        className="absolute h-px origin-left bg-flow-accent transition-transform duration-(--dur-gentle) ease-(--ease-out-quart)"
                        style={{
                            width: "100%",
                            transform: `scaleX(${chosen ? level / (steps.length - 1) : 0})`,
                        }}
                    />
                    <div className="relative flex w-full items-center justify-between">
                        {steps.map((step, i) => {
                            const active = chosen && i <= level
                            const selected = i === level
                            return (
                                <button
                                    key={step}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    aria-label={step}
                                    title={step}
                                    onClick={() => onChange?.({ level: i, evidence })}
                                    className="group relative -m-2 flex size-8 cursor-pointer items-center justify-center outline-none"
                                >
                                    <span
                                        data-active={active}
                                        data-selected={selected}
                                        className="size-2.5 rounded-full border border-border bg-background transition-all duration-(--dur-quick) group-hover:border-muted-foreground group-focus-visible:ring-3 group-focus-visible:ring-ring/30 data-[active=true]:border-flow-accent data-[active=true]:bg-flow-accent data-[selected=true]:scale-[1.4]"
                                    />
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-2 flex items-baseline justify-between font-mono text-xs text-muted-foreground/70">
                    <span>{steps[0].toLowerCase()}</span>
                    <span className="text-right">{steps[steps.length - 1].toLowerCase()}</span>
                </div>

                <p
                    ref={stepLabelRef}
                    className="mt-4 min-h-7 text-center font-serif text-lg italic text-flow-accent"
                    aria-live="polite"
                >
                    {chosen ? steps[level] : ""}
                </p>
            </div>

            <div
                className="grid transition-[grid-template-rows] duration-(--dur-gentle) ease-(--ease-out-quart)"
                style={{ gridTemplateRows: chosen ? "1fr" : "0fr" }}
            >
                <div className="overflow-hidden">
                    <Textarea
                        placeholder={evidencePlaceholder}
                        className="h-28"
                        value={evidence}
                        onChange={(e) => onChange?.({ level, evidence: e.target.value })}
                    />
                </div>
            </div>

            {instruction && (
                <FieldDescription>
                    <FormattedText text={instruction} />
                </FieldDescription>
            )}
        </Field>
    )
}

export default CustomScale
