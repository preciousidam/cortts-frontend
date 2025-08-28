// components/graph/index.tsx
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { View } from 'react-native';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory';
import { ChartProps } from './type';

export const Chart: React.FC<ChartProps> = ({ data, xKey, yKeys, variant = 'line', height = 300, width, yFormat }) => {
  const series = yKeys.map((y, i) => ({
    key: y,
    points: data.map(d => ({ x: d[xKey], y: d[y] })),
  }));
  const { heightPixel, widthPixel, fontPixel } = useResponsive();
  const { colors, fonts } = useTheme();

  return (
    <View style={{ height: height ?? heightPixel(300) }}>
      <VictoryChart
        height={height ?? heightPixel(300)}
        width={width ?? widthPixel(1061)}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          // tickValues={_.range(
          //   2010,
          //   2024,
          //   2,
          // )}
          style={{
            tickLabels: {
              fontSize: fontPixel(12),
              ...fonts.regular,
            },
            ticks: {
              stroke: "#757575",
              size: 5,
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={yFormat}
          style={{
            tickLabels: {
              fontSize: fontPixel(12),
              ...fonts.regular,
            },
            ticks: {
              stroke: "#757575",
              size: 5,
            },
          }}
        />
        <VictoryBar
          data={data.map(d => ({ x: d[xKey], y: d[yKeys[0]] }))}
          style={{data: { fill: colors.primary }}}
        />
      </VictoryChart>
    </View>
  );
};