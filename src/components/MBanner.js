import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { isEmpty } from '../utils/util';
import images from '../assets/images';
import { Icon } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function MBanner({ title, signed = false }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { prev_page } = route.params;
  const nav_info = isEmpty(prev_page)
    ? { name: 'dashboard', title: 'Home' }
    : prev_page;

  return (
    <View
      style={
        signed
          ? [styles.bannerWrapper, styles.withSpacing]
          : styles.bannerWrapper
      }>
      <Image
        source={images.banner_left}
        style={[styles.image, styles.left_image]}
      />
      <Text style={styles.bannerText}>{title}</Text>
      <View style={styles.breadcrumbContainer}>
        <Text
          style={styles.home}
          onPress={() => navigation.navigate(nav_info.name)}>
          {nav_info.title}
        </Text>
        <Icon source="chevron-double-right" color="white" size={16} />
        <Text style={styles.link}>{title}</Text>
      </View>
      <Image
        source={images.banner_right}
        style={[styles.image, styles.right_image]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    backgroundColor: '#1da1f2',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withSpacing: {
    margin: 15,
    borderRadius: 15,
  },
  bannerText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    gap: 4,
    bottom: 16,
  },
  home: {
    color: '#fff',
    fontSize: 16,
    margin: 0,
  },
  link: {
    color: '#fff',
    opacity: 0.74,
    margin: 0,
    fontSize: 16,
  },
  image: {
    maxWidth: Dimensions.get('window').width,
    height: '100%',
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  left_image: {
    left: 0,
  },
  right_image: {
    left: 0,
  },
});
