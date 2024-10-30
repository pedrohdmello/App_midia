import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { loadPlaylist, savePlaylist } from './src/services/playlistManager';
import MediaPlayer from './src/Components/MediaPlayer';

const PLAYLIST_SERVER_URL = 'http://192.168.0.10:8080/playlist';

export default function App() {
  const playlist = [ //Forma manual para verificar se está renderizando
    { type: 'image', content: 'data:image/png;base64,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' },
  ];
  //const [playlist, setPlaylist] = useState(null); //Forma dinâmica para carregar a playlist
  const [status, setStatus] = useState('');  // Status do aplicativo
  const [isLoading, setIsLoading] = useState(false);  // Indicador de carregamento

  // Função para buscar a playlist do servidor
  const handleServerRequest = async (playlistId, userId) => {
    try {
      setIsLoading(true);
      setStatus('Baixando playlist...');

      const response = await fetch(PLAYLIST_SERVER_URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistId: playlistId, 
          userId: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Playlist baixada:', data);

        if (data.playlist && Array.isArray(data.playlist)) {
          const processedPlaylist = data.playlist.map((item) => {
            // Verificar e formatar imagens em Base64
            if (item.type === 'image' && item.content && !item.content.startsWith('data:image')) {
              item.content = `data:image/png;base64,${item.content}`;
            }
            return item;
          });

          setPlaylist(processedPlaylist);  // Atualiza a playlist com os dados processados
          await savePlaylist(processedPlaylist);  // Salva a playlist localmente
          setStatus('Playlist baixada e salva com sucesso.');
        } else {
          setStatus('Formato da playlist inválido.');
        }
      } else {
        setStatus('Erro ao baixar a playlist.');
      }
    } catch (error) {
      console.error('Erro na comunicação com o servidor:', error);
      setStatus('Erro na comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para carregar a playlist localmente ao iniciar o app
  useEffect(() => {
    const loadInitialPlaylist = async () => {
      const savedPlaylist = await loadPlaylist();
      if (savedPlaylist) {
        setPlaylist(savedPlaylist);
        setStatus('Playlist local carregada.');
        console.log('Playlist carregada localmente:', savedPlaylist);
      } else {
        console.log('Nenhuma playlist local encontrada.');
      }
    };
    loadInitialPlaylist();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Baixar Playlist do Servidor"
          onPress={() => {
            handleServerRequest(19, 1);
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Carregar Mídia Local"
          onPress={async () => {
            const savedPlaylist = await loadPlaylist();
            if (savedPlaylist) {
              setPlaylist(savedPlaylist);
              setStatus('Playlist local carregada.');
            } else {
              setStatus('Nenhuma playlist local carregada.');
            }
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar Player"
          onPress={() => {
            if (playlist) {
              console.log('Reproduzindo playlist:', playlist);
              setStatus('Reproduzindo playlist...');
            } else {
              setStatus('Nenhuma playlist para reproduzir.');
            }
          }}
        />
      </View>

      <Text style={styles.status}>{status}</Text>

      {playlist ? (
        <View style={styles.mediaPlayerContainer}>
          <MediaPlayer playlist={playlist} />
        </View>
      ) : (
        <Text style={styles.status}>Nenhuma playlist disponível.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  status: {
    marginVertical: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  mediaPlayerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
