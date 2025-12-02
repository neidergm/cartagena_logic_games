import React from 'react';

// Glob all game components
// This will find all .tsx files in immediate subdirectories of src/games
const gameModules = import.meta.glob('./*/*.tsx');

export const loadGameComponent = (slug: string) => {
    if (!slug) return null;

    // 1. Determine mode (play vs instructions)
    const isPlayMode = slug.endsWith('-play');
    const baseSlug = isPlayMode ? slug.replace('-play', '') : slug;

    // 2. Convert slug to PascalCase for filename
    // e.g. 'wall-architect' -> 'WallArchitect'
    const pascalSlug = baseSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    // 3. Construct expected path
    // e.g. ./wall-architect/WallArchitectGame.tsx
    const suffix = isPlayMode ? 'Game' : 'Instructions';
    const fileName = `${pascalSlug}${suffix}.tsx`;
    const path = `./${baseSlug}/${fileName}`;

    // 4. Look up in glob map
    const importer = gameModules[path];

    if (!importer) {
        console.warn(`Game component not found for slug: ${slug}. Expected path: ${path}`);
        return null;
    }

    // 5. Return lazy component
    // React.lazy expects a function that returns a Promise resolving to the module
    return React.lazy(importer as any);
};
