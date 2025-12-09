import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({
  title = "Início",
  leftIcon = "menu",
  rightIcon = null,
  onLeftPress = () => {},
  onRightPress = () => {},
  showLeftIcon = true,
  showRightIcon = false
}) => {
  return (
    <>
      <StatusBar style="light" backgroundColor="#01458E" translucent={false} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          {showLeftIcon ? (
            <TouchableOpacity
              style={leftIcon === "menu" ? styles.menuButton : styles.iconButton}
              onPress={onLeftPress}
            >
              {leftIcon === "menu" ? (
                <>
                  <View style={styles.hamburgerLine} />
                  <View style={styles.hamburgerLine} />
                  <View style={styles.hamburgerLine} />
                </>
              ) : (
                <MaterialIcons name={leftIcon} size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}

          <Text style={styles.title}>{title}</Text>

          {showRightIcon && rightIcon ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
            >
              <MaterialIcons name={rightIcon} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#01458E',
  },

  header: {
    backgroundColor: '#01458E',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  menuButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  iconButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  hamburgerLine: {
    width: 25,
    height: 3,
    backgroundColor: '#FFFFFF',
    marginVertical: 2,
    borderRadius: 1,
  },

  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '400',
    textAlign: 'center',
    flex: 1,
  },

  placeholder: {
    width: 30,
  },
});

export default Header;
