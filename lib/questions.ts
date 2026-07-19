/**
 * The seven gates. Content is authored with the rich-text tokens from
 * components/custom/rich-text.tsx: *bold*, _serif italic_, #$accent#$.
 */

export type Question =
    | TextQuestion
    | DateQuestion
    | ScaleQuestion
    | ChoiceQuestion
    | ListQuestion
    | MathQuestion

interface BaseQuestion {
    id: string
    label: string
    instruction?: string
}

export interface TextQuestion extends BaseQuestion {
    type: "text"
    placeholder?: string
    /** words the founder is not allowed to hide behind */
    forbidden?: string[]
}

export interface DateQuestion extends BaseQuestion {
    type: "date"
    notePlaceholder: string
}

export interface ScaleQuestion extends BaseQuestion {
    type: "scale"
    steps: string[]
    evidencePlaceholder: string
}

export interface ChoiceQuestion extends BaseQuestion {
    type: "choice"
    options: string[]
    whyPrompt?: string
}

export interface ListQuestion extends BaseQuestion {
    type: "list"
    minItems: number
    maxItems: number
    itemPlaceholder: string
    /** when set, exactly one item must be circled */
    markOne?: string
}

export interface MathQuestion extends BaseQuestion {
    type: "math"
    /** annual revenue target in dollars */
    target: number
}

export interface Section {
    id: string
    number: number
    title: string
    gate: string
    /** "the real question underneath" — shown after the section's last answer */
    underneath?: string
    questions: Question[]
}

