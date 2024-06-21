import { View, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';
import images from '../assets/images';
import { AuthState } from '../context/Provider';
import { isEmpty } from '../utils/util';
import notify from '../utils/notify';
import {
  getImageURL,
  setFavoriteLocation,
  setViewedLocation,
} from '../utils/api';

export default function MCardView({
  info,
  withDesc = false,
  withRate = false,
  isSelected = false,
  isShowReviewModal,
  onPress,
  navigation,
  route,
}) {
  const theme = useTheme();
  const { auth, setAuth } = AuthState();
  const { favoriteLocations } = auth || {};

  const handleToggleFavorite = async id => {
    if (isEmpty(auth) || !auth.isAuthenticated) {
      return navigation.navigate('signIn');
    }
    const { data } = await setFavoriteLocation({ id });
    const isAdded = favoriteLocations?.includes(id);
    setAuth({ ...auth, favoriteLocations: data });
    notify(`${isAdded ? 'Remove' : 'Add'} Favorite Success`, 'success');
  };

  const handleSetViewedLocation = id => {
    if (!isEmpty(auth) && auth.isAuthenticated) {
      setViewedLocation({ id });
    }
  };

  const handlePressCard = () => {
    handleSetViewedLocation(info.id);
    if (!isShowReviewModal) {
      navigation.navigate('location', {
        id: info.id,
        prev_page: { name: route.name, title: route.params?.title },
      });
    }
  };

  const isFavoriteLocation =
    !isEmpty(favoriteLocations) && favoriteLocations?.includes(info.id);

  return (
    <Card
      style={{
        ...styles.card,
        backgroundColor: isSelected ? '#e6f0ff' : 'white',
      }}
      onPress={onPress ? onPress : handlePressCard}>
      <View style={styles.imageWrapper}>
        <ImageBackground
          style={styles.image}
          source={getImageURL(info.photo) || images.icon}>
        </ImageBackground>
      </View>
      <View style={styles.body}>
        <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center',}}>
          <Text numberOfLines={1} style={styles.title}>
            {info.name}
          </Text>
          <IconButton
            style={styles.favoriteIconButton}
            icon={isFavoriteLocation ? 'heart' : 'heart-outline'}
            iconColor={
            isFavoriteLocation ? theme.colors.error : theme.colors.secondary
            }
            mode="outlined"
            size={12}
            onPress={() => handleToggleFavorite(info.id)}
        />
        </View>
        <View style={{marginTop : -10}}>
        <Text style={styles.address}>
            {info.address}
        </Text>

        </View>
        
      </View>
      {withDesc && (
        <>
          <Text variant="bodySmall">Description</Text>
          <Text variant="bodyMedium">{info.description}</Text>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
    marginRight : 5,
    padding: 15,
    width : 138,
    height : 169
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    padding: 10,
    borderRadius: 10,
    height: 103,
    width : 116
  },
  favoriteIconButton: {
    // borderRadius: 5,
    backgroundColor: 'white',
    borderWidth : 0,
  },
  body: {
    width : 117,
    height : 39,
    marginVertical: 0,
  },
  bodyIconButton: {
    borderRadius: 5,
  },
  title: {
    flexShrink: 1,
    paddingRight: 10,
    width : 78,
    fontSize : 11,
    fontWeight : '500'
  },
  address : {
    fontSize : 8,
    fontWeight : '400'
  }
});
