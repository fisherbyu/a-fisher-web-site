const BASE_STYLES = {
    width: 'w-10/12',
    layout: 'px-4 py-2',
    border: 'border border-gray-300 rounded-md',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
    darkBg: '',
};

export const INPUT_STYLES = {
    standard: `${BASE_STYLES.width} ${BASE_STYLES.border} ${BASE_STYLES.focus} ${BASE_STYLES.layout}`,
    alt: `${BASE_STYLES.border} ${BASE_STYLES.focus} ${BASE_STYLES.layout}`,
};
