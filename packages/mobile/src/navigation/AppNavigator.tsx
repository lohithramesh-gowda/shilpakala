import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Colors, Spacing, Radius } from '../theme';

// ── Screens ──────────────────────────────────────────────────────────────────
import ArtistsScreen        from '../screens/ArtistsScreen';
import ArtistDetailScreen   from '../screens/ArtistDetailScreen';
import ArtworksScreen       from '../screens/ArtworksScreen';
import ArtworkDetailScreen  from '../screens/ArtworkDetailScreen';
import WipTimelineScreen    from '../screens/WipTimelineScreen';
import HeritageScreen       from '../screens/HeritageScreen';
import HeritageDetailScreen from '../screens/HeritageDetailScreen';

// ── Tab Navigator ─────────────────────────────────────────────────────────────
const Tab    = createBottomTabNavigator();
const Stack  = createNativeStackNavigator();

const screenOptions = {
  headerStyle:      { backgroundColor: Colors.cream },
  headerTintColor:  Colors.ink,
  headerTitleStyle: { fontSize: 17, fontWeight: '600' as const, fontStyle: 'italic' as const },
  headerBackTitleVisible: false,
  contentStyle:     { backgroundColor: Colors.cream },
};

function ArtistsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ArtistsList"   component={ArtistsScreen}       options={{ title: 'Shilpis' }} />
      <Stack.Screen name="ArtistDetail"  component={ArtistDetailScreen}  options={{ title: '' }} />
      <Stack.Screen name="ArtworkDetail" component={ArtworkDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="WipTimeline"   component={WipTimelineScreen}   options={{ title: 'Work in Progress' }} />
    </Stack.Navigator>
  );
}

function GalleryStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ArtworksList"  component={ArtworksScreen}      options={{ title: 'Gallery' }} />
      <Stack.Screen name="ArtworkDetail" component={ArtworkDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="WipTimeline"   component={WipTimelineScreen}   options={{ title: 'Work in Progress' }} />
    </Stack.Navigator>
  );
}

function HeritageStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HeritageList"   component={HeritageScreen}       options={{ title: 'Heritage' }} />
      <Stack.Screen name="HeritageDetail" component={HeritageDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

// ── Tab Icons ─────────────────────────────────────────────────────────────────
function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{
        fontSize: 10, marginTop: 2,
        color: focused ? Colors.gold : Colors.muted,
        fontWeight: focused ? '700' : '400',
      }}>
        {label}
      </Text>
    </View>
  );
}

// ── Root Navigator ────────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 72,
            paddingBottom: Spacing.sm,
          },
        }}
      >
        <Tab.Screen
          name="Artists"
          component={ArtistsStack}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏺" label="Shilpis" focused={focused} /> }}
        />
        <Tab.Screen
          name="Gallery"
          component={GalleryStack}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🖼" label="Gallery" focused={focused} /> }}
        />
        <Tab.Screen
          name="Heritage"
          component={HeritageStack}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏛" label="Heritage" focused={focused} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

