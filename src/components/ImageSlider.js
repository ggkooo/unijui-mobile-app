import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const sliderData = [
    {
      id: 1,
      image: require('../../assets/banner-01.jpg'),
    },
    {
      id: 2,
      image: require('../../assets/banner-02.jpg'),
    },
    {
      id: 3,
      image: require('../../assets/banner-03.jpg'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sliderData.length;
      setCurrentIndex(nextIndex);

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {sliderData.map((item) => (
          <View key={item.id} style={styles.slide}>
            <Image source={item.image} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {sliderData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: screenWidth,
  },

  scrollView: {
    height: 100,
  },

  slide: {
    width: screenWidth,
    height: 100,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  pagination: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },

  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default ImageSlider;
