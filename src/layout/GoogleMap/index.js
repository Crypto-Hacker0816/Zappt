import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, LogBox, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { DataState } from '../../context/Provider';
import MMarker from '../../components/MMarker';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  feetToLatitudeDegrees,
  feetToLongitudeDegrees,
  filteredLocations,
  isEmpty,
} from '../../utils/util';
import { Slider } from '@rneui/themed';
import Toggle from 'react-native-toggle-element';
import { Text, useTheme } from 'react-native-paper';
import Search from '../Search';

export default function GoogleMap(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const { tableData, mapFormData, setMapFormData } = DataState();
  const mapRef = useRef(null);
  const [curOpened, setCurOpened] = React.useState(null);
  const [isShowAll, setIsShowAll] = React.useState(true);
  const [region, setRegion] = useState({});
  const [switchOn, setSwitchOn] = useState(false);

  LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);

  useEffect(() => {
    if (!mapFormData?.markers || mapFormData.markers.length === 0) {
      return;
    }

    let bounds = {
      north: -90,
      south: 90,
      east: -180,
      west: 180,
    };

    // Calculate bounds based on markers.
    mapFormData.markers.forEach(marker => {
      bounds = {
        north: Math.max(bounds.north, marker.geometry.location.lat),
        south: Math.min(bounds.south, marker.geometry.location.lat),
        east: Math.max(bounds.east, marker.geometry.location.lng),
        west: Math.min(bounds.west, marker.geometry.location.lng),
      };
    });

    const newLatitude = (bounds.north + bounds.south) / 2;
    const newLongitude = (bounds.east + bounds.west) / 2;

    // Assuming mapFormData.distance is the required padding in feet.
    const latitudeDelta =
      bounds.north -
      bounds.south +
      feetToLatitudeDegrees(mapFormData.distance) * 2;
    const longitudeDelta =
      bounds.east -
      bounds.west +
      feetToLongitudeDegrees(mapFormData.distance, newLatitude) * 2;

    setRegion({
      latitude: newLatitude,
      longitude: newLongitude,
      latitudeDelta,
      longitudeDelta,
    });

    if (mapFormData.markers.length === 1 && mapRef?.current?.setCamera) {
      mapRef.current.setCamera({
        center: { latitude: newLatitude, longitude: newLongitude },
        zoom: 13,
      });
    }
  }, [tableData]);

  const locations = filteredLocations(tableData, mapFormData);
  const dataLength = isShowAll ? locations.length : 5;
  const hideFavoriteInfoWindow =
    locations.findIndex(item => item.id === curOpened?.id) >= 0;

  return (
    <>
      <View style={styles.mapStyle}>
        <View style={styles.toggleSwitchPart}>
          <View style={styles.roundedRectangle}></View>
          <Toggle
            value={switchOn}
            onPress={newState => setSwitchOn(newState)}
            trackBar={{
              width: 240,
              height: 50,
              radius: 30,
            }}
            trackBarStyle={{
              backgroundColor: '#ffffff',
            }}
            thumbButton={{
              width: 110,
              height: 46,
              radius: 40,
            }}
            thumbStyle={{
              backgroundColor: '#1DA1F2',
            }}
            leftComponent={<Text style={{ fontSize: 20 }}>Map</Text>}
            rightComponent={<Text style={{ fontSize: 20 }}>List</Text>}
          />
        </View>
        {!switchOn ? (
          <View style={styles.mapViewContainer}>
            <MapView
              region={
                !isEmpty(region)
                  ? region
                  : {
                      latitude: 39.71690526101713,
                      latitudeDelta: 0.1,
                      longitude: -104.9317497946322,
                      longitudeDelta: 0.04,
                    }
              }
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              style={styles.mapViewContainer}>
              {locations.slice(0, dataLength).map((info, index) => (
                <MMarker
                  info={info}
                  key={info?.id}
                  icon={index > 4 ? 'circle' : ''}
                  curOpened={curOpened}
                  setCurOpened={setCurOpened}
                  navigation={navigation}
                  route={route}
                />
              ))}
              {/* {isShowFavorite &&
            mostFavoriteLocations.map(info => (
              <MMarker
                info={info}
                key={info?.id}
                icon="star"
                hideInfoWindow={hideFavoriteInfoWindow}
                curOpened={curOpened}
                setCurOpened={setCurOpened}
              />
            ))} */}
              {mapFormData?.markers?.map((info, index) => (
                <MMarker
                  info={info}
                  key={index}
                  color="blue"
                  hideInfoWindow={true}
                  distance={mapFormData.distance}
                  withDistance
                />
              ))}
            </MapView>
            <View style={styles.verticalContent}>
              <Slider
                value={mapFormData.distance}
                maximumValue={5000}
                minimumValue={100}
                step={100}
                orientation="vertical"
                onValueChange={e =>
                  setMapFormData({ ...mapFormData, distance: e })
                }
                thumbStyle={{
                  height: 20,
                  width: 20,
                  backgroundColor: 'transparent',
                }}
                minimumTrackTintColor="#1DA1F2"
                maximumTrackTintColor="gray"
                trackStyle={{
                  width: 10,
                  borderRadius: 5,
                }}
                thumbProps={{
                  children: (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 9999,
                        borderWidth: 2,
                        backgroundColor: 'white',
                        borderColor: '#1DA1F2',
                      }}
                    />
                  ),
                }}
              />
            </View>
          </View>
        ) : (
          <View>
            <Search />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    backgroundColor: 'white',
  },
  mapStyle: {
    height: '100%',
  },
  mapViewContainer: {
    width: '93%',
    paddingLeft: 10,
    height: '88%',
    flexDirection: 'row',
    marginTop: '5%',
  },
  toggleSwitchPart: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? '15%': '10%',
  },
  roundedRectangle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 40,
    zIndex: -1,
    borderColor: '#1DA1F2',
    borderWidth: 3,
    width: 250,
    height: 56,
  },
  verticalContent: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    height: '95%',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginLeft: 10,
  },
});
