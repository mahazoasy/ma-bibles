import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  reference: string;
  text: string;
  onPress: () => void;
  onRemove?: () => void;
  highlight?: string;
  isFavorite?: boolean;
}

export function VerseItem({ reference, text, onPress, onRemove, highlight, isFavorite }: Props) {
  const highlightText = (content: string, query?: string) => {
    if (!query) return content;
    const parts = content.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={i} style={styles.highlight}>{part}</Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.reference}>{reference}</Text>
        {onRemove && (
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="heart-dislike" size={20} color="#c97e5a" />
          </TouchableOpacity>
        )}
        {isFavorite && !onRemove && <Ionicons name="heart" size={18} color="#c97e5a" />}
      </View>
      <Text style={styles.verseText} numberOfLines={3}>
        {highlight ? highlightText(text, highlight) : text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff8f0', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#ebdfc9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reference: { fontSize: 14, fontWeight: '600', color: '#8b5a2b' },
  verseText: { fontSize: 16, fontFamily: 'Georgia', color: '#2c2418', lineHeight: 22 },
  highlight: { backgroundColor: '#ffecb3', fontWeight: 'bold', color: '#b76e2e' },
});
