import { z } from 'zod';

/** Splits a comma-separated input into trimmed, non-empty values */
export const list = (max: number) =>
    z
        .string()
        .default('')
        .transform((value) =>
            value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
        )
        .pipe(z.array(z.string().max(max)));
