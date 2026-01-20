import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { Sidebar } from '../components';

const SettingsScreen = ({ navigation }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState('https://avatars.githubusercontent.com/u/176968157?v=4');
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('(11) 97055-6189');
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');

  const STORAGE_KEYS = {
    NOTIFICATIONS: '@settings_notifications',
    DARK_MODE: '@settings_dark_mode',
    PHONE_NUMBER: '@settings_phone_number',
    PROFILE_IMAGE: '@settings_profile_image',
  };

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const [notifications, darkMode, phone, image] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.PHONE_NUMBER),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE_IMAGE),
      ]);

      if (notifications !== null) setNotificationsEnabled(JSON.parse(notifications));
      if (darkMode !== null) setDarkModeEnabled(JSON.parse(darkMode));
      if (phone !== null) setPhoneNumber(phone);
      if (image !== null) setProfileImage(image);

      console.log('Preferências carregadas');
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas preferências.');
    }
  };

  const savePreference = async (key, value, isString = false) => {
    try {
      const valueToSave = isString ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, valueToSave);
      console.log(`Preferência ${key} salva:`, value);
    } catch (error) {
      console.error('Erro ao salvar preferência:', error);
      Alert.alert('Erro', 'Não foi possível salvar a preferência.');
    }
  };

  const handleNotificationsToggle = (value) => {
    setNotificationsEnabled(value);
    savePreference(STORAGE_KEYS.NOTIFICATIONS, value);
  };

  const handleDarkModeToggle = (value) => {
    setDarkModeEnabled(value);
    savePreference(STORAGE_KEYS.DARK_MODE, value);
  };

  const handleMenuPress = () => setIsSidebarVisible(true);
  const closeSidebar = () => setIsSidebarVisible(false);

  const handleEditPhone = () => {
    setTempPhoneNumber(phoneNumber);
    setIsPhoneModalVisible(true);
  };

  const handlePhoneCancel = () => {
    setTempPhoneNumber('');
    setIsPhoneModalVisible(false);
  };

  const handlePhoneSave = async () => {
    if (tempPhoneNumber.trim() === '') {
      Alert.alert('Erro', 'Por favor, digite um número de telefone válido.');
      return;
    }

    setPhoneNumber(tempPhoneNumber);
    setIsPhoneModalVisible(false);
    setTempPhoneNumber('');

    await savePreference(STORAGE_KEYS.PHONE_NUMBER, tempPhoneNumber, true);

    console.log('Telefone atualizado para:', tempPhoneNumber);
    Alert.alert('Sucesso', 'Telefone atualizado com sucesso!');
  };

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');

    if (cleaned.length <= 2) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  const handlePhoneInputChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setTempPhoneNumber(formatted);
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à galeria para alterar a foto do perfil.');
        return;
      }

      Alert.alert(
        'Alterar foto do perfil',
        'Escolha uma opção:',
        [
          { text: 'Galeria', onPress: () => pickImageFromLibrary() },
          { text: 'Câmera', onPress: () => pickImageFromCamera() },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.log('Erro ao solicitar permissão:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar acessar a galeria.');
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        setProfileImage(newImageUri);
        await savePreference(STORAGE_KEYS.PROFILE_IMAGE, newImageUri, true);
        console.log('Nova imagem selecionada:', newImageUri);
      }
    } catch (error) {
      console.log('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
    }
  };

  const pickImageFromCamera = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.granted === false) {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera para tirar uma foto.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        setProfileImage(newImageUri);
        await savePreference(STORAGE_KEYS.PROFILE_IMAGE, newImageUri, true);
        console.log('Nova foto tirada:', newImageUri);
      }
    } catch (error) {
      console.log('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tirar a foto.');
    }
  };

  const userInfo = {
    name: 'GIORDANO BRUNO BIASI BERWIG',
    login: '@giordano.berwig',
    email: 'giordano.berwig@unijui.edu.br',
    course: 'Ciência da Computação',
    registration: '202012345',
    phone: phoneNumber,
    avatar: profileImage
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => console.log('Logout realizado')
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, showBorder = true }) => (
    <TouchableOpacity
      style={[styles.settingItem, !showBorder && styles.settingItemNoBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#01458E" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent || <Ionicons name="chevron-forward" size={20} color="#666" />}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Configurações"
        leftIcon="menu"
        onLeftPress={handleMenuPress}
        showLeftIcon={true}
        showRightIcon={false}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userInfo.avatar }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handleImagePicker}
            >
              <Ionicons name="brush" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userInfo.name}</Text>
            <Text style={styles.profileLogin}>{userInfo.login}</Text>
          </View>
        </View>

        <SectionHeader title="INFORMAÇÕES DA CONTA" />
        <View style={styles.section}>
          <SettingItem
            icon="person-outline"
            title="Nome completo"
            subtitle={userInfo.name}
            rightComponent={<View />}
          />
          <SettingItem
            icon="mail-outline"
            title="E-mail"
            subtitle={userInfo.email}
            rightComponent={<View />}
          />
          <SettingItem
            icon="school-outline"
            title="Curso"
            subtitle={userInfo.course}
            rightComponent={<View />}
          />
          <SettingItem
            icon="id-card-outline"
            title="Matrícula"
            subtitle={userInfo.registration}
            rightComponent={<View />}
          />
          <SettingItem
            icon="call-outline"
            title="Telefone"
            subtitle={phoneNumber}
            onPress={handleEditPhone}
            showBorder={false}
          />
        </View>

        <SectionHeader title="PREFERÊNCIAS" />
        <View style={styles.section}>
          <SettingItem
            icon="notifications-outline"
            title="Notificações"
            subtitle="Receber notificações push"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: '#ddd', true: '#01458E' }}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            }
          />
          <SettingItem
            icon="moon-outline"
            title="Modo escuro"
            subtitle="Aparência escura do aplicativo"
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#ddd', true: '#01458E' }}
                thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
              />
            }
            showBorder={false}
          />
        </View>

        <SectionHeader title="SEGURANÇA" />
        <View style={styles.section}>
          <SettingItem
            icon="key-outline"
            title="Alterar senha"
            subtitle="Modificar sua senha de acesso"
            onPress={() => console.log('Alterar senha')}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Autenticação de dois fatores"
            subtitle="Adicionar camada extra de segurança"
            onPress={() => console.log('2FA')}
            showBorder={false}
          />
        </View>

        <SectionHeader title="SUPORTE" />
        <View style={styles.section}>
          <SettingItem
            icon="help-circle-outline"
            title="Central de ajuda"
            subtitle="FAQ e tutoriais"
            onPress={() => console.log('Ajuda')}
          />
          <SettingItem
            icon="chatbubble-outline"
            title="Contatar suporte"
            subtitle="Falar com nossa equipe"
            onPress={() => console.log('Contato')}
          />
          <SettingItem
            icon="information-circle-outline"
            title="Sobre o aplicativo"
            subtitle="Versão 1.0.0"
            onPress={() => console.log('Sobre')}
            showBorder={false}
          />
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF4444" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Modal
        visible={isPhoneModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handlePhoneCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar telefone</Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Número de telefone:</Text>
              <TextInput
                style={styles.textInput}
                value={tempPhoneNumber}
                onChangeText={handlePhoneInputChange}
                placeholder="(XX) XXXXX-XXXX"
                keyboardType="numeric"
                maxLength={15}
                autoFocus={true}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handlePhoneCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handlePhoneSave}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={closeSidebar}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageContainer: {
    marginRight: 15,
    position: 'relative',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#01458E',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#01458E',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileLogin: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemNoBorder: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutSection: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
    minWidth: 300,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  modalContent: {
    padding: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#01458E',
    borderBottomRightRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SettingsScreen;
