'use client'

import React from 'react'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormattedText } from './rich-text'

export type DateMomentValue = { date: string; note: string }

type Props = {
    label: string
    instruction?: string
    notePlaceholder: string
    value?: DateMomentValue
    onChange?: (value: DateMomentValue) => void
    labelClassName?: string
}

/** A dated memory: the day it happened, and what happened. */
const CustomDateMoment = ({ label, instruction, notePlaceholder, value, onChange, labelClassName }: Props) => {
    const date = value?.date ?? ""
    const note = value?.note ?? ""

    return (
        <Field>
            <FieldLabel className={labelClassName ?? "text-xl"}>
                <FormattedText text={label} />
            </FieldLabel>

            <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest">
                    the date
                </span>
                <Input
                    type="date"
                    value={date}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => onChange?.({ date: e.target.value, note })}
                    className="w-fit font-mono text-sm tabular-nums"
                />
            </div>

            <Textarea
                placeholder={notePlaceholder}
                className="h-32"
                value={note}
                onChange={(e) => onChange?.({ date, note: e.target.value })}
            />

            {instruction && (
                <FieldDescription>
                    <FormattedText text={instruction} />
                </FieldDescription>
            )}
        </Field>
    )
}

export default CustomDateMoment
