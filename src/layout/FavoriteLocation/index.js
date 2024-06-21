import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MBanner from '../../components/MBanner';
import { getRecommendations } from '../../utils/api';
import { AuthState, DataState } from '../../context/Provider';
import { isEmpty } from '../../utils/util';
import MCardView from '../../components/MCardView';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function FavoriteLocation() {
  const navigation = useNavigation();
  const route = useRoute();
  const { auth } = AuthState();
  const { isAuthenticated, favoriteLocations } = auth || {};
  const [suggestions, setSuggestions] = useState({});

  const fetchData = useCallback(async () => {
    const data = await getRecommendations();
    setSuggestions(data);
  }, []);

  useEffect(() => {
    if (!isEmpty(auth) && !isAuthenticated) {
      fetchData();
    }

    // eslint-disable-next-line
  }, []);

  return (
    <ScrollView>
      <MBanner title="Favorite Location" signed={isAuthenticated} />
      <Text
        style={
          isAuthenticated ? [styles.title, styles.signedMargin] : styles.title
        }>
        Favorite <Text style={styles.featured}>Location</Text>
      </Text>
      <Text style={styles.subTitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempor non
        augue nec pulvinar.
      </Text>
      {!isEmpty(suggestions?.favoriteLocations) && (
        <View>
          {suggestions?.favoriteLocations?.map((info, index) => {
            if (
              !isEmpty(favoriteLocations) &&
              favoriteLocations?.includes(info.id)
            ) {
              return (
                <MCardView
                  key={index}
                  info={info}
                  navigation={navigation}
                  route={route}
                />
              );
            }
            return null;
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 50,
    color: '#1c1c1f',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  signedMargin: {
    marginTop: 0,
  },
  featured: {
    color: '#1da1f2',
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#5b5b63',
    fontWeight: '400',
    marginBottom: 16,
    textAlign: 'center',
  },
});
