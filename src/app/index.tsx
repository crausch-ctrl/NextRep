import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome NextRep
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          PLAYER DASHBOARD
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
         <ThemedText type="subtitle">Your Performance</ThemedText>

        <ThemedView style={styles.statCard}>
           <ThemedText>Bench Press</ThemedText>
           <ThemedText type="subtitle">225 lbs</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText>Squat</ThemedText>
          <ThemedText type="subtitle">315 lbs</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText>40-Yard Dash</ThemedText>
          <ThemedText type="subtitle">4.72 sec</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText>Vertical Jump</ThemedText>
          <ThemedText type="subtitle">31 in</ThemedText>
        </ThemedView>
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  statCard: {
   padding: Spacing.three,
   borderRadius: Spacing.three,
   borderWidth: 1,
   gap: Spacing.one,
},
});
