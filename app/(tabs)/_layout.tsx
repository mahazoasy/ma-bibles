import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useLanguage } from '../../src/context/LanguageContext';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const { t } = useLanguage();
  const isDark = colorScheme === 'dark';
  const tintColor = isDark ? '#d4b87a' : '#8b5a2b';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
        tabBarStyle: {
          backgroundColor: isDark ? '#1c1c1c' : '#fef7e8',
          borderTopColor: isDark ? '#333' : '#e0d6c0',
        },
        headerStyle: {
          backgroundColor: isDark ? '#2a2418' : '#f5e6d3',
        },
        headerTitleStyle: {
          fontFamily: 'Arial',
          color: isDark ? '#d4b87a' : '#5a3e1b',
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: t('home'), tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="read" options={{ title: t('read'), tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />, headerShown: false }} />
      <Tabs.Screen name="search" options={{ title: t('search'), tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="favorites" options={{ title: t('favorites'), tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}