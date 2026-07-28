import { setFontFamilyOptions } from '@ag-website-shared/components/theme-builder/FontFamilyValueEditor';
import { setThemeCodeConfig } from '@ag-website-shared/components/theme-builder/themeImport';
import { setNonAdvancedParams, setThemeParamSource } from '@ag-website-shared/theming/ParamModel';
import { setFeatureModels } from '@ag-website-shared/theming/PartModel';
import { setBaseTheme, setRenderedFeatures } from '@ag-website-shared/theming/rendered-theme';
import { getThemeDefaultParams } from '@ag-website-shared/theming/utils';
import { studioTheme } from 'ag-studio';

import { STUDIO_CURATED_KEYS } from './params';

// Point the shared, host-agnostic theme-builder model at Studio's theme instead
// of grid's themeQuartz. Studio has no swappable-part features, so both the
// feature registry and the rendered-preview feature list are empty.
setThemeParamSource(() => getThemeDefaultParams(studioTheme));
setNonAdvancedParams(STUDIO_CURATED_KEYS);
setFeatureModels(() => []);
setBaseTheme(studioTheme);
setRenderedFeatures([]);

// Import/export snippets read `studioTheme` from the 'ag-studio' package.
setThemeCodeConfig({ themeVariable: 'studioTheme', importSource: 'ag-studio' });

setFontFamilyOptions([
    { label: 'System', value: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'] },
    { label: 'Arial', value: ['Arial', 'sans-serif'] },
    { label: 'Inter', value: { googleFont: 'Inter' } },
    { label: 'DM Sans', value: { googleFont: 'DM Sans' } },
    { label: 'IBM Plex Sans', value: { googleFont: 'IBM Plex Sans' } },
    { label: 'IBM Plex Mono', value: { googleFont: 'IBM Plex Mono' } },
    { label: 'Space Grotesk', value: { googleFont: 'Space Grotesk' } },
    { label: 'Merriweather', value: { googleFont: 'Merriweather' } },
    { label: 'Fraunces', value: { googleFont: 'Fraunces' } },
    { label: 'Times New Roman', value: ['Times New Roman', 'serif'] },
]);
