// Studio's curated editor layout. Unlike grid's EditorPanel (which names params
// inline), Studio drives its panel from this data because its catalog is larger
// and more regular. Param value type and default are derived by the shared layer
// (getParamType by name suffix + the rendered theme), so only presentation hints
// live here.
export type LengthIcon = 'radius' | 'verticalSpacing' | 'horizontalSpacing';

export interface StudioParamConfig {
    key: string;
    label: string;
    icon?: LengthIcon;
    inlineWithNext?: boolean;
    swipeAdjustmentDivisor?: number;
    // Clamp for length editors (px). Colour/font params ignore these.
    min?: number;
    max?: number;
}

export interface StudioParamGroup {
    id: string;
    label: string;
    params: StudioParamConfig[];
}

export const PARAM_GROUPS: StudioParamGroup[] = [
    {
        id: 'general',
        label: 'General',
        params: [
            { key: 'fontFamily', label: 'Font Family', inlineWithNext: true },
            { key: 'fontSize', label: 'Font Size', min: 10, max: 20 },
            { key: 'backgroundColor', label: 'Background Color' },
            { key: 'foregroundColor', label: 'Foreground Color' },
            { key: 'accentColor', label: 'Accent Color' },
            { key: 'textColor', label: 'Text Color' },
            { key: 'subtleTextColor', label: 'Subtle Text Color' },
            { key: 'chromeBackgroundColor', label: 'Chrome Background' },
        ],
    },
    {
        id: 'borders',
        label: 'Borders & Spacing',
        params: [
            { key: 'borderColor', label: 'Border Color' },
            { key: 'borderWidth', label: 'Border Width', min: 0, max: 4 },
            { key: 'spacing', label: 'Spacing', icon: 'verticalSpacing', min: 2, max: 20 },
            {
                key: 'borderRadius',
                label: 'Border Radius',
                icon: 'radius',
                swipeAdjustmentDivisor: 20,
                min: 0,
                max: 24,
            },
            {
                key: 'studioWidgetBorderRadius',
                label: 'Widget Radius',
                icon: 'radius',
                swipeAdjustmentDivisor: 20,
                min: 0,
                max: 32,
            },
        ],
    },
    {
        id: 'header',
        label: 'Header',
        params: [
            { key: 'headerBackgroundColor', label: 'Background' },
            { key: 'headerTextColor', label: 'Text Color' },
            { key: 'headerFontFamily', label: 'Font Family', inlineWithNext: true },
            { key: 'headerFontSize', label: 'Font Size', min: 10, max: 24 },
            { key: 'headerHeight', label: 'Header Height', min: 24, max: 80 },
        ],
    },
    {
        id: 'menus',
        label: 'Menus',
        params: [
            { key: 'menuBackgroundColor', label: 'Background' },
            { key: 'menuTextColor', label: 'Text Color' },
        ],
    },
    {
        id: 'widgets',
        label: 'Widgets',
        params: [
            { key: 'studioWidgetBackgroundColor', label: 'Background' },
            { key: 'studioCanvasFontFamily', label: 'Widget Body Font' },
            { key: 'studioWidgetTitleTextColor', label: 'Title Color' },
            { key: 'studioWidgetTitleFontFamily', label: 'Title Font', inlineWithNext: true },
            { key: 'studioWidgetTitleFontSize', label: 'Title Size', min: 12, max: 48 },
            { key: 'studioWidgetSubtitleTextColor', label: 'Subtitle Color' },
            { key: 'studioWidgetSubtitleFontFamily', label: 'Subtitle Font', inlineWithNext: true },
            { key: 'studioWidgetSubtitleFontSize', label: 'Subtitle Size', min: 8, max: 24 },
            { key: 'studioWidgetCaptionTextColor', label: 'Caption Color' },
            { key: 'studioWidgetCaptionFontFamily', label: 'Caption Font', inlineWithNext: true },
            { key: 'studioWidgetCaptionFontSize', label: 'Caption Size', min: 8, max: 20 },
        ],
    },
    {
        id: 'grid',
        label: 'Grid',
        params: [
            { key: 'gridBackgroundColor', label: 'Background' },
            { key: 'gridChromeBackgroundColor', label: 'Chrome Background' },
            { key: 'gridCellTextColor', label: 'Cell Text' },
            { key: 'gridAccentColor', label: 'Accent' },
            { key: 'gridRowHeight', label: 'Row Height', icon: 'verticalSpacing', min: 24, max: 80 },
            // gridCellFontFamily, not gridFontFamily, drives visible cell text - its
            // studio default refs studioCanvasFontFamily directly.
            { key: 'gridCellFontFamily', label: 'Font Family', inlineWithNext: true },
            { key: 'gridDataFontSize', label: 'Data Font Size', min: 10, max: 20 },
            {
                key: 'gridBorderRadius',
                label: 'Border Radius',
                icon: 'radius',
                swipeAdjustmentDivisor: 20,
                min: 0,
                max: 16,
            },
        ],
    },
    {
        id: 'charts',
        label: 'Charts',
        params: [
            { key: 'chartTextColor', label: 'Text Color' },
            { key: 'chartSubtleTextColor', label: 'Subtle Text' },
            { key: 'chartFontFamily', label: 'Font Family', inlineWithNext: true },
            { key: 'chartFontSize', label: 'Font Size', min: 8, max: 20 },
            { key: 'chartAxisLineColor', label: 'Axis Color' },
            { key: 'chartGridLineColor', label: 'Grid Line Color' },
            { key: 'chartPaletteFills1Color', label: 'Palette 1' },
            { key: 'chartPaletteFills2Color', label: 'Palette 2' },
            { key: 'chartPaletteFills3Color', label: 'Palette 3' },
            { key: 'chartPaletteFills4Color', label: 'Palette 4' },
            { key: 'chartPaletteFills5Color', label: 'Palette 5' },
            { key: 'chartPaletteFills6Color', label: 'Palette 6' },
        ],
    },
];

// Every curated param must be registered as non-advanced, otherwise the shared
// ParamEditor throws when it is rendered outside the advanced section.
export const STUDIO_CURATED_KEYS: string[] = PARAM_GROUPS.flatMap((group) => group.params.map((param) => param.key));
