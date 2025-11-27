/**
 * UI components exports (atoms - base components)
 * Re-exports from design-system for backward compatibility
 */

// Re-export from design-system atoms
export * from '@/design-system/components/atoms';
// Card is a molecule but commonly used, re-export for convenience
export { Card } from '@/design-system/components/molecules';
export type { CardProps, CardVariant, CardPadding } from '@/design-system/components/molecules';

