import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform, Pressable } from 'react-native';
import { IconButton, useTheme, Avatar, Icon } from 'react-native-paper';
import { DrawerActions } from '@react-navigation/native';
import MReviewModal from './MReviewModal';
import { AuthState } from '../context/Provider';
import { getRatingDataByUserID } from '../utils/api';
import s from '../utils/styles';
import { isEmpty } from '../utils/util';

export default function MHeader(props) {
  const theme = useTheme();
  const { auth } = AuthState();
  const { isAuthenticated } = auth || {};
  const [filterData, setFilterData] = useState([]);
  const [suggestionRating, setSuggestionRating] = useState({});
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      getRatingDataByUserID().then(response => {
        setSuggestionRating(response.suggestionRating);
        setFilterData(response.locations);
        setLoadingState(false);
      });
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.shadow}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Explore The Beautiful world</Text>
          {isAuthenticated ? (
            <Pressable
              onPress={() =>
                props.navigation.navigate('auth', { id: auth.id })
              }>
              <View
                style={
                  (s.align_center,
                  { marginTop: 10, flexDirection: 'row', alignItems: 'center' })
                }>
                {isEmpty(auth.avatar) ? (
                  <Avatar.Icon
                    style={styles.avatarBG}
                    color="white"
                    size={45}
                    icon="account"
                  />
                ) : (
                  <Avatar.Image size={45} source={{ uri: auth.avatar }} />
                )}
                <Text
                  style={
                    (s.ml5,
                    {
                      fontSize: 16,
                      fontWeight: 400,
                      color: '#1C1C1F',
                      marginLeft: 10,
                    })
                  }>
                  {`${auth?.firstName ? auth.firstName : ''} ${
                    auth?.lastName ? auth.lastName : ''
                  } `}
                </Text>
              </View>
            </Pressable>
          ) : (
            ''
          )}
        </View>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            style={{ borderRadius: 10 }}
            icon="menu"
            iconColor="white"
            containerColor={theme.colors.primary}
            size={20}
            onPress={() =>
              props.navigation.dispatch(DrawerActions.openDrawer())
            }
          />
        </View>
      </View>
      <MReviewModal
        filterData={filterData}
        suggestionRating={suggestionRating}
        setSuggestionRating={setSuggestionRating}
        setFilterData={setFilterData}
        loading={loadingState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    //    borderRadius: 0,
    backgroundColor: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 30 : 10,
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 59,
  },
  headerText: {
    paddingTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1DA1F2',
  },
});
