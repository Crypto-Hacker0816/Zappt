import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { DataState } from '../context/Provider';
import { isEmpty } from '../utils/util';
import MMarker from './MMarker';
import MButton from './MButton';
import MButtonGroup from './MButtonGroup';
import { deg2rad, rad2deg } from '../utils/util';

export default function MMap(props) {
  const { mapFormData, setMapFormData } = DataState();
  const [center, setCenter] = useState({
    latitude: 39.7536237361807,
    longitude: -104.97601230939361,
    latitudeDelta: 0.1,
    longitudeDelta: 0.04,
  });
  useEffect(() => {
    if (!isEmpty(props.region) && !isEmpty(props.location)) {
      setCenter(props.region);
      // setNewPosition(props.location);
    }
  }, [props.region, props.location]);
  const handleMapClick = event => {
    const newMarker = {
      geometry: {
        location: {
          lat: event.nativeEvent.coordinate.latitude,
          lng: event.nativeEvent.coordinate.longitude,
        },
      },
    };
    setNewPosition(newMarker);
  };
  const handleRemoveMarker = info => {
    const currentMarkers = mapFormData?.markers || [];
    let newMarkers = currentMarkers.filter(
      marker =>
        marker.geometry.location.lat !== info.geometry.location.lat ||
        marker.geometry.location.lng !== info.geometry.location.lng,
    );
    setMapFormData({ ...mapFormData, markers: newMarkers });
  };
  const setNewPosition = marker => {
    const currentMarkers = mapFormData?.markers || [];
    let newData = {};
    newData.markers = currentMarkers.filter(
      mk =>
        mk.geometry.location.lat !== marker.geometry.location.lat ||
        mk.geometry.location.lng !== marker.geometry.location.lng,
    );
    if (props.distance) {
      newData.distance = props.distance;
    } else {
      newData.distance = 500;
    }
    newData.markers = [...newData.markers, marker];
    setMapFormData(newData);
  };

  const handlePickCurrentLocation = () => {
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
      setMapFormData({
        distance: mapFormData.distance || 300,
        markers: [curMarker],
      });
    });
  };

  const handleRemoveAll = () => {
    setMapFormData({});
  };

  const renderOperationGroup = () => {
    return (
      <>
        <View style={{ flexDirection: 'row', padding: 5 }}>
          <MButton
            style={{ margin: 5 }}
            mode="outlined"
            onPress={handlePickCurrentLocation}>
            Current Position
          </MButton>
          <MButton
            style={{ margin: 5 }}
            mode="outlined"
            onPress={handleRemoveAll}>
            Remove All
          </MButton>
        </View>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <MButtonGroup
            listItems={[500, 1500, 2500, 3500, 5000]}
            formData={mapFormData}
            setFormData={setMapFormData}
            attribute={'distance'}
            isEdit={true}
            isMultiSelect={false}
            disabled={false}
            activeVariant="outline-light"
            size="sm"
          />
        </View>
      </>
    );
  };

  return (
    <View style={styles.mapStyle}>
      {!props.isDrinkNearModel && renderOperationGroup()}
      <MapView
        provider={PROVIDER_GOOGLE}
        region={center}
        style={styles.mapViewContainer}
        onPress={handleMapClick}
        showsUserLocation={true}>
        {mapFormData?.markers?.map((info, index) => (
          <MMarker
            info={info}
            key={index}
            setCurOpened={data => handleRemoveMarker(data)}
            icon="arrow"
            hideInfoWindow={true}
            distance={mapFormData.distance}
            withDistance
          />
        ))}
      </MapView>
    </View>
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
    width: '100%',
    height: '100%',
  },
});
