import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { Text } from './ui/Text';
import { theme } from '../theme';

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  maxValue?: number;
  title?: string;
  showValues?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 300,
  height = 200,
  maxValue,
  title,
  showValues = true,
}) => {
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const barWidth = chartWidth / data.length - 8;

  const getBarHeight = (value: number) => {
    return (value / max) * chartHeight;
  };

  const getBarY = (value: number) => {
    return paddingTop + chartHeight - getBarHeight(value);
  };

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="h5" style={styles.title}>
          {title}
        </Text>
      )}
      <Svg width={width} height={height}>
        {/* Y-axis */}
        <Line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={paddingTop + chartHeight}
          stroke={theme.colors.border}
          strokeWidth="2"
        />

        {/* X-axis */}
        <Line
          x1={paddingLeft}
          y1={paddingTop + chartHeight}
          x2={paddingLeft + chartWidth}
          y2={paddingTop + chartHeight}
          stroke={theme.colors.border}
          strokeWidth="2"
        />

        {/* Bars */}
        {data.map((item, index) => {
          const barX = paddingLeft + (index * chartWidth) / data.length + 4;
          const barY = getBarY(item.value);
          const barH = getBarHeight(item.value);
          const color = item.color || theme.colors.primary;

          return (
            <React.Fragment key={index}>
              {/* Bar */}
              <Rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barH}
                fill={color}
                rx={theme.borderRadius.sm}
              />

              {/* Value label */}
              {showValues && item.value > 0 && (
                <SvgText
                  x={barX + barWidth / 2}
                  y={barY - 5}
                  fontSize="12"
                  fill={theme.colors.textSecondary}
                  textAnchor="middle"
                >
                  {item.value.toFixed(1)}
                </SvgText>
              )}

              {/* X-axis label */}
              <SvgText
                x={barX + barWidth / 2}
                y={paddingTop + chartHeight + 20}
                fontSize="11"
                fill={theme.colors.textTertiary}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing[3],
  },
});
