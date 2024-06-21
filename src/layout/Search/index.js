import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { listSearch } from '../../utils/api';
import { AuthState, DataState } from '../../context/Provider';
import { filteredLocations, isEmpty } from '../../utils/util';
import notify from '../../utils/notify';
import gaEvents from '../../utils/gaEvents';
import useDebounce from '../../utils/hooks';
import MCardView from '../../components/MCardView';

export default function Search() {
  const navigation = useNavigation(false);
  const route = useRoute();
  const {
    setTableData,
    tableData,
    // mostFavoriteLocations,
    setMostFavoriteLocations,
    formData,
    setFormData,
    excFormData,
    setExcFormData,
    mapFormData,
    setMapFormData,
  } = DataState();
  const isMounted = useRef(false);
  const { auth } = AuthState();
  const { isAuthenticated } = auth || {};
  const [isSeeMore, setIsSeeMore] = useState(false);

  const handleClearAndSearch = () => {
    setFormData({});
    setExcFormData({});
    setMapFormData({});
  };

  const handleSearch = () => {
    setTableData([]);
    setMostFavoriteLocations([]);
    const abortController = new AbortController();
    listSearch(
      { criteria: formData, excCriteria: excFormData, map: mapFormData },
      abortController.signal,
    )
      .then(data => {
        setTableData(data?.relevantData);
        setMostFavoriteLocations(data?.mostFavoriteLocations);
        if (isEmpty(data.relevantData)) {
          notify('No locations in your search', 'warn');
        }
        gaEvents.eventLocationSearch();
      })
      .catch('null');
  };
  const debouncedHandleSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    if (isMounted.current) {
      debouncedHandleSearch();
    }
    // eslint-disable-next-line
  }, [formData, excFormData]);

  const locations = filteredLocations(tableData, mapFormData);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.featured}>Search</Text> Result
      </Text>
      {/* <View style={styles.filter}>
        <MButton
          style={{ color: '#1da1f2' }}
          mode="text"
          onPress={() => handleClearAndSearch()}>
          Clear All
        </MButton>
        <MButton
          mode="contained"
          icon="map-marker-outline"
          onPress={() => navigation.navigate('map')}>
          See Map
        </MButton>
      </View> */}
      {tableData.length > 0 ? (
        <View>
          {tableData
            // .slice(0, Math.min(6, locations.length))
            .map((item, index) => (
              <MCardView
                key={index}
                info={item}
                withDesc={true}
                withRate={true}
                navigation={navigation}
                route={route}
              />
            ))}
        </View>
      ) : (
        <>
          <Text
            style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
            No locations in your search
          </Text>
        </>
      )}

      {/* {locations.length > 5 && (
        <>
      <View style={[s.mh15]}>
        <MButton onPress={() => setIsSeeMore(true)}>See More</MButton>
      </View>
      {isSeeMore && (
        <>
          {locations.slice(6).map((item, index) => (
            <MCardView
              key={index}
              info={item}
              withDesc={true}
              withRate={true}
              navigation={navigation}
              route={route}
            />
          ))}
        </>
      )}
      </>
      )} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    marginVertical: 10,
    color: '#1c1c1f',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft : 20
  },
  featured: {
    color: '#1da1f2',
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
});
