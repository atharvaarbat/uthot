'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { FormattedText } from './rich-text'

type Props = {
    label: string
    instruction: string
    value?: string
    onChange?: (value: string) => void
}

const CustomTextarea = ({ label, instruction, value, onChange }: Props) => {
    const [message, setMessage] = useState<string | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault()

        setMessage("Are you sure you want to live someone else's life?")

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setMessage(null)
        }, 4000)
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return (
        <Field>
            <FieldLabel className="text-xl">
                <FormattedText text={label} />
            </FieldLabel>

            <Textarea
                placeholder="What's on your mind?"
                className="h-32"
                onPaste={handlePaste}
                onChange={(e) => {
                    onChange && onChange(e.target.value)
                }}
                value={value}
            />

            <FieldDescription>
                <FormattedText text={instruction} />
                <p data-show={message !== null} className='opacity-0 data-[show=true]:opacity-100 transition-all duration-300'>
                    {message}
                </p>
            </FieldDescription>
        </Field>
    )
}

export default CustomTextarea