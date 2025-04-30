import { CSSProperties, ReactNode } from 'react';

export type TypographyProps = {
    children: ReactNode;
};
export const Title = ({ children }: TypographyProps) => {
    const styles: CSSProperties = {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.3,
        margin: '0 0 40px 0',
    };
    return <h1 style={styles}>{children}</h1>;
};

export const H1 = ({ children }: TypographyProps) => {
    const styles: CSSProperties = {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        margin: '0 0 32px 0',
    };
    return <h1 style={styles}>{children}</h1>;
};

export const H2 = ({ children }: TypographyProps) => {
    const styles: CSSProperties = {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        margin: '0 0 24px 0',
    };
    return <h2 style={styles}>{children}</h2>;
};

export const H3 = ({ children }: TypographyProps) => {
    const styles: CSSProperties = {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.3,
        margin: '0 0 16px 0',
    };
    return <h3 style={styles}>{children}</h3>;
};

export type TextProps = TypographyProps & {
    inline?: boolean;
};

export const Text = ({ children, inline = false }: TextProps) => {
    const Component = inline ? 'span' : 'p';
    const styles: CSSProperties = {
        fontSize: '1rem',
        fontWeight: 350,
        lineHeight: 1.5,
    };
    return <Component style={styles}>{children}</Component>;
};

export const Subtitle = ({ children }: TypographyProps) => {
    const styles: CSSProperties = {
        display: 'block',
        fontSize: 'clamp(0.875rem, 0.75em, 1.5rem)',
        color: '#878787',
        marginTop: '0.2em',
    };
    return <span style={styles}>{children}</span>;
};
