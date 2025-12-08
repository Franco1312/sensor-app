/**
 * Projections Consumer API - Public exports
 */

export { getSeriesLatest, getSeriesHistory, getSeriesMetadata, getAllSeriesMetadata } from './client';
export type { SeriesMetadataItem, SeriesMetadataListResponse } from './client';
export { ApiError } from '../common/ApiError';

