import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Função para salvar a playlist na memória local
export const savePlaylist = async (playlist) => {
  try {
    await AsyncStorage.setItem('currentPlaylist', JSON.stringify(playlist)); // Usando o mesmo nome de chave
    console.log('Playlist salva na memória.');
  } catch (error) {
    console.error('Erro ao salvar a playlist:', error);
  }
};

// Função para carregar a playlist da memória local
export const loadPlaylist = async () => {
  try {
    const playlist = await AsyncStorage.getItem('currentPlaylist');
    return playlist ? JSON.parse(playlist) : null;
  } catch (error) {
    console.error('Erro ao carregar a playlist:', error);
    return null;
  }
};

// Função para deletar a playlist da memória local
export const deletePlaylist = async () => {
  try {
    await AsyncStorage.removeItem('currentPlaylist');
    console.log('Playlist deletada.');
  } catch (error) {
    console.error('Erro ao deletar a playlist:', error);
  }
};

// Função para salvar um arquivo de mídia localmente usando expo-file-system
export const saveMediaFile = async (uri, fileName) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  try {
    await FileSystem.downloadAsync(uri, fileUri);
    console.log('Arquivo salvo em:', fileUri);
    return fileUri;
  } catch (error) {
    console.error('Erro ao salvar o arquivo:', error);
    return null;
  }
};

// Função para deletar um arquivo de mídia localmente
export const deleteMediaFile = async (fileName) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  try {
    await FileSystem.deleteAsync(fileUri);
    console.log('Arquivo deletado:', fileUri);
  } catch (error) {
    console.error('Erro ao deletar o arquivo:', error);
  }
};
