import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { loadLocalMedia, startPlayer, checkStatus } from '../services/mediaManager';

const Interface = () => {
  const [status, setStatus] = useState('Aguardando requisições...');

  // Função para carregar mídia local
  const handleLoadLocalMedia = async () => {
    try {
      const media = await loadLocalMedia();
      if (media) {
        Alert.alert('Sucesso', 'Mídia local carregada com sucesso!');
      } else {
        Alert.alert('Erro', 'Nenhuma mídia encontrada.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar a mídia local.');
    }
  };

  // Função para iniciar o player
  const handleStartPlayer = () => {
    try {
      startPlayer();
      Alert.alert('Player', 'Player iniciado!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao iniciar o player.');
    }
  };

  // Função para checar status da requisição
  const handleCheckStatus = async () => {
    try {
      const currentStatus = await checkStatus();
      setStatus(currentStatus);
    } catch (error) {
      setStatus('Erro na comunicação com o servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mídia Indoor Player</Text>
      <View style={styles.buttonContainer}>
        <Button title="Carregar Mídia Local" onPress={handleLoadLocalMedia} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Iniciar Player" onPress={handleStartPlayer} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Ver Status" onPress={handleCheckStatus} />
      </View>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default Interface;
