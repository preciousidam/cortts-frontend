// components/graph/index.tsx
import { useResponsive } from '@/hooks/useResponsive';
import { View } from 'react-native';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLegend, VictoryLine, VictoryTooltip } from 'victory';

type Datum = Record<string, any>;

export interface ChartProps {
  data: Datum[];
  xKey: string;
  yKeys: string[];            // e.g. ['revenue'] or ['seriesA', 'seriesB']
  variant?: 'line' | 'bar';
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ data, xKey, yKeys, variant = 'line', height = 300 }) => {
  const series = yKeys.map((y, i) => ({
    key: y,
    points: data.map(d => ({ x: d[xKey], y: d[y] })),
  }));
  const { heightPixel } = useResponsive();

  return (
    <View style={{ height: height ?? heightPixel(300) }}>
      <VictoryChart
        height={height ?? heightPixel(300)}
        // theme={VictoryTheme.material}
        domainPadding={{ x: 20, y: 16 }}
      >
        <VictoryAxis />
        <VictoryAxis dependentAxis />

        {variant === 'line' ? (
          <>
            {series.map(s => (
              <VictoryLine
                key={s.key}
                data={s.points}
                interpolation="monotoneX"
                labels={({ datum }: any) => `${s.key}: ${datum.y}`}
                labelComponent={<VictoryTooltip />}
              />
            ))}
          </>
        ) : (
          <VictoryGroup offset={12}>
            {series.map(s => (
              <VictoryBar
                key={s.key}
                data={s.points}
                labels={({ datum }: any) => `${s.key}: ${datum.y}`}
                labelComponent={<VictoryTooltip />}
              />
            ))}
          </VictoryGroup>
        )}

        {yKeys.length > 1 && (
          <VictoryLegend
            x={12}
            y={8}
            orientation="horizontal"
            gutter={12}
            data={yKeys.map(k => ({ name: k }))}
          />
        )}
      </VictoryChart>
    </View>
  );
};