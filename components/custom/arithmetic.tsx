'use client'

import React, { useEffect, useRef } from 'react'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormattedText } from './rich-text'
import { motionOK } from '@/lib/motion'

export type ArithmeticValue = { customers: string; price: string }

type Props = {
    label: string
    instruction?: string
    /** annual revenue target in dollars */
    target: number
    value?: ArithmeticValue
    onChange?: (value: ArithmeticValue) => void
    labelClassName?: string
}

const digitsOnly = (s: string) => s.replace(/[^\d]/g, "").slice(0, 12)
const withCommas = (s: string) => (s ? Number(s).toLocaleString("en-US") : "")

const compact = (n: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(n)

/**
 * The $100M long division. Two numbers, one product — the total
 * counts toward (or away from) the target as the founder types.
 */
const CustomArithmetic = ({ label, instruction, target, value, onChange, labelClassName }: Props) => {
    const customers = value?.customers ?? ""
    const price = value?.price ?? ""
    const total = (Number(customers) || 0) * (Number(price) || 0)

    const totalRef = useRef<HTMLSpanElement>(null)
    const shown = useRef(0)
    const anim = useRef<{ cancel: () => void } | null>(null)

    // count the product up/down instead of snapping it
    useEffect(() => {
        const el = totalRef.current
        if (!el) return
        const render = (n: number) => {
            el.textContent = `$${Math.round(n).toLocaleString("en-US")}`
        }
        anim.current?.cancel()
        if (!motionOK() || Math.abs(total - shown.current) < 1) {
            shown.current = total
            render(total)
            return
        }
        let cancelled = false
        import('animejs').then(({ animate }) => {
            if (cancelled) return
            const counter = { v: shown.current }
            anim.current = animate(counter, {
                v: total,
                duration: 600,
                ease: 'outExpo',
                onUpdate: () => {
                    shown.current = counter.v
                    render(counter.v)
                },
            })
        })
        return () => {
            cancelled = true
        }
    }, [total])

    const hasBoth = Boolean(customers && price)
    const clears = total >= target

    return (
        <Field>
            <FieldLabel className={labelClassName ?? "text-xl"}>
                <FormattedText text={label} />
            </FieldLabel>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-3 font-mono text-sm">
                <Input
                    inputMode="numeric"
                    placeholder="25,000"
                    value={withCommas(customers)}
                    onChange={(e) => onChange?.({ customers: digitsOnly(e.target.value), price })}
                    className="w-36 text-right font-mono tabular-nums"
                />
                <span className="text-muted-foreground">customers</span>
                <span className="text-muted-foreground/50">×</span>
                <span className="text-muted-foreground/50">$</span>
                <Input
                    inputMode="numeric"
                    placeholder="4,000"
                    value={withCommas(price)}
                    onChange={(e) => onChange?.({ customers, price: digitsOnly(e.target.value) })}
                    className="w-32 text-right font-mono tabular-nums"
                />
                <span className="text-muted-foreground">per customer, per year</span>
            </div>

            <div className="border-t border-border pt-4">
                <p className="font-mono text-3xl tabular-nums tracking-tight sm:text-4xl">
                    <span className="mr-3 text-muted-foreground/50">=</span>
                    <span ref={totalRef}>$0</span>
                    <span className="ml-3 text-sm text-muted-foreground">/ year</span>
                </p>
                <p
                    data-state={!hasBoth ? "idle" : clears ? "clears" : "short"}
                    className="mt-2 min-h-5 text-sm text-muted-foreground data-[state=clears]:text-flow-accent data-[state=idle]:opacity-0 transition-opacity duration-(--dur-standard)"
                    aria-live="polite"
                >
                    {hasBoth &&
                        (clears
                            ? `That clears ${compact(target)}.`
                            : `Still ${compact(target - total)} short of ${compact(target)} — raise the price, or find more humans.`)}
                </p>
            </div>

            {instruction && (
                <FieldDescription>
                    <FormattedText text={instruction} />
                </FieldDescription>
            )}
        </Field>
    )
}

export default CustomArithmetic
