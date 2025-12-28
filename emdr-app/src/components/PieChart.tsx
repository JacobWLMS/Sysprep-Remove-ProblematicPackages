import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { Text } from './ui/Text';
import { useTheme } from '../theme';

export interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  title?: string;
  centerValue?: string;
  centerLabel?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  title,
  centerValue,
  centerLabel,
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const radius = size / 2 - 10;
  const center = size / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <View style={styles.container}>
        {title && (
          <Text variant="h5" style={styles.title}>
            {title}
          </Text>
        )}
        <View style={[styles.emptyState, { width: size, height: size }]}>
          <Text variant="caption" color="textTertiary">
            No data yet
          </Text>
        </View>
      </View>
    );
  }

  // Calculate angles for each slice
  let currentAngle = -90; // Start at top
  const slices = data.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...item,
      startAngle,
      endAngle,
      percentage: (item.value / total) * 100,
    };
  });

  const polarToCartesian = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle, radius);
    const end = polarToCartesian(endAngle, radius);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  };

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="h5" style={styles.title}>
          {title}
        </Text>
      )}

      <Svg width={size} height={size}>
        {/* Pie slices */}
        {slices.map((slice, index) => (
          <Path key={index} d={createArc(slice.startAngle, slice.endAngle)} fill={slice.color} />
        ))}

        {/* Center circle (donut hole) */}
        <Circle cx={center} cy={center} r={radius * 0.6} fill={theme.colors.background} />

        {/* Center text */}
        {centerValue && (
          <SvgText
            x={center}
            y={center - 8}
            fontSize="32"
            fontWeight="bold"
            fill={theme.colors.textPrimary}
            textAnchor="middle"
          >
            {centerValue}
          </SvgText>
        )}
        {centerLabel && (
          <SvgText
            x={center}
            y={center + 20}
            fontSize="14"
            fill={theme.colors.textSecondary}
            textAnchor="middle"
          >
            {centerLabel}
          </SvgText>
        )}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        {slices
          .filter((slice) => slice.percentage > 2) // Only show slices > 2%
          .map((slice, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: slice.color }]} />
              <Text variant="caption" color="textSecondary">
                {slice.label} ({slice.percentage.toFixed(0)}%)
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    title: {
      marginBottom: theme.spacing[3],
    },
    emptyState: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.full,
    },
    legend: {
      marginTop: theme.spacing[4],
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing[3],
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    legendColor: {
      width: 16,
      height: 16,
      borderRadius: theme.borderRadius.sm,
    },
  });
