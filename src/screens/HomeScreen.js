import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Header, ImageSlider, WeeklyCalendar } from '../components';

const HomeScreen = ({ navigation }) => {
  const handleMenuPress = () => {
    Alert.alert('Menu', 'Menu hambúrguer pressionado!');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Início"
        leftIcon="menu"
        onLeftPress={handleMenuPress}
        showLeftIcon={true}
        showRightIcon={false}
      />
      <ImageSlider />
      <View style={styles.content}>
        <WeeklyCalendar navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});

export default HomeScreen;
