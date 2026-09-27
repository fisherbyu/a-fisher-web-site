/** Split a comma-separated string into trimmed, non-empty items, preserving order */
export const splitList = (value: string): string[] =>
    value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

/** Join items into a comma-separated string for editing */
export const joinList = (items: string[]): string => items.join(', ');
