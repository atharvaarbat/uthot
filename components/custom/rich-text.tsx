import React, { useMemo } from "react";

interface FormattedTextProps {
    text: string;
}
 
// Each delimiter is a token (one OR MORE characters) paired with the
// Tailwind class applied to the text it wraps. Tokens can be any length —
// "#$" is matched as a 2-character string, exactly the same way "*" and
// "_" are matched as 1-character strings below.
const DELIMITERS: { token: string; className: string }[] = [
    { token: "#$", className: "text-amber-400" }, // #$ quoted #$
    { token: "*", className: "font-bold" },        // *bold*
    { token: "_", className: "font-serif italic" },    // _serif italic_
];
 
export function FormattedText({ text }: FormattedTextProps) {
    // Only re-parse when `text` actually changes, not on every render.
    const nodes = useMemo(() => parseText(text), [text]);
    return <span className="whitespace-pre-wrap">{nodes}</span>;
}
 
function parseText(input: string): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];
    let buffer = "";
    let key = 0;
    let i = 0;
 
    // Consecutive plain characters are collected in `buffer` and flushed
    // as a single fragment, instead of one fragment per character.
    const flush = () => {
        if (buffer) {
            nodes.push(<React.Fragment key={key++}>{buffer}</React.Fragment>);
            buffer = "";
        }
    };
 
    outer: while (i < input.length) {
        for (const { token, className } of DELIMITERS) {
            if (input.startsWith(token, i)) {
                const end = input.indexOf(token, i + token.length);
                if (end !== -1) {
                    flush();
                    nodes.push(
                        <span key={key++} className={className}>
                            {parseText(input.slice(i + token.length, end))}
                        </span>
                    );
                    i = end + token.length; // jump past the closing token
                    continue outer;
                }
                // No closing token anywhere ahead: fall through and treat
                // this position as literal text (handled below).
            }
        }
 
        // Every remaining path advances i by exactly 1, so the loop is
        // guaranteed to make progress and can never get stuck — even for
        // an unmatched multi-character token like a lone "#$".
        buffer += input[i];
        i++;
    }
 
    flush();
    return nodes;
}
 