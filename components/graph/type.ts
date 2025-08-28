type Datum = Record<string, any>;
export interface ChartProps {
  data: Datum[];
  xKey: string;
  yKeys: string[];            // e.g. ['revenue'] or ['seriesA', 'seriesB']
  variant?: 'line' | 'bar';
  height?: number;
  width?: number;
  yFormat?: (value: number) => string;
}