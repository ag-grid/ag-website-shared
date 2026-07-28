import styled from '@emotion/styled';
import type { CSSProperties } from 'react';

import type { PresetVariant } from './presets';

// A compact dashboard-shaped thumbnail rendered purely from the variant's
// accent / background swatch colours, so the preset strip stays cheap to render.
// Fills the height of its card (the PresetScroller sizes the row); the card
// supplies the width.
export const PresetPreview = ({ variant, className }: { variant: PresetVariant; className?: string }) => {
    const vars = {
        '--preset-bg': variant.background,
        '--preset-accent': variant.accent,
    } as CSSProperties;

    return (
        <Preview className={className} style={vars}>
            <Bar />
            <Row>
                <Kpi />
                <Kpi />
                <Kpi />
            </Row>
            <Chart>
                <span style={{ height: '40%' }} />
                <span style={{ height: '70%' }} />
                <span style={{ height: '55%' }} />
                <span style={{ height: '90%' }} />
            </Chart>
        </Preview>
    );
};

const Preview = styled('div')`
    flex: 1;
    min-height: 0;
    width: 100%;
    background: var(--preset-bg);
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid color-mix(in srgb, var(--preset-bg), var(--preset-accent) 20%);
    border-radius: 8px;
    overflow: hidden;
    transition:
        box-shadow 0.2s,
        border-color 0.2s;

    &.selected {
        border-color: var(--preset-accent);
        box-shadow: 0 0 0 2px var(--preset-accent);
    }
`;

const Bar = styled('div')`
    height: 8px;
    width: 60%;
    border-radius: 2px;
    background: var(--preset-accent);
`;

const Row = styled('div')`
    display: flex;
    gap: 4px;
    > * {
        flex: 1;
    }
`;

const Kpi = styled('div')`
    height: 14px;
    border-radius: 2px;
    background: color-mix(in srgb, var(--preset-accent) 25%, transparent);
`;

const Chart = styled('div')`
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 4px;
    > span {
        flex: 1;
        border-radius: 2px 2px 0 0;
        background: var(--preset-accent);
    }
`;
