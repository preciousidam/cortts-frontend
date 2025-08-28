import { View } from "react-native";
import { Bar, CartesianChart, Line, PointsArray, } from "victory-native";
import { useResponsive } from "@/hooks/useResponsive";
import { ChartProps } from "./type";

export const Chart: React.FC<ChartProps> = ({ data, xKey, yKeys, variant, height }) => {
  const { isMobile, fontPixel, heightPixel } = useResponsive();
  // const font = useFont(Inter_400Regular, fontPixel(14));

  const renderVariant = (point: {
      [x: string]: PointsArray;
  }) => {
    if (variant === 'line') {
      return <Line points={data.map(d => d[yKeys[0]])} color="red" strokeWidth={3} />;
    }
    if (variant === 'bar') {
      return <Bar points={data.map(d => d[yKeys[1]])} color="blue" chartBounds={{ top: 0, bottom: 300, left: 0, right: 300 }} />;
    }
    return null;
  };

  return (
    <View style={{ height: height ?? heightPixel(300) }}>
      <CartesianChart
        data={data} // 👈 specify your data
        xKey={xKey} // 👈 specify data key for x-axis
        yKeys={yKeys} // 👈 specify data keys used for y-axis
        // axisOptions={{ font }} // 👈 we'll generate axis labels using given font.
      >
        {/* 👇 render function exposes various data, such as points. */}
        {({ points }) => renderVariant(points)}
      </CartesianChart>
    </View>
  );
};
