import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Chapter } from '../../src/types';

interface Props {
  chapter: Chapter;
  onVersePress: (verseNum: number, verseText: string) => void;
  isFavorite: (verseNum: number) => boolean;
}

export function ChapterText({ chapter, onVersePress, isFavorite }: Props) {
  return (
    <View>
      {chapter.versets.map((verse) => (
        <TouchableOpacity
          key={verse.numero}
          onPress={() => onVersePress(verse.numero, verse.texte)}
          style={[styles.verseContainer, isFavorite(verse.numero) && styles.favoriteVerse]}
          activeOpacity={0.8}
        >
          <Text style={styles.verseNumber}>{verse.numero}</Text>
          <Text style={styles.verseText}>{verse.texte}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  verseContainer: { flexDirection: 'row', marginBottom: 16, paddingVertical: 4, paddingRight: 8 },
  favoriteVerse: { backgroundColor: '#fff0cc', borderRadius: 12, paddingLeft: 8 },
  verseNumber: { fontSize: 14, fontWeight: 'bold', color: '#b88b5a', width: 32, marginRight: 8, textAlign: 'right' },
  verseText: { flex: 1, fontSize: 18, fontFamily: 'Georgia', color: '#2c2418', lineHeight: 26 },
});
