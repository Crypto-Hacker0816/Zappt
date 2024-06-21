import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import MMap from './MMap';
import MButton from './MButton';
import { DataState } from '../context/Provider';
import { deg2rad, rad2deg } from '../utils/util';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from '../utils/util';
import notify from '../utils/notify';
import { listSearch } from '../utils/api';
import gaEvents from '../utils/gaEvents';
import MLocationSuggest from './MLocationSuggest';
import MSearchGroup from './MSearchGroup';
import image from '../assets/images';

export default function MSearchModal(props) {
  const navigation = useNavigation();
  const {
    setTableData,
    setMostFavoriteLocations,
    setFormData,
    setExcFormData,
    mapFormData,
    setMapFormData,
    loading,
    setLoading,
    formData,
    excFormData,
    dropDownState,
    setDropdownState,
  } = DataState();

  const [curState, setCurState] = useState('map');
  const [criteriaState, setCriteriaState] = useState('inclusion');
  const [curSuggestion, setCurSuggestion] = useState(null);
  const [centerLocation, setCenterLocation] = useState({});
  const [location, setLocation] = useState({});
  const handleSubmit = () => {
    setTableData([]);
    setLoading(true);
    setMostFavoriteLocations([]);
    const abortController = new AbortController();
    listSearch(
      {
        criteria: formData,
        excCriteria: excFormData,
        map: mapFormData,
      },
      abortController.signal,
    )
      .then(data => {
        setTableData(data?.relevantData);
        setMostFavoriteLocations(data?.mostFavoriteLocations);
        if (isEmpty(data.relevantData))
          notify('No locations in your search', 'warn');
        setLoading(false);
        props.onDismiss();
        navigation.navigate('search');
        gaEvents.eventLocationSearch();
      })
      .catch('null');
    // // setFormData({});
    // setExcFormData({});
    // setTableData([]);
    // setMostFavoriteLocations([]);
    // setLoading(true);
    // const abortController = new AbortController();

    // nearDrinks({ ...mapFormData, distance: 5000 }, abortController.signal)
    //   .then(data => {
    //     navigation.navigate('Drinks near me');
    //     props.onDismiss();
    //     setTableData(data?.relevantData);
    //     setMostFavoriteLocations(data?.mostFavoriteLocations);
    //     if (isEmpty(data.relevantData)) {
    //       notify('No locations in your search', 'warn');
    //     }
    //     setLoading(false);
    //     gaEvents.eventLocationSearch();
    //   })
    //   .catch('null');
  };

  const handleSuggestionChange = newSuggestion => {
    const radiusInKM = 10; // Replace with your radius

    const earthRadiusInKM = 6371;
    const radiusInRad = radiusInKM / earthRadiusInKM;
    const aspectRatio =
      Dimensions.get('window').width / Dimensions.get('window').height;

    const longitudeDelta = rad2deg(
      radiusInRad / Math.cos(deg2rad(newSuggestion?.geometry.location.lat)),
    );
    const latitudeDelta = aspectRatio * rad2deg(radiusInRad);
    const curPosition = {
      geometry: {
        location: {
          latitude: newSuggestion?.geometry.location.lat,
          longitude: newSuggestion?.geometry.location.lng,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        },
      },
    };
    const curMarker = {
      geometry: {
        location: {
          lat: newSuggestion?.geometry.location.lat,
          lng: newSuggestion?.geometry.location.lng,
        },
      },
    };
    setMapFormData({
      distance: mapFormData.distance || 300,
      markers: [curMarker],
    });
    setCenterLocation(curPosition.geometry.location);
    setLocation(curMarker);
  };
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = event => {
    const { contentOffset } = event.nativeEvent;
    const { layoutMeasurement, contentSize } = event.nativeEvent;
    const maxScrollY = contentSize.height - layoutMeasurement.height;
    console.log(maxScrollY, contentSize.height);
    setIsScrolling(contentOffset.y <= 0 || contentOffset.y >= maxScrollY);
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
              paddingTop: 20,
              backgroundColor: 'white',
            }}>
            <View style={styles.modalHeader}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                Apply Filter
              </Text>
            </View>
            <ScrollView
              style={{ height: '85%' }}
              scrollEnabled={dropDownState ? false : true}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                    alignItems: 'center',
                  }}>
                  <MButton
                    mode={curState === 'map' ? 'contained' : 'outlined'}
                    onPress={() => setCurState('map')}>
                    Location
                  </MButton>
                  <Pressable>
                    <Text
                      style={{ color: '#1da1f2', marginHorizontal: 10 }}
                      onPress={() => setFormData({})}>
                      Clear
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  <MButton
                    mode={curState === 'type' ? 'contained' : 'outlined'}
                    onPress={() => setCurState('type')}>
                    Type
                  </MButton>
                  <MButton
                    mode={curState === 'vibe' ? 'contained' : 'outlined'}
                    onPress={() => setCurState('vibe')}>
                    Vibe
                  </MButton>
                  <MButton
                    mode={curState === 'drinks' ? 'contained' : 'outlined'}
                    onPress={() => setCurState('drinks')}>
                    Drinks
                  </MButton>
                  <MButton
                    mode={curState === 'food' ? 'contained' : 'outlined'}
                    onPress={() => setCurState('food')}>
                    Food
                  </MButton>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  <MButton
                    mode="outlined"
                    textColor={
                      criteriaState === 'inclusion' ? '#1da1f2' : 'black'
                    }
                    onPress={() => setCriteriaState('inclusion')}>
                    Inclusion Criteria
                  </MButton>
                  <MButton
                    mode="outlined"
                    textColor={
                      criteriaState === 'exclusion' ? '#1da1f2' : 'black'
                    }
                    onPress={() => setCriteriaState('exclusion')}>
                    Exclusion Criteria
                  </MButton>
                </View>
              </View>
              {curState === 'map' ? (
                <View>
                  <MLocationSuggest
                    value={curSuggestion}
                    onChange={handleSuggestionChange}
                  />
                  <View
                    style={{
                      height: (Dimensions.get('window').height * 2) / 3,
                    }}>
                    <MMap
                      region={centerLocation}
                      location={location}
                      provider={PROVIDER_GOOGLE}
                      style={styles.mapViewContainer}
                      distance={mapFormData.distance}
                    />
                  </View>
                </View>
              ) : (
                <ScrollView>
                  <ImageBackground
                    source={image.filter_background}
                    resizeMode="cover"
                    style={{
                      flex: 1,
                      width: '100%',
                    }}>
                    <View
                      style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: 'rgba(10,10,10, 0.5)',
                      }}
                    />
                    <MSearchGroup
                      curState={curState}
                      formData={
                        criteriaState === 'inclusion' ? formData : excFormData
                      }
                      dropDownState={dropDownState}
                      setDropdownState={setDropdownState}
                      setFormData={
                        criteriaState === 'inclusion'
                          ? setFormData
                          : setExcFormData
                      }
                    />
                  </ImageBackground>
                </ScrollView>
              )}
            </ScrollView>
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
    height: '80%',
    backgroundColor: 'white',
    top: '10%',
  },
  mapViewContainer: {
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
});
