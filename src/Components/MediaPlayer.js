import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

// Componente que gerencia a reprodução de diferentes tipos de mídia
const MediaPlayer = ({ playlist }) => {
  const [currentMedia, setCurrentMedia] = useState(null); // Mídia atual sendo exibida
  const [currentIndex, setCurrentIndex] = useState(0);    // Índice da mídia atual na playlist
  const { width } = useWindowDimensions(); // Pega a largura da tela para renderizar HTML

  // Atualiza a mídia atual quando a playlist ou o índice mudar
  useEffect(() => {
    if (playlist && playlist.length > 0) {
      setCurrentMedia(playlist[currentIndex]);
    }
  }, [playlist, currentIndex]);

  // Função para avançar para a próxima mídia
  const handleNextMedia = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1); // Avança para o próximo
    } else {
      setCurrentIndex(0); // Volta ao início se chegar ao fim da playlist
    }
  };

  // Renderiza a mídia com base no tipo
  const renderMedia = (media) => {
    if (!media) return <Text>Nenhuma mídia para reproduzir</Text>;

    switch (media.type) {
      case 'image':
        return <Image source={{ uri: media.url }} style={styles.image} />;
      case 'video':
        return (
          <Video
            source={{ uri: media.url }}
            style={styles.video}
            controls={true}
            resizeMode="contain"
            onEnd={handleNextMedia} // Avança para a próxima mídia quando o vídeo terminar
          />
        );
      case 'text':
        return <Text style={styles.text}>{media.content}</Text>;
      case 'html':
        return (
          <ScrollView style={styles.htmlContainer}>
            <RenderHTML contentWidth={width} source={{ html: media.content }} />
          </ScrollView>
        );
      default:
        return <Text>Tipo de mídia não suportado</Text>;
    }
  };

  // Exibe o conteúdo da mídia atual
  return (
    <View style={styles.container}>
      {currentMedia ? renderMedia(currentMedia) : <Text>Nenhuma mídia disponível</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  image: { width: '100%', height: 200, resizeMode: 'contain' },
  video: { width: '100%', height: width * 0.56 },
  text: { fontSize: 18, color: '#fff', textAlign: 'center', padding: 10 },
  htmlContainer: { padding: 10, width: '100%' },
});

export default MediaPlayer;