export const SECTIONS: Section[] = [
    {
        id: "problem",
        number: 1,
        title: "The Problem",
        gate: "Is this real?",
        underneath: "Is this a problem — or a preference?",
        questions: [
            {
                id: "problem-sentence",
                type: "text",
                label:
                    "Describe the problem in *one sentence*, without using the words _platform_, _solution_, _seamless_, or _AI_.",
                instruction:
                    "If the sentence needs those words, the thought isn't finished yet.",
                forbidden: ["platform", "platforms", "solution", "solutions", "seamless", "seamlessly", "ai"],
            },
            {
                id: "problem-last-felt",
                type: "date",
                label: "When did you last *personally* experience this problem?",
                instruction: "The date, and what happened. Plain memory — no analysis.",
                notePlaceholder: "What happened that day…",
            },
            {
                id: "problem-witness",
                type: "text",
                label:
                    "If you've _never_ experienced it: who did, and how do you know? *Name them.*",
                instruction:
                    "If you have lived it yourself, name someone else who has. The person you picture while you build.",
            },
            {
                id: "problem-workaround",
                type: "text",
                label: "What do people do *today* instead?",
                instruction:
                    "Be specific — name the tool, the spreadsheet, the WhatsApp group, or the intern.",
            },
            {
                id: "problem-tolerable",
                type: "text",
                label:
                    "Why is that workaround _tolerable_? What makes this one *intolerable*?",
                instruction: "People tolerate a lot.",
            },
            {
                id: "problem-severity",
                type: "scale",
                label: "Where does this sit — and what *evidence* do you have?",
                steps: [
                    "Annoying",
                    "Worth complaining about",
                    "Costing real money or time",
                    "They already hunt for fixes",
                    "They would pay today to make it stop",
                ],
                evidencePlaceholder: "The evidence — what you've seen, not what you believe…",
            },
        ],
    },
    {
        id: "person",
        number: 2,
        title: "The Person",
        gate: "Why you?",
        underneath: "Founder–market fit. Not passion — unfair advantage.",
        questions: [
            {
                id: "person-knowledge",
                type: "text",
                label:
                    "What do you know about this problem that most smart people *don't*?",
            },
            {
                id: "person-source",
                type: "choice",
                label: "Where did that knowledge come from?",
                options: [
                    "Years of doing the work",
                    "A specific incident",
                    "People I know inside the problem",
                    "An article I read",
                ],
                whyPrompt: "Tell the story in two sentences.",
            },
            {
                id: "person-moat",
                type: "text",
                label:
                    "What would a competitor have to *do* to acquire your knowledge? How long would it take them?",
            },
            {
                id: "person-disappear",
                type: "choice",
                label:
                    "If you disappeared tomorrow, would this company still make sense?",
                options: [
                    "Yes — anyone could run it",
                    "No — it only works with what I know",
                    "I honestly don't know yet",
                ],
                whyPrompt: "Why?",
            },
        ],
    },
    {
        id: "customer",
        number: 3,
        title: "The Customer",
        gate: "Do they exist?",
        underneath: "Do you have earned insight — or borrowed insight?",
        questions: [
            {
                id: "customer-three",
                type: "list",
                label: "Name *three real people* who have this problem.",
                instruction: "First and last name. Real ones.",
                minItems: 3,
                maxItems: 3,
                itemPlaceholder: "First and last name",
            },
            {
                id: "customer-words",
                type: "text",
                label:
                    "Have you *spoken* to them about it? What were their _exact words_?",
                instruction: "Their words, not your summary. Quotation marks are earned here.",
                placeholder: "“What they actually said…”",
            },
            {
                id: "customer-surprise",
                type: "text",
                label: "What *surprised* you in those conversations?",
                instruction:
                    "If nothing surprised you, you weren't listening — you were pitching.",
            },
            {
                id: "customer-first",
                type: "text",
                label: "Who is the *first customer*?",
                instruction:
                    "Not the market. The single first human who pays. A name, or the closest thing you have to one.",
            },
            {
                id: "customer-gather",
                type: "text",
                label: "Where do they *already gather*?",
                instruction:
                    "A subreddit, a conference, a group chat, an aisle. If you can't answer this, you have no distribution.",
            },
            {
                id: "customer-enemy",
                type: "text",
                label:
                    "Who in the customer's organization *loses* if this succeeds?",
                instruction: "Every sale creates an enemy. Name the role.",
            },
        ],
    },
    {
        id: "falsification",
        number: 4,
        title: "The Falsification",
        gate: "Are you honest?",
        underneath:
            "What important truth do very few people agree with you on — and would it survive a test?",
        questions: [
            {
                id: "falsify-argument",
                type: "text",
                label: "Write the *strongest argument against* your own idea.",
                instruction:
                    "Make it good enough that it scares you. If it doesn't, it isn't the strongest one.",
            },
            {
                id: "falsify-why-now",
                type: "choice",
                label: "Why hasn't this been built already?",
                instruction: "“No one thought of it” is not on the list — on purpose.",
                options: [
                    "Technology just changed",
                    "Regulation just changed",
                    "A behavior just changed",
                    "Everyone who tried failed — and I understand why",
                ],
                whyPrompt: "What changed, exactly — and when?",
            },
            {
                id: "falsify-graveyard",
                type: "text",
                label:
                    "Who tried this *before* and failed? What killed them? What's different now?",
                instruction: "Find them. The graveyard is a library.",
            },
            {
                id: "falsify-assumptions",
                type: "list",
                label:
                    "List the assumptions that have to be *true* for this to work.",
                minItems: 2,
                maxItems: 8,
                itemPlaceholder: "This must be true…",
                markOne: "Circle the one that, if false, kills everything.",
            },
            {
                id: "falsify-test",
                type: "text",
                label:
                    "What's the *cheapest* way to test that assumption — _this week_?",
                instruction: "Not this quarter. This week.",
            },
            {
                id: "falsify-stop",
                type: "choice",
                label:
                    "If you ran that test and it failed, would you actually stop?",
                options: ["Yes — I would stop", "I would pivot the idea", "Honestly, no"],
                whyPrompt: "Answer honestly. This page doesn't judge — but it does remember.",
            },
        ],
    },
    {
        id: "wedge",
        number: 5,
        title: "The Wedge",
        gate: "Can you start?",
        questions: [
            {
                id: "wedge-smallest",
                type: "text",
                label:
                    "What's the *smallest version* of this that a real person would pay for?",
            },
            {
                id: "wedge-thirty-days",
                type: "choice",
                label: "Can you build that in *30 days*?",
                options: ["Yes", "No — it needs cutting again"],
                whyPrompt: "If no: what gets cut?",
            },
            {
                id: "wedge-not-building",
                type: "list",
                label: "What are you *not* building?",
                instruction: "The discipline list. Write it down.",
                minItems: 3,
                maxItems: 10,
                itemPlaceholder: "Not this…",
            },
            {
                id: "wedge-first-touch",
                type: "text",
                label:
                    "How does someone hear about you the *very first time*?",
                instruction: "Trace the exact path — click by click, word by word.",
            },
            {
                id: "wedge-channel",
                type: "text",
                label:
                    "What's your *unfair distribution channel* — the one competitors can't copy?",
            },
        ],
    },
    {
        id: "machine",
        number: 6,
        title: "The Machine",
        gate: "Does it compound?",
        questions: [
            {
                id: "machine-better",
                type: "text",
                label:
                    "Does this get *better* as more people use it — or just _bigger_? Explain the mechanism.",
            },
            {
                id: "machine-copy",
                type: "text",
                label:
                    "What stops a *well-funded team* from copying this in six months?",
            },
            {
                id: "machine-backwards",
                type: "math",
                label:
                    "Work backwards from *$100M revenue*: how many customers, at what price?",
                target: 100_000_000,
            },
            {
                id: "machine-plausible",
                type: "text",
                label:
                    "Is that number of customers *plausible*? Show the arithmetic.",
                instruction: "Long division counts as strategy here.",
            },
        ],
    },
    {
        id: "mirror",
        number: 7,
        title: "The Mirror",
        gate: "Do you actually want this?",
        questions: [
            {
                id: "mirror-why-this",
                type: "text",
                label:
                    "Why *this* — instead of the other ideas you had this month? _List the others._",
            },
            {
                id: "mirror-ten-years",
                type: "choice",
                label:
                    "Would you work on this for *ten years* if it never made you rich?",
                options: ["Yes", "No", "I want the answer to be yes"],
                whyPrompt: "What does that answer tell you?",
            },
            {
                id: "mirror-avoiding",
                type: "text",
                label:
                    "What are you *avoiding* by starting a company right now?",
            },
            {
                id: "mirror-quit",
                type: "text",
                label:
                    "What would make you *quit*? Write it down now, so future-you can check.",
                instruction: "Sealed here. Future-you will find it exactly as you left it.",
            },
        ],
    },
]

