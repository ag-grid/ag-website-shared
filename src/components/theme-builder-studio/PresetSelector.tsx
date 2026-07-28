import { PresetButton, PresetScroller } from '@ag-website-shared/components/theme-builder/PresetScroller';
import { ResetChangesModal } from '@ag-website-shared/components/theme-builder/ResetChangesModal';
import { getChangedModelItemCount } from '@ag-website-shared/theming/changed-model-items';
import { applyPreset } from '@ag-website-shared/theming/preset';
import styled from '@emotion/styled';
import { useStore } from 'jotai';
import { useState } from 'react';

import { PresetPreview } from './PresetPreview';
import { PRESETS, type StudioPreset, toSharedPreset } from './presets';

interface Props {
    isDark: boolean;
    selectedId: string | null;
    onSelect: (preset: StudioPreset) => void;
}

export const PresetSelector = ({ isDark, selectedId, onSelect }: Props) => {
    const store = useStore();
    const [showDialog, setShowDialog] = useState(false);
    const [pendingPreset, setPendingPreset] = useState<StudioPreset | null>(null);

    const apply = (preset: StudioPreset) => {
        applyPreset(store, toSharedPreset(preset, isDark));
        onSelect(preset);
    };

    const selectPreset = (preset: StudioPreset) => {
        // Only warn about losing manual edits; a single change is the preset
        // application itself, mirroring the grid host's threshold.
        if (getChangedModelItemCount(store) > 1) {
            setPendingPreset(preset);
            setShowDialog(true);
        } else {
            apply(preset);
        }
    };

    return (
        <>
            <PresetScroller>
                {PRESETS.map((preset) => {
                    const variant = isDark ? preset.variants.dark : preset.variants.light;
                    const selected = preset.id === selectedId;
                    return (
                        <PresetButton
                            key={preset.id}
                            onClick={(e) => {
                                selectPreset(preset);
                                e.currentTarget.scrollIntoView({
                                    behavior: 'smooth',
                                    inline: 'center',
                                    block: 'nearest',
                                });
                            }}
                            aria-label={preset.label}
                            aria-pressed={selected}
                        >
                            <Card>
                                <PresetPreview variant={variant} className={selected ? 'selected' : ''} />
                                <Label className={selected ? 'selected' : ''}>{preset.label}</Label>
                            </Card>
                        </PresetButton>
                    );
                })}
            </PresetScroller>
            {pendingPreset && (
                <ResetChangesModal
                    showDialog={showDialog}
                    setShowDialog={setShowDialog}
                    onSuccess={() => apply(pendingPreset)}
                />
            )}
        </>
    );
};

const Card = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 180px;
    height: 100%;
`;

const Label = styled('div')`
    flex-shrink: 0;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 0;
    color: var(--color-fg-primary);

    &.selected {
        color: var(--color-brand-500);
        font-weight: 600;

        [data-dark-mode='true'] & {
            color: var(--color-brand-300);
        }
    }
`;
