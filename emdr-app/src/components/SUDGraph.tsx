import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Line, Circle, Path, Text as SVGText, G } from 'react-native-svg';
import { useTheme, getSUDColor, getSUDEmoji } from '../theme';
import { Text } from './ui/Text';
import { SUDRating } from '../types';

interface SUDGraphProps {
  preSUD: SUDRating;
  postSUD: SUDRating;
  midSUDs?: SUDRating[];
  width?: number;
  height?: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const SUDGraph: React.FC<SUDGraphProps> = ({
  preSUD,
  postSUD,
  midSUDs = [],
  width = Dimensions.get('window').width - 64,
  height = 200,
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const animationProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationProgress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Combine all SUD ratings in chronological order
  const allRatings = [preSUD, ...midSUDs, postSUD];
  const dataPoints = allRatings.map((r) => r.value);

  // Calculate positions
  const maxValue = 10;
  const minValue = 0;
  const range = maxValue - minValue;

  const getX = (index: number) => {
    return padding + (chartWidth / (dataPoints.length - 1)) * index;
  };

  const getY = (value: number) => {
    return padding + chartHeight - ((value - minValue) / range) * chartHeight;
  };

  // Create path for line chart
  const pathData = dataPoints
    .map((value, index) => {
      const x = getX(index);
      const y = getY(value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Create gradient fill path
  const fillPathData =
    pathData +
    ` L ${getX(dataPoints.length - 1)} ${padding + chartHeight}` +
    ` L ${getX(0)} ${padding + chartHeight} Z`;

  const change = postSUD.value - preSUD.value;
  const improved = change < 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h4" align="center">
          Your Progress
        </Text>
      </View>

      {/* Graph */}
      <View style={styles.graphContainer}>
        <Svg width={width} height={height}>
          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10].map((value) => {
            const y = getY(value);
            return (
              <G key={value}>
                <Line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke={theme.colors.border}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity={0.3}
                />
                <SVGText
                  x={padding - 10}
                  y={y + 5}
                  fill={theme.colors.textTertiary}
                  fontSize="12"
                  textAnchor="end"
                >
                  {value}
                </SVGText>
              </G>
            );
          })}

          {/* Fill area */}
          <Path
            d={fillPathData}
            fill={improved ? theme.colors.success : theme.colors.primary}
            opacity={0.1}
          />

          {/* Line */}
          <Path
            d={pathData}
            stroke={improved ? theme.colors.success : theme.colors.primary}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {dataPoints.map((value, index) => {
            const x = getX(index);
            const y = getY(value);
            const isFirst = index === 0;
            const isLast = index === dataPoints.length - 1;
            const pointColor = isLast
              ? improved
                ? theme.colors.success
                : theme.colors.primary
              : getSUDColor(value);

            return (
              <G key={index}>
                <Circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={pointColor}
                  stroke={theme.colors.background}
                  strokeWidth="2"
                />
                {/* Labels for first and last */}
                {(isFirst || isLast) && (
                  <SVGText
                    x={x}
                    y={isFirst ? y - 15 : y + 20}
                    fill={theme.colors.textPrimary}
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {value}
                  </SVGText>
                )}
              </G>
            );
          })}

          {/* X-axis labels */}
          <SVGText
            x={getX(0)}
            y={height - 10}
            fill={theme.colors.textSecondary}
            fontSize="12"
            textAnchor="middle"
          >
            Before
          </SVGText>
          {midSUDs.length > 0 && (
            <SVGText
              x={width / 2}
              y={height - 10}
              fill={theme.colors.textSecondary}
              fontSize="12"
              textAnchor="middle"
            >
              During
            </SVGText>
          )}
          <SVGText
            x={getX(dataPoints.length - 1)}
            y={height - 10}
            fill={theme.colors.textSecondary}
            fontSize="12"
            textAnchor="middle"
          >
            After
          </SVGText>
        </Svg>
      </View>

      {/* Change Summary */}
      <View style={styles.summary}>
        <View
          style={[
            styles.changeCard,
            { backgroundColor: improved ? theme.colors.sud.calm + '20' : theme.colors.sud.high + '20' },
          ]}
        >
          <Text variant="h2" style={{ color: improved ? theme.colors.success : theme.colors.warning }}>
            {improved ? '↓' : change > 0 ? '↑' : '–'} {Math.abs(change)}
          </Text>
          <Text variant="bodyLarge" color="textSecondary" style={styles.changeLabel}>
            {improved ? 'Distress reduced' : change > 0 ? 'Distress increased' : 'No change'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    header: {
      marginBottom: theme.spacing[4],
    },
    graphContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing[6],
    },
    summary: {
      alignItems: 'center',
    },
    changeCard: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[6],
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      minWidth: 200,
    },
    changeLabel: {
      marginTop: theme.spacing[2],
    },
  });
