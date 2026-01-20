import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const Sidebar = ({ isVisible, onClose, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Animar entrada da sidebar
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Animar saída da sidebar
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth * 0.8,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isVisible]);

  const menuItems = [
    {
      id: 1,
      title: 'Início',
      icon: 'home-outline',
      screen: 'Home',
    },
    {
      id: 2,
      title: 'Acadêmico',
      icon: 'school-outline',
      screen: 'Academic',
    },
    {
      id: 3,
      title: 'Biblioteca',
      icon: 'library-outline',
      screen: null, // Ainda não implementado
    },
    {
      id: 4,
      title: 'Eventos',
      icon: 'calendar-outline',
      screen: 'Calendar',
    },
    {
      id: 5,
      title: 'Configurações',
      icon: 'settings-outline',
      screen: 'Settings',
    },
  ];

  const handleMenuItemPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
      onClose();
    } else {
      // Para itens ainda não implementados
      console.log(`${item.title} ainda não implementado`);
      onClose();
    }
  };

  if (!isVisible && slideAnim._value === -screenWidth * 0.8) {
    return null;
  }

  return (
    <View style={[styles.container, { pointerEvents: isVisible ? 'auto' : 'none' }]}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        <TouchableOpacity style={styles.backDropTouchable} onPress={onClose} />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.sidebarContent}>
          {/* Header da Sidebar */}
          <SafeAreaView style={styles.sidebarHeader} edges={['top']}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/logo_branca.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.9)" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Seção de Perfil do Usuário */}
          <View style={styles.userProfileSection}>
            <View style={styles.userPhotoContainer}>
              <View style={styles.userPhotoBorder}>
                <Image
                  source={{ uri: 'https://avatars.githubusercontent.com/u/176968157?v=4' }}
                  style={styles.userPhoto}
                  resizeMode="cover"
                />
              </View>
            </View>
            <Text style={styles.userName}>GIORDANO BRUNO BIASI BERWIG</Text>
            <Text style={styles.userLogin}>@giordano.berwig</Text>
            <View style={styles.profileDivider} />
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item)}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color="rgba(255, 255, 255, 0.9)"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <SafeAreaView style={styles.footer} edges={['bottom']}>
            <View style={styles.footerContent}>
              <Text style={styles.footerText}>Versão 1.0.0</Text>
              <Text style={styles.footerSubtext}>UNIJUÍ Mobile App</Text>
            </View>
          </SafeAreaView>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backDropTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarHeader: {
    backgroundColor: '#01458E',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logo: {
    width: 150,
    height: 50,
  },
  closeButton: {
    padding: 8,
    borderRadius: 6,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userProfileSection: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#01458E',
  },
  userPhotoContainer: {
    marginBottom: 15,
  },
  userPhotoBorder: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  userLogin: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  profileDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 20,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#01458E',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  menuIcon: {
    marginRight: 16,
    width: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
    letterSpacing: 0.2,
    flex: 1,
  },
  footer: {
    backgroundColor: '#01458E',
    paddingHorizontal: 20,
  },
  footerContent: {
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '400',
  },
});

export default Sidebar;
