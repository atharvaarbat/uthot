'use client'

import React from 'react'
import type { AnswerValue, Question } from '@/lib/questions'
import CustomTextarea from '@/components/custom/textarea'
import CustomDateMoment, { type DateMomentValue } from '@/components/custom/date-moment'
import CustomScale, { type ScaleValue } from '@/components/custom/scale'
import CustomChoice, { type ChoiceValue } from '@/components/custom/choice'
import CustomList, { type ListValue } from '@/components/custom/list'
import CustomArithmetic, { type ArithmeticValue } from '@/components/custom/arithmetic'

const LABEL_CLASS =
    'block text-[1.55rem] leading-snug font-normal tracking-tight sm:text-3xl'

type Props = {
    question: Question
    value: AnswerValue | undefined
    onChange: (value: AnswerValue) => void
}

export function QuestionView({ question, value, onChange }: Props) {
    switch (question.type) {
        case 'text':
            return (
                <CustomTextarea
                    label={question.label}
                    instruction={question.instruction}
                    placeholder={question.placeholder}
                    forbidden={question.forbidden}
                    value={(value as string) ?? ''}
                    onChange={onChange}
                    labelClassName={LABEL_CLASS}
                />
            )
        case 'date':
            return (
                <CustomDateMoment
                    label={question.label}
                    instruction={question.instruction}
                    notePlaceholder={question.notePlaceholder}
                    value={value as DateMomentValue | undefined}
                    onChange={onChange}
                    labelClassName={LABEL_CLASS}
                />
            )
        case 'scale':
            return (
                <CustomScale
                    label={question.label}
                    instruction={question.instruction}
                    steps={question.steps}
                    evidencePlaceholder={question.evidencePlaceholder}
                    value={value as ScaleValue | undefined}
                    onChange={onChange}
                    labelClassName={LABEL_CLASS}
                />
            )
        case 'choice':
            return (
                <CustomChoice
                    label={question.label}
                    instruction={question.instruction}
                    options={question.options}
                    whyPrompt={question.whyPrompt}
                    value={value as ChoiceValue | undefined}
                    onChange={onChange}
                    labelClassName={LABEL_CLASS}
                />
            )
        case 'list':
            return (
                <CustomList
                    label={question.label}
                    instruction={question.instruction}
                    minItems={question.minItems}
                    maxItems={question.maxItems}
                    itemPlaceholder={question.itemPlaceholder}
                    markOne={question.markOne}
                    value={value as ListValue | undefined}
                    onChange={onChange}
                    labelClassName={LABEL_CLASS}
                />
            )
        case 'math':
            return (
                <CustomArithmetic
                    label={question.label}
                    instruction={question.instruction}
                    target={question.target}
                    value={value as ArithmeticValue | undefined}
                    onChange={onChange}
                    labelClassName={LABEL_CLASS}
                />
            )
    }
}
