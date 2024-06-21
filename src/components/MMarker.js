import React, { useRef } from 'react';
import { Marker, Circle, Callout } from 'react-native-maps';
import { Card, Icon, IconButton, Text, useTheme } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Svg, Image as ImageSvg } from 'react-native-svg';
import { getImageURL } from '../utils/api';
import images from '../assets/images';

export default function MMarker({
  info,
  setCurOpened = () => {},
  distance,
  withDistance = false,
  color = '#ff3333',
  hideInfoWindow = false,
  navigation,
  route,
}) {
  const markerRef = useRef(null);
  return (
    <>
      <Marker
        coordinate={{
          latitude: info?.geometry?.location?.lat,
          longitude: info?.geometry?.location?.lng,
        }}
        key={info?.id}
        ref={markerRef}
        onPress={() => {
          setCurOpened(info);
          if (!hideInfoWindow) {
            setTimeout(() => {
              if (markerRef.current) {
                markerRef.current.hideCallout();
                markerRef.current.showCallout();
              }
            }, 200);
          }
        }}>
        <Icon source="map-marker" color={color} size={20} />
        {!hideInfoWindow && (
          <Callout
            tooltip
            style={styles.infoWindow}
            onPress={() =>
              navigation.navigate('location', {
                id: info.id,
                prev_page: { name: route.name, title: route.params?.title },
              })
            }>
            <View style={styles.infoWindow}>
              <CardInfoWindow info={info} />
            </View>
          </Callout>
        )}
      </Marker>
      {withDistance && parseInt(distance, 10) > 0 && (
        <Circle
          center={{
            latitude: info?.geometry?.location?.lat,
            longitude: info?.geometry?.location?.lng,
          }}
          radius={distance / 3.281}
          fillColor="#ff333377"
          strokeColor="#0000"
        />
      )}
    </>
  );
}

const CardInfoWindow = ({ info }) => {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.imageWrapper}>
        <Svg width={Dimensions.get('window').width * 0.7} height={120}>
          <ImageSvg
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            href={getImageURL(info.photo) || images.icon}
          />
        </Svg>
      </View>
      <View style={styles.body}>
        <View style={styles.title}>
          <Text numberOfLines={1} variant="titleMedium">
            {info.name}
          </Text>
          <Text numberOfLines={1} variant="bodyMedium">
            {info.address}
          </Text>
        </View>
        <IconButton
          style={styles.bodyIconButton}
          icon="chevron-double-right"
          mode="contained"
          background={theme.colors.secondary}
          iconColor={theme.colors.secondary}
          size={10}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  infoWindow: {
    flex: 1,
    width: Dimensions.get('window').width * 0.8,
  },
  card: {
    margin: 15,
    padding: 15,
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    padding: 10,
    borderRadius: 10,
    height: 150,
  },
  favoriteIconButton: {
    borderRadius: 5,
    backgroundColor: 'white',
    position: 'absolute',
    left: 5,
    top: 5,
    zIndex: 1,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  bodyIconButton: {
    borderRadius: 5,
  },
  title: {
    flexShrink: 1,
    paddingRight: 10,
  },
});
