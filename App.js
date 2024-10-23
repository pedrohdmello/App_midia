import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { loadPlaylist, savePlaylist } from './src/services/playlistManager';
import MediaPlayer from './src/Components/MediaPlayer';

// URLs do servidor de arquivos e servidor HTTP
const FILE_SERVER_URL = 'http://129.148.24.46:8086/file/download';

export default function App() {
  const [playlist, setPlaylist] = useState(null);  // Playlist armazenada
  const [status, setStatus] = useState('');  // Status do aplicativo
  const [isLoading, setIsLoading] = useState(false);  // Indicador de carregamento

  // Função para buscar a playlist do servidor de arquivos
  const handleServerRequest = async (playlist, user) => {
    try {
      setIsLoading(true);
      setStatus('Baixando playlist...');

      // Configurando a requisição com método POST e enviando JSON
      const response = await fetch(FILE_SERVER_URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user, 
          playlist: playlist,
        }),
      });

      // Verificando se a resposta foi bem-sucedida
      if (response.ok) {
        const data = await response.json();
        console.log('Playlist baixada:', data);
        setPlaylist(data);  // Atualiza a playlist com os dados recebidos
        await savePlaylist(data);  // Salva a playlist localmente
        setStatus('Playlist baixada e salva com sucesso.');
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

  // Função para carregar playlist localmente ao iniciar o app
  useEffect(() => {
    const loadInitialPlaylist = async () => {
      const savedPlaylist = await loadPlaylist();
      if (savedPlaylist) {
        setPlaylist(savedPlaylist);
        setStatus('Playlist local carregada.');
        console.log('Playlist carregada localmente.');
      } else {
        console.log('Nenhuma playlist local encontrada.');
      }
    };
    loadInitialPlaylist();
  }, []);

  return (
    <View style={styles.container}>
      {/* Botão para carregar a mídia local */}
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

      {/* Botão para iniciar o player */}
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

      {/* Botão para verificar o status da requisição */}
      <View style={styles.buttonContainer}>
        <Button
          title="Verificar Status"
          onPress={() => {
            setStatus(isLoading ? 'Carregando...' : 'Aguardando requisição do servidor...');
          }}
        />
      </View>

      {/* Exibe o status atual */}
      <Text style={styles.status}>{status}</Text>

      {/* MediaPlayer para renderizar a playlist */}
      {playlist && <MediaPlayer playlist={playlist} />}
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
});