export const TOTAL_QUESTIONS = SECTIONS.reduce(
    (n, s) => n + s.questions.length,
    0
)

/* ── the linear path through the flow ─────────────────────────── */

export type Step =
    | { kind: "shlok" }
    | { kind: "gate"; section: number }
    | { kind: "question"; section: number; question: number }
    | { kind: "underneath"; section: number }

export const STEPS: Step[] = [
    { kind: "shlok" },
    ...SECTIONS.flatMap((section, s): Step[] => [
        { kind: "gate", section: s },
        ...section.questions.map((_, q): Step => ({ kind: "question", section: s, question: q })),
        ...(section.underneath ? [{ kind: "underneath", section: s } as Step] : []),
    ]),
]

/* ── answer shapes, keyed by question id ──────────────────────── */

export type AnswerValue =
    | string
    | { date: string; note: string }
    | { level: number; evidence: string }
    | { choice: string; why: string }
    | { items: string[]; marked?: number }
    | { customers: string; price: string }

export type AnswerMap = Record<string, AnswerValue>

export function isAnswered(q: Question, value: AnswerValue | undefined): boolean {
    if (value === undefined) return false
    switch (q.type) {
        case "text":
            return typeof value === "string" && value.trim().length > 0
        case "date": {
            const v = value as { date: string; note: string }
            return Boolean(v.date || v.note?.trim())
        }
        case "scale": {
            const v = value as { level: number; evidence: string }
            return v.level >= 0
        }
        case "choice": {
            const v = value as { choice: string; why: string }
            return Boolean(v.choice)
        }
        case "list": {
            const v = value as { items: string[] }
            return v.items?.some((item) => item.trim().length > 0)
        }
        case "math": {
            const v = value as { customers: string; price: string }
            return Boolean(v.customers && v.price)
        }
    }
}

export function answerToPlainText(q: Question, value: AnswerValue | undefined): string {
    if (!isAnswered(q, value)) return ""
    switch (q.type) {
        case "text":
            return (value as string).trim()
        case "date": {
            const v = value as { date: string; note: string }
            return [v.date, v.note?.trim()].filter(Boolean).join(" — ")
        }
        case "scale": {
            const v = value as { level: number; evidence: string }
            const step = q.steps[v.level] ?? ""
            return [step, v.evidence?.trim()].filter(Boolean).join(" — ")
        }
        case "choice": {
            const v = value as { choice: string; why: string }
            return [v.choice, v.why?.trim()].filter(Boolean).join(" — ")
        }
        case "list": {
            const v = value as { items: string[]; marked?: number }
            return v.items
                .filter((item) => item.trim())
                .map((item, i) => (v.marked === i ? `◯ ${item} (the killer)` : `– ${item}`))
                .join("\n")
        }
        case "math": {
            const v = value as { customers: string; price: string }
            const customers = Number(v.customers) || 0
            const price = Number(v.price) || 0
            return `${customers.toLocaleString("en-US")} customers × $${price.toLocaleString("en-US")} = $${(customers * price).toLocaleString("en-US")} / year`
        }
    }
}
