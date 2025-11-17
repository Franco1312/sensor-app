/**
 * Mock data for development
 * Replace with real API calls later
 */

import { Indicator, Quote, IndicatorDetail } from '@/types';

export const mockIndicators: Indicator[] = [
  {
    id: '1',
    name: 'Inflación Mensual',
    value: '7.8%',
    change: 1.25,
    changePercent: 1.25,
    lastUpdate: '15:30',
    category: 'precios',
    trend: 'up',
  },
  {
    id: '2',
    name: 'Base Monetaria',
    value: '$25.1B',
    change: -0.5,
    changePercent: -0.5,
    lastUpdate: '15:30',
    category: 'monetaria',
    trend: 'down',
  },
  {
    id: '3',
    name: 'Tipo de Cambio Oficial',
    value: '$245.50',
    change: 0.1,
    changePercent: 0.1,
    lastUpdate: '15:30',
    category: 'externo',
    trend: 'up',
  },
  {
    id: '4',
    name: 'Actividad Económica',
    value: '142.1',
    change: 0.3,
    changePercent: 0.3,
    lastUpdate: '15:30',
    category: 'actividad',
    trend: 'up',
  },
  {
    id: '5',
    name: 'Índice de Precios al Consumidor (IPC)',
    value: '12.8%',
    change: 0.2,
    changePercent: 0.2,
    lastUpdate: '31/10/2023',
    category: 'precios',
    trend: 'up',
  },
  {
    id: '6',
    name: 'Tipo de Cambio (USD)',
    value: '$850.50',
    change: -2.3,
    changePercent: -0.27,
    lastUpdate: '01/11/2023',
    category: 'externo',
    trend: 'down',
  },
  {
    id: '7',
    name: 'Tasa de Desempleo',
    value: '8.9%',
    change: -0.1,
    changePercent: -1.11,
    lastUpdate: '30/09/2023',
    category: 'actividad',
    trend: 'up',
  },
  {
    id: '8',
    name: 'IMACEC',
    value: '-0.5%',
    change: -0.3,
    changePercent: -0.3,
    lastUpdate: '31/10/2023',
    category: 'actividad',
    trend: 'down',
  },
  {
    id: '9',
    name: 'Tasa de Política Monetaria',
    value: '9.50%',
    change: 0,
    changePercent: 0,
    lastUpdate: '26/10/2023',
    category: 'monetaria',
    trend: 'neutral',
  },
];

export const mockQuotes: Quote[] = [
  {
    id: '1',
    name: 'Dólar Blue',
    sellPrice: '$495.00',
    change: 1.02,
    changePercent: 1.02,
    lastUpdate: '16:00',
    category: 'dolares',
  },
  {
    id: '2',
    name: 'Euro',
    sellPrice: '$530.50',
    change: -0.25,
    changePercent: -0.25,
    lastUpdate: '16:00',
    category: 'dolares',
  },
  {
    id: '3',
    name: 'S&P Merval',
    sellPrice: '415,670',
    change: 2.15,
    changePercent: 2.15,
    lastUpdate: '16:00',
    category: 'acciones',
  },
  {
    id: '4',
    name: 'Bitcoin',
    sellPrice: '$29,150.75',
    change: -1.8,
    changePercent: -1.8,
    lastUpdate: '16:00',
    category: 'cripto',
  },
  {
    id: '5',
    name: 'Dólar Oficial',
    sellPrice: '$920,00',
    change: -0.25,
    changePercent: -0.25,
    lastUpdate: '14:32',
    category: 'dolares',
  },
  {
    id: '6',
    name: 'Dólar MEP',
    sellPrice: '$1.215,70',
    change: 0.88,
    changePercent: 0.88,
    lastUpdate: '14:32',
    category: 'dolares',
  },
  {
    id: '7',
    name: 'Dólar CCL',
    sellPrice: '$1.240,10',
    change: 0,
    changePercent: 0,
    lastUpdate: '14:32',
    category: 'dolares',
  },
  {
    id: '8',
    name: 'Dólar Tarjeta',
    sellPrice: '$1.472,00',
    change: -0.25,
    changePercent: -0.25,
    lastUpdate: '14:32',
    category: 'dolares',
  },
];

export const getIndicatorById = (id: string): IndicatorDetail | undefined => {
  const indicator = mockIndicators.find(i => i.id === id);
  if (!indicator) return undefined;

  return {
    ...indicator,
    description: 'Descripción del indicador económico',
    methodology:
      'El Índice de Precios al Consumidor (IPC) mide la evolución de los precios de un conjunto de bienes y servicios representativos del gasto de consumo de los hogares en un área determinada.',
    source: 'Instituto Nacional de Estadística y Censos (INDEC)',
    historicalData: [109, 21, 41, 93, 33, 101, 61, 45, 121, 149, 1, 81, 129, 25],
  };
};
