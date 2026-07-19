'use client'

import React, { useEffect, useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormattedText } from './rich-text'
import { motionOK } from '@/lib/motion'

export type ListValue = { items: string[]; marked?: number }

type Props = {
    label: string
    instruction?: string
    minItems: number
    maxItems: number
    itemPlaceholder: string
    /** when set, one item can be circled — pencil around the killer assumption */
    markOne?: string
    value?: ListValue
    onChange?: (value: ListValue) => void
    labelClassName?: string
}

/* a slightly wobbly ellipse, drawn like a pen stroke around the row */
const CIRCLE_PATH =
    "M87.571 1.48486C44.2623 7.67091 5.70249 14.8247 4.41916 18.5779C1.2556 19.9797 -2.475 25.9577 11.8505 29.9732C26.1761 33.9887 58.1996 35.3092 86.0747 36.4849C95.6251 35.9422 133.091 33.8349 145.973 32.5508C159.582 31.1942 200.5 30.3802 200.5 20.0701C200.5 7.58951 192.621 9.35308 165.134 4.60497C133.198 -0.911641 79.539 3.44108 66.2878 4.60497C55.6869 5.53609 39.0693 6.80175 32.0856 7.3182"

function HandDrawnCircle() {
    const pathRef = useRef<SVGPathElement>(null)

    useEffect(() => {
        const path = pathRef.current
        if (!path || !motionOK()) return
        let cancelled = false
        import('animejs').then(({ animate }) => {
            if (cancelled || !pathRef.current) return
            animate(pathRef.current, {
                strokeDashoffset: [1, 0],
                duration: 650,
                ease: 'inOutQuart',
            })
        })
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <svg
            className="pointer-events-none absolute -inset-x-3 inset-y-0 h-full w-[calc(100%+1.5rem)]"
            viewBox="0 0 200 56"
            preserveAspectRatio="none"
            aria-hidden
        >
            <path
                ref={pathRef}
                d={CIRCLE_PATH}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={motionOK() ? 1 : 0}
                fill="none"
                stroke="var(--flow-accent)"
                strokeWidth={1.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

const CustomList = ({
    label,
    instruction,
    minItems,
    maxItems,
    itemPlaceholder,
    markOne,
    value,
    onChange,
    labelClassName,
}: Props) => {
    const items = value?.items?.length ? value.items : Array<string>(minItems).fill("")
    const marked = value?.marked
    const growable = maxItems > minItems
    const rowRefs = useRef<(HTMLDivElement | null)[]>([])
    const justAdded = useRef<number | null>(null)

    const commit = (next: Partial<ListValue>) => {
        onChange?.({ items, marked, ...next })
    }

    const setItem = (i: number, text: string) => {
        const next = [...items]
        next[i] = text
        commit({ items: next })
    }

    const addRow = () => {
        if (items.length >= maxItems) return
        justAdded.current = items.length
        commit({ items: [...items, ""] })
    }

    const removeRow = (i: number) => {
        const next = items.filter((_, idx) => idx !== i)
        let nextMarked = marked
        if (marked !== undefined) {
            if (marked === i) nextMarked = undefined
            else if (marked > i) nextMarked = marked - 1
        }
        commit({ items: next, marked: nextMarked })
    }

    // slide freshly added rows in, then hand them focus
    useEffect(() => {
        const index = justAdded.current
        if (index === null) return
        justAdded.current = null
        const row = rowRefs.current[index]
        if (!row) return
        row.querySelector("input")?.focus()
        if (!motionOK()) return
        import('animejs').then(({ animate }) => {
            animate(row, {
                opacity: [0, 1],
                translateY: [10, 0],
                duration: 380,
                ease: 'outQuart',
            })
        })
    }, [items.length])

    return (
        <Field>
            <FieldLabel className={labelClassName ?? "text-xl"}>
                <FormattedText text={label} />
            </FieldLabel>

            <div className="flex flex-col">
                {items.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => { rowRefs.current[i] = el }}
                        className="group/row relative flex items-center gap-4 border-b border-border"
                    >
                        <span className="w-5 shrink-0 font-mono text-xs text-muted-foreground/60 tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="relative flex-1">
                            {marked === i && <HandDrawnCircle key={`circle-${i}`} />}
                            <Input
                                value={item}
                                placeholder={itemPlaceholder}
                                onChange={(e) => setItem(i, e.target.value)}
                                className="h-12 rounded-none border-0 bg-transparent px-0 text-base focus-visible:border-transparent focus-visible:ring-0"
                            />
                        </div>
                        {markOne && item.trim() && (
                            <button
                                type="button"
                                title={marked === i ? "uncircle" : "circle it — this one kills everything"}
                                aria-pressed={marked === i}
                                onClick={() => commit({ marked: marked === i ? undefined : i })}
                                data-marked={marked === i}
                                className="shrink-0 cursor-pointer rounded-full px-2 py-1 font-mono text-xs text-muted-foreground/50 opacity-0 transition-all duration-(--dur-quick) group-hover/row:opacity-100 focus-visible:opacity-100 data-[marked=true]:text-flow-accent data-[marked=true]:opacity-100 hover:text-foreground"
                            >
                                ◯
                            </button>
                        )}
                        {growable && items.length > minItems && (
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                aria-label="remove this line"
                                onClick={() => removeRow(i)}
                                className="shrink-0 text-muted-foreground/50 opacity-0 transition-opacity duration-(--dur-quick) group-hover/row:opacity-100 focus-visible:opacity-100"
                            >
                                <X />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {growable && items.length < maxItems && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addRow}
                    className="w-fit gap-2 text-muted-foreground"
                >
                    <Plus data-icon="inline-start" />
                    one more
                </Button>
            )}

            <FieldDescription>
                {markOne && items.some((item) => item.trim()) ? (
                    <span className="text-flow-accent">{markOne}</span>
                ) : (
                    instruction && <FormattedText text={instruction} />
                )}
            </FieldDescription>
        </Field>
    )
}

export default CustomList
