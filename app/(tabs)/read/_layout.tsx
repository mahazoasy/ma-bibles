import { Stack } from 'expo-router';

export default function ReadLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Liste des livres' }} />
      <Stack.Screen name="[bookId]/index" options={{ title: 'Chapitres' }} />
      <Stack.Screen name="[bookId]/[chapterId]" options={{ title: 'Lecture' }} />
    </Stack>
  );
}