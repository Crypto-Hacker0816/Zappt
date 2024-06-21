import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Modal, Portal, Text, useTheme } from 'react-native-paper';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MMap from './MMap';
import MButton from './MButton';
import { DataState } from '../context/Provider';
import { nearDrinks } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import { deg2rad, isEmpty, rad2deg } from '../utils/util';
import notify from '../utils/notify';
import gaEvents from '../utils/gaEvents';

export default function MDrinksNearMe(props) {
  const navigation = useNavigation();
  const theme = useTheme();
  const {
    setTableData,
    setMostFavoriteLocations,
    setFormData,
    setExcFormData,
    mapFormData,
    setMapFormData,
    loading,
    setLoading,
  } = DataState();

  const [isShowMap, setIsShowMap] = useState(false);
  const [center, setCenter] = useState({
    lat: 39.7536237361807,
    lng: -104.97601230939361,
  });
  const [location, setLocation] = useState({});

  useEffect(() => {
    if (props.visible) {
      Geolocation.getCurrentPosition(position => {
        const radiusInKM = 10; // Replace with your radius

        const earthRadiusInKM = 6371;
        const radiusInRad = radiusInKM / earthRadiusInKM;
        const aspectRatio =
          Dimensions.get('window').width / Dimensions.get('window').height;

        const longitudeDelta = rad2deg(
          radiusInRad / Math.cos(deg2rad(position.coords.latitude)),
        );
        const latitudeDelta = aspectRatio * rad2deg(radiusInRad);
        const curPosition = {
          geometry: {
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta,
            },
          },
        };
        const curMarker = {
          geometry: {
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
        };
        setCenter(curPosition.geometry.location);
        setLocation(curMarker);
        setMapFormData({
          distance: mapFormData.distance || 300,
          markers: [curMarker],
        });
        setTableData([]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

  const handleSubmit = () => {
    setFormData({});
    setExcFormData({});
    setTableData([]);
    setMostFavoriteLocations([]);
    setLoading(true);
    const abortController = new AbortController();
    nearDrinks({ ...mapFormData, distance: 5000 }, abortController.signal)
      .then(data => {
        props.onDismiss();
        setTableData(data?.relevantData);
        setMostFavoriteLocations(data?.mostFavoriteLocations);
        if (isEmpty(data.relevantData)) {
          notify('No locations in your search', 'warn');
        }
        setLoading(false);
        navigation.navigate('Drinks near me');
        gaEvents.eventLocationSearch();
      })
      .catch('null');
  };

  return (
    <View>
      <Portal>
        <Modal
          visible={props.visible}
          onDismiss={props.onDismiss}
          style={styles.modal}>
          <View
            style={{
              backgroundColor: 'white',
            }}>
            <View style={styles.modalHeader}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                Select Range
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              <View>
                <View style={{ padding: 10 }}>
                  <Text>Distance: {mapFormData?.distance} feet</Text>
                </View>
                <Slider
                  thumbTintColor={theme.colors.primary}
                  minimumTrackTintColor={theme.colors.primary}
                  style={{ width: '100%', height: 5, marginBottom: 15 }}
                  value={mapFormData.distance || 0}
                  onValueChange={e =>
                    setMapFormData({ ...mapFormData, distance: e })
                  }
                  minimumValue={100}
                  maximumValue={5000}
                  step={100}
                />
              </View>
              <View>
                <TouchableOpacity onPress={() => setIsShowMap(true)}>
                  <Text
                    style={{
                      color: '#1da1f2',
                      textDecorationLine: 'underline',
                    }}>
                    Use a different location?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {isShowMap ? (
              <View style={{ height: '65%' }}>
                <MMap
                  provider={PROVIDER_GOOGLE}
                  style={styles.mapViewContainer}
                  region={center}
                  location={location}
                  distance={mapFormData.distance}
                  isDrinkNearModel={true}
                />
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: 10,
              }}>
              <MButton mode="outlined" onPress={props.onDismiss}>
                Cancel
              </MButton>
              <View style={{ margin: 10 }} />
              <MButton
                buttonColor="#1da1f2"
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={handleSubmit}>
                Search
              </MButton>
              <View style={{ marginLeft: 5 }} />
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    flex: 0,
    alignSelf: 'stretch',
  },
  mapViewContainer: {
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
});
