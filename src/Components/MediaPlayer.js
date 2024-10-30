import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Função para verificar e converter conteúdo para Base64 automaticamente
const convertToBase64 = (content) => {
  // Verifica se o conteúdo é uma string de bytes que precisa de conversão para Base64
  if (typeof content === 'string' && !content.startsWith('data:image')) {
    return `data:image/png;base64,${content}`;
  }
  return content;
};

const MediaPlayer = ({ playlist }) => {
  const [currentMedia, setCurrentMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localImageUri, setLocalImageUri] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (playlist && playlist.length > 0) {
      setCurrentMedia(playlist[currentIndex]);
      console.log('Current Media:', playlist[currentIndex]);
    }
  }, [playlist, currentIndex]);

  const handleNextMedia = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const decodeAndStoreImage = async (base64String) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'image.png';
      await FileSystem.writeAsStringAsync(fileUri, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setLocalImageUri(fileUri);
      console.log("Imagem salva no URI:", fileUri);
    } catch (error) {
      console.error("Erro ao salvar a imagem localmente", error);
    }
  };

  useEffect(() => {
    if (currentMedia?.type === 'image' && currentMedia.content) {
      const base64Data = convertToBase64(currentMedia.content).split(',')[1];
      decodeAndStoreImage(base64Data);
    }
  }, [currentMedia]);

  const renderMedia = (media) => {
    if (!media) return <Text>Nenhuma mídia para reproduzir</Text>;
    console.log("Estado atual de localImageUri:", localImageUri);

    switch (media.type) {
      case 'image':
        return localImageUri ? (
          <Image source={{ uri: localImageUri }} style={styles.image} />
        ) : (
          <Text>Carregando imagem...</Text>
        );
      case 'video':
        return (
          <Video
            source={{ uri: media.url }}
            style={styles.video}
            controls={true}
            resizeMode="contain"
            onEnd={handleNextMedia}
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

  return (
    <View style={styles.container}>
      {currentMedia ? renderMedia(currentMedia) : <Text>Nenhuma mídia disponível</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  image: { width: '100%', height: undefined, aspectRatio: 1, resizeMode: 'contain' },
  video: { width: '100%', height: '100%' },
  text: { fontSize: 18, color: '#fff', textAlign: 'center', padding: 10 },
  htmlContainer: { padding: 10, width: '100%' },
});

export default MediaPlayer;
