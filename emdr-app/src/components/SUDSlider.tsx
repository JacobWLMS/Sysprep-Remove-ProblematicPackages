import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface SUDSliderProps {
  value: number;
  onChange: (value: number) => void;
  showLabels?: boolean;
}

const SUD_LABELS = [
  { value: 0, label: 'No distress' },
  { value: 5, label: 'Moderate' },
  { value: 10, label: 'Worst imaginable' },
];

export const SUDSlider: React.FC<SUDSliderProps> = ({
  value,
  onChange,
  showLabels = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distress Level (SUD)</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#00A8E8"
        maximumTrackTintColor="#555"
        thumbTintColor="#00A8E8"
      />
      {showLabels && (
        <View style={styles.labelsContainer}>
          {SUD_LABELS.map((label) => (
            <View key={label.value} style={styles.labelItem}>
              <Text style={styles.labelValue}>{label.value}</Text>
              <Text style={styles.labelText}>{label.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00A8E8',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelItem: {
    alignItems: 'center',
  },
  labelValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00A8E8',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    maxWidth: 80,
  },
});
