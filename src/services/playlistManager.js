import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Função para salvar a playlist na memória local
export const savePlaylist = async (playlist) => {
  try {
    // Verificar se algum item precisa de ajuste de Base64
    const processedPlaylist = playlist.map((item) => {
      if (item.type === 'image' && item.content && !item.content.startsWith('data:image')) {
        // Se necessário, converte bytes em string Base64 antes de salvar
        item.content = `data:image/png;base64,${item.content}`;
      }
      return item;
    });

    await AsyncStorage.setItem('currentPlaylist', JSON.stringify(processedPlaylist));
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

// Função para carregar mídia local
export const loadLocalMedia = async () => {
  try {
    const playlist = await loadPlaylist();
    if (playlist) {
      console.log('Playlist carregada:', playlist);
      return playlist;
    } else {
      console.log('Nenhuma playlist encontrada.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao carregar mídia local:', error);
    throw error;
  }
};

// Função para iniciar o player (pode ser expandida para mais funcionalidades)
export const startPlayer = () => {
  // Aqui você pode colocar a lógica para iniciar o player
  console.log('Player iniciado');
};

// Função para verificar o status da requisição
export const checkStatus = async () => {
  // Aqui você pode adicionar a lógica de verificação de status da comunicação
  return 'Aguardando requisições...'; // ou retornar algum erro, caso haja falha na comunicação
};
