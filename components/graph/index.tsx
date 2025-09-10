import { View } from "react-native";
import { Bar, CartesianChart, CartesianChartRenderArg, Line } from "victory-native";
import { useResponsive } from "@/hooks/useResponsive";
import { ChartProps } from "./type";
import { Datum } from "victory";

export const Chart: React.FC<ChartProps> = ({ data, xKey, yKeys, variant, height }) => {
  const { isMobile, fontPixel, heightPixel } = useResponsive();
  // const font = useFont(Inter_400Regular, fontPixel(14));

  const renderVariant = (props: CartesianChartRenderArg<Datum, string>) => {
    console.log(props,'point');
    
    if (variant === 'line') {
      return <Line points={data.map(d => d[yKeys[0]])} color="red" strokeWidth={3} />;
    }
    if (variant === 'bar') {
      return <Bar points={props.points.amount} color="blue" chartBounds={props.chartBounds} />;
    }
    return null;
  };
  console.log(data, xKey, yKeys);
  

  return (
    <View style={{ height: height ?? heightPixel(300), width: '100%' }}>
      <CartesianChart
        data={data} // 👈 specify your data
        xKey={xKey} // 👈 specify data key for x-axis
        yKeys={yKeys} // 👈 specify data keys used for y-axis
        // axisOptions={{ font }} // 👈 we'll generate axis labels using given font.
      >
        {/* 👇 render function exposes various data, such as points. */}
        {(props) => renderVariant(props)}
      </CartesianChart>
    </View>
  );
};
