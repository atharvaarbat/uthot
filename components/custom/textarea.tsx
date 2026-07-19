'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { FormattedText } from './rich-text'

type Props = {
    label: string
    instruction?: string
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    /** words the writer is not allowed to hide behind */
    forbidden?: string[]
    autoFocus?: boolean
    labelClassName?: string
}

const CustomTextarea = ({
    label,
    instruction,
    value,
    onChange,
    placeholder = "What's on your mind?",
    forbidden,
    autoFocus,
    labelClassName,
}: Props) => {
    const [message, setMessage] = useState<string | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const warningRef = useRef<HTMLParagraphElement>(null)
    const lastCaught = useRef<string | null>(null)

    const caughtWord = useMemo(() => {
        if (!forbidden?.length || !value) return null
        const pattern = new RegExp(`\\b(${forbidden.join("|")})\\b`, "i")
        return value.match(pattern)?.[1] ?? null
    }, [forbidden, value])

    // shake the warning line when a fresh forbidden word appears
    useEffect(() => {
        const word = caughtWord?.toLowerCase() ?? null
        if (word && word !== lastCaught.current && warningRef.current) {
            import('animejs').then(({ animate }) => {
                if (!warningRef.current) return
                animate(warningRef.current, {
                    translateX: [0, -5, 4, -3, 2, 0],
                    duration: 360,
                    ease: 'outQuad',
                })
            })
        }
        lastCaught.current = word
    }, [caughtWord])

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
            <FieldLabel className={labelClassName ?? "text-xl"}>
                <FormattedText text={label} />
            </FieldLabel>

            <Textarea
                placeholder={placeholder}
                className="h-32"
                onPaste={handlePaste}
                onChange={(e) => {
                    onChange?.(e.target.value)
                }}
                value={value}
                autoFocus={autoFocus}
            />

            <FieldDescription>
                {instruction && <FormattedText text={instruction} />}
                <p
                    ref={warningRef}
                    data-show={caughtWord !== null}
                    className='hidden data-[show=true]:block text-flow-accent pt-1'
                >
                    {caughtWord && (
                        <>&ldquo;{caughtWord}&rdquo; — that word is doing the thinking for you.</>
                    )}
                </p>
                <p data-show={message !== null} className='opacity-0 data-[show=true]:opacity-100 transition-all duration-300'>
                    {message}
                </p>
            </FieldDescription>
        </Field>
    )
}

export default CustomTextarea
