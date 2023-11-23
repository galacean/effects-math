import { roundNumber } from './round-number';

export function round (value: number, precision?: number): number;
export function round (value: undefined, precision?: number): undefined;
export function round (value: number | undefined, precision?: number): number | undefined;
export function round (value: number | undefined, precision = 3): number | undefined {
  return value === undefined ? undefined : roundNumber(value, precision);
}
