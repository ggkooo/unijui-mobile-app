import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, ImageSlider, WeeklyCalendar, Sidebar } from '../components';

const HomeScreen = ({ navigation }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleMenuPress = () => {
    setIsSidebarVisible(true);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
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
    backgroundColor: '#f5f5f5',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});

export default HomeScreen;
