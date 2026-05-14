import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { Colors } from "../theme";

// Screens
import GalleryScreen      from "../screens/GalleryScreen";
import ArtworkDetailScreen from "../screens/ArtworkDetailScreen";
import ArtistsScreen      from "../screens/ArtistsScreen";
import ArtistDetailScreen from "../screens/ArtistDetailScreen";
import WipScreen          from "../screens/WipScreen";
import HeritageScreen     from "../screens/HeritageScreen";
import HeritageDetailScreen from "../screens/HeritageDetailScreen";

export type RootStackParamList = {
  MainTabs: undefined;
  ArtworkDetail: { artworkId: string };
  ArtistDetail:  { artistId: string };
  HeritageDetail:{ storyId: string };
};

export type GalleryStackParamList = {
  Gallery:       undefined;
  ArtworkDetail: { artworkId: string };
};

export type ArtistStackParamList = {
  Artists:      undefined;
  ArtistDetail: { artistId: string };
};

export type HeritageStackParamList = {
  Heritage:      undefined;
  HeritageDetail:{ storyId: string };
};

const Tab   = createBottomTabNavigator();
const GStack = createStackNavigator<GalleryStackParamList>();
const AStack = createStackNavigator<ArtistStackParamList>();
const HStack = createStackNavigator<HeritageStackParamList>();

const TAB_ICON: Record<string, string> = {
  GalleryTab:  "🖼️",
  WipTab:      "⚒️",
  ArtistTab:   "🧑‍🎨",
  HeritageTab: "🏛️",
};

function GalleryStack() {
  return (
    <GStack.Navigator screenOptions={{ headerStyle:{ backgroundColor:Colors.cream }, headerTintColor:Colors.ink, headerTitleStyle:{ fontFamily:"Georgia" } }}>
      <GStack.Screen name="Gallery" component={GalleryScreen} options={{ title:"Gallery" }} />
      <GStack.Screen name="ArtworkDetail" component={ArtworkDetailScreen} options={{ title:"Artwork" }} />
    </GStack.Navigator>
  );
}

function ArtistStack() {
  return (
    <AStack.Navigator screenOptions={{ headerStyle:{ backgroundColor:Colors.cream }, headerTintColor:Colors.ink, headerTitleStyle:{ fontFamily:"Georgia" } }}>
      <AStack.Screen name="Artists" component={ArtistsScreen} options={{ title:"Artists" }} />
      <AStack.Screen name="ArtistDetail" component={ArtistDetailScreen} options={{ title:"Artist" }} />
    </AStack.Navigator>
  );
}

function HeritageStack() {
  return (
    <HStack.Navigator screenOptions={{ headerStyle:{ backgroundColor:Colors.cream }, headerTintColor:Colors.ink, headerTitleStyle:{ fontFamily:"Georgia" } }}>
      <HStack.Screen name="Heritage" component={HeritageScreen} options={{ title:"Heritage Stories" }} />
      <HStack.Screen name="HeritageDetail" component={HeritageDetailScreen} options={{ title:"Heritage" }} />
    </HStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: { backgroundColor: Colors.white, borderTopColor: Colors.border, height: 60 },
        tabBarLabelStyle: { fontSize: 11, marginBottom: 4 },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICON[route.name] || ""}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="GalleryTab"  component={GalleryStack}  options={{ title:"Gallery"  }} />
      <Tab.Screen name="WipTab"      component={WipScreen}      options={{ title:"WIP Timeline", headerShown:true, headerStyle:{ backgroundColor:Colors.cream }, headerTitleStyle:{ fontFamily:"Georgia" } }} />
      <Tab.Screen name="ArtistTab"   component={ArtistStack}   options={{ title:"Artists"  }} />
      <Tab.Screen name="HeritageTab" component={HeritageStack} options={{ title:"Heritage"   }} />
    </Tab.Navigator>
  );
}

