import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Svg, G, Path, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

interface PieChartProps {
  data: ReadonlyArray<{ label: string; value: number }>;
  rotation: SharedValue<number>;
  outerRadius: number;
  innerRadius: number;
}

const pastelColors = [
  "#FFB6C1", // LightPink
  "#BA55D3", // MediumOrchid
  "#98FB98", // PaleGreen
  "#87CEEB", // SkyBlue
  "#FFA07A", // LightSalmon
  "#FFD700", // Gold
  "#DDA0DD", // Plum
  "#FF6347", // Tomato
  "#F08080", // LightCoral
  "#20B2AA", // LightSeaGreen
];

function PieChart(props: PieChartProps) {
  const { data, rotation, outerRadius, innerRadius } = props;

  useEffect(() => {
    drawChart();
  }, [data]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  function drawChart() {
    // You may need to adjust these dimensions based on your layout requirements
    const width = 2 * outerRadius;
    const height = 2 * outerRadius;

    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => d.value);


    return (
      <View style={{ width: "100%", flex: 1 }}>
        <Animated.View style={animatedStyles}>
          <Svg width={width} height={height}>
            <G transform={`translate(${width / 2}, ${height / 2})`}>
              {pieGenerator(data).map((d, index) => {
                const [centroidX, centroidY] = arcGenerator.centroid(d);
                const startAngle = d.startAngle * (180 / Math.PI);
                const endAngle = d.endAngle * (180 / Math.PI);
                const labelRotation = (startAngle + endAngle) / 2 + 90;

                return (
                  <G key={index}>
                    <Path
                      d={arcGenerator(d)}
                      fill={pastelColors[index % pastelColors.length]}
                      stroke="#ffffff"
                      strokeWidth={0}
                    />
                    <SvgText
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize={26}
                      transform={`translate(${centroidX}, ${centroidY}) rotate(${labelRotation})`}
                    >
                      {d.data.label.length > 12 ? d.data.label.split(' ')[0] : d.data.label}
                    </SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>
    );
  }

  return <View>{drawChart()}</View>;
}

export default PieChart;
