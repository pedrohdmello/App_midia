import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para salvar a playlist localmente usando AsyncStorage
export const savePlaylist = async (playlist) => {
  try {
    await AsyncStorage.setItem('playlist', JSON.stringify(playlist));
    console.log('Playlist salva com sucesso');
  } catch (e) {
    console.error('Erro ao salvar a playlist:', e);
  }
};

// Função para carregar a playlist salva localmente
export const loadPlaylist = async () => {
  try {
    const playlist = await AsyncStorage.getItem('playlist');
    return playlist ? JSON.parse(playlist) : null;
  } catch (e) {
    console.error('Erro ao carregar a playlist:', e);
    return null;
  }
};

// Função para deletar a playlist salva localmente
export const deleteAllMedia = async () => {
  try {
    await AsyncStorage.removeItem('playlist');
    console.log('Playlist deletada com sucesso');
  } catch (e) {
    console.error('Erro ao deletar a playlist:', e);
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

// Função para iniciar o player
export const startPlayer = () => {
  // Aqui você pode colocar a lógica para iniciar o player
  console.log('Player iniciado');
};

// Função para verificar o status da requisição
export const checkStatus = async () => {
  // Aqui você pode adicionar a lógica de verificação de status da comunicação
  return 'Aguardando requisições...'; // ou retornar algum erro, caso haja falha na comunicação
};
