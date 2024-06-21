import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
} from 'react-native';
import MBanner from '../../components/MBanner';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AirbnbRating, Rating } from 'react-native-ratings';
import Collapsible from 'react-native-collapsible';

import {
  getImageURL,
  getLocationDetailByID,
  setFavoriteLocation,
  setLocationRating,
} from '../../utils/api';
import { AuthState } from '../../context/Provider';
import { isEmpty, numberFormat } from '../../utils/util';
import notify from '../../utils/notify';
import {
  Card,
  IconButton,
  useTheme,
  Text as PaperText,
  Divider,
  Avatar,
} from 'react-native-paper';
import MButton from '../../components/MButton';
import images from '../../assets/images';
import MLink from '../../components/MLink';
import s from '../../utils/styles';

export default function Detail() {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { id } = route.params;
  const [data, setData] = useState({});
  const { auth, setAuth } = AuthState();
  const { favoriteLocations, isAuthenticated } = auth || {};
  const [loading, setLoading] = useState(true);

  const ratingItems = [
    { text: 'Date spot', value: 'date_spot' },
    { text: 'Out with friends', value: 'friends' },
    { text: 'Family spot', value: 'family_spot' },
    { text: 'Value for money', value: 'money' },
  ];
  const [isShowRatings, setIsShowRatings] = useState(false);
  const [ratings, setRatings] = useState({});
  const [updatedRates, setUpdatedRates] = useState([]);
  const [rateUpdated, setRateUpdated] = useState(false);
  const [totalRatingCnt, setTotalRatingCnt] = useState({});
  const [mineRatings, setMineRatings] = useState({});
  const handleToggleFavorite = async id => {
    if (isEmpty(auth) || !auth.isAuthenticated) {
      // notify('Please login', 'warn');
      return navigation.navigate('signIn');
    }
    const result_data = await setFavoriteLocation({ id });
    const isAdded = favoriteLocations?.includes(id);
    setAuth({ ...auth, favoriteLocations: result_data.data });
    notify(`${isAdded ? 'Remove' : 'Add'} Favorite Success`, 'success');
  };

  useEffect(() => {
    getLocationDetailByID(id)
      .then(detail => {
        setData(detail);
        const totalRating = detail.z_rating.total || {};
        const mineRating = detail.z_rating.mine || {};
        setMineRatings(mineRating);

        let totalRatingCntTemp = { overall: totalRating?.overall_cnt };
        let newRatings = {
          overall:
            mineRating?.overall ??
            totalRating?.overall /
              (parseInt(totalRatingCntTemp?.overall, 10) +
                (isEmpty(mineRating?.overall) ? 0 : 1)),
        };
        ratingItems.forEach(item => {
          totalRatingCntTemp[item.value] = totalRating[`${item.value}_cnt`];
          newRatings[item.value] =
            mineRating[item.value] ??
            totalRating[item.value] /
              (parseInt(totalRatingCntTemp[item.value], 10) +
                (isEmpty(mineRating[item.value]) ? 0 : 1));
        });
        setTotalRatingCnt(totalRatingCntTemp);
        setRatings(newRatings);
      })
      .then(() => setLoading(false));

    // eslint-disable-next-line
  }, [id]);

  const renderServices = () => {
    const items = [];
    let cnt = 1;
    if (data.dine_in) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Dine in
        </PaperText>,
      );
    }
    if (data.serves_beer) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Serves beer
        </PaperText>,
      );
    }
    if (data.serves_dinner) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Serves dinner
        </PaperText>,
      );
    }
    if (data.serves_lunch) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Serves Lunch
        </PaperText>,
      );
    }
    if (data.serves_wine) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Serves wine
        </PaperText>,
      );
    }
    if (data.takeout) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Takeout
        </PaperText>,
      );
    }
    if (data.wheelchair_accessible_entrance) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Wheelchair accessible entrance
        </PaperText>,
      );
    }
    if (data.delivery) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Delivery
        </PaperText>,
      );
    }
    if (data.reservable) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Reservable
        </PaperText>,
      );
    }
    if (data.curbside_pickup) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Curbside pickup
        </PaperText>,
      );
    }
    if (data.serves_vegetarian_food) {
      items.push(
        <PaperText variant="bodyMedium" key={cnt}>
          {cnt++}. Serves vegetarian food
        </PaperText>,
      );
    }
    return items;
  };

  const handleChangeStarRating = (value, key) => {
    setRatings(prev => ({
      ...prev,
      [key]: value,
    }));
    setUpdatedRates(prev => {
      if (!prev.includes(key)) {
        return [...prev, key];
      } else {
        return prev;
      }
    });
    if (!rateUpdated) {
      setRateUpdated(true);
    }
  };

  const handleSubmitRating = () => {
    if (isEmpty(auth) || !auth.isAuthenticated) {
      return navigation.navigate('signIn');
    }
    const abortController = new AbortController();
    let updatedRatings = {};
    updatedRates.forEach(key => (updatedRatings[key] = ratings[key]));
    setLocationRating(
      { location_id: data.id, ratings: updatedRatings },
      abortController.signal,
    )
      .then(() => {
        setMineRatings(updatedRatings);
        notify('Saved Successfully', 'success');
      })
      .then(() => setLoading(false));
  };

  const isFavoriteLocation =
    !isEmpty(favoriteLocations) && favoriteLocations?.includes(data.id);

  return (
    <ScrollView>
      <MBanner title="Location Info" signed={isAuthenticated} />
      <Text
        style={
          isAuthenticated ? [styles.title, styles.signedMargin] : styles.title
        }>
        Location<Text style={styles.featured}> Info</Text>
      </Text>
      <Card style={styles.card}>
        <View style={styles.imageWrapper}>
          <ImageBackground
            style={styles.image}
            source={getImageURL(data.photo) || images.icon}>
            <IconButton
              style={styles.favoriteIconButton}
              icon={isFavoriteLocation ? 'heart' : 'heart-outline'}
              iconColor={
                isFavoriteLocation ? theme.colors.error : theme.colors.secondary
              }
              mode="outlined"
              size={20}
              onPress={() => handleToggleFavorite(data.id)}
            />
          </ImageBackground>
        </View>
        <PaperText variant="titleMedium">{data.name}</PaperText>
        <PaperText variant="bodyMedium">{data.address}</PaperText>
        <View style={styles.links}>
          <MLink href={data.website_url}>
            <MButton icon="web">Website</MButton>
          </MLink>
          <MLink href={data.map_url}>
            <MButton icon="map-marker-outline">Location</MButton>
          </MLink>
        </View>
        <PaperText variant="bodyMedium" style={s.secondaryColor}>
          Google's rating
        </PaperText>
        <Rating
          readonly
          imageSize={25}
          fractions={1}
          jumpValue={0.5}
          startingValue={data.rating}
          style={[s.flex_start, s.mv5]}
        />
        <PaperText variant="bodyMedium" style={s.secondaryColor}>
          Zappt's ratings
        </PaperText>
        <Pressable
          style={s.flex_between}
          onPress={() => setIsShowRatings(!isShowRatings)}>
          <View style={styles.reviewRating}>
            {ratings.overall >= 0 && (
              <PaperText style={[s.mr5, styles.w_25]} variant="bodyMedium">
                {numberFormat(ratings.overall)}
              </PaperText>
            )}
            <Rating
              imageSize={25}
              fractions={1}
              jumpValue={0.5}
              startingValue={numberFormat(ratings.overall)}
              style={s.mr5}
              onFinishRating={value => handleChangeStarRating(value, 'overall')}
            />
            <PaperText style={s.ml5} variant="bodyMedium">
              {numberFormat(
                parseInt(totalRatingCnt.overall, 10) +
                  (isEmpty(mineRatings.overall) ? 0 : 1),
              )}
            </PaperText>
          </View>
          <IconButton
            icon={!isShowRatings ? 'chevron-down' : 'chevron-up'}
            size={20}
          />
        </Pressable>
        <Collapsible collapsed={!isShowRatings}>
          {ratingItems.map((item, index) => (
            <View key={index} style={s.flex_between_center}>
              <PaperText variant="bodyMedium">{item.text}</PaperText>
              <View style={styles.reviewRating}>
                <PaperText style={styles.w_25} variant="bodyMedium">
                  {ratings[item.value] >= 0
                    ? numberFormat(ratings[item.value])
                    : ''}
                </PaperText>
                <Rating
                  imageSize={25}
                  fractions={1}
                  jumpValue={0.5}
                  startingValue={numberFormat(ratings[item.value])}
                  style={s.mr5}
                  onFinishRating={value =>
                    handleChangeStarRating(value, item.value)
                  }
                />
                <PaperText variant="bodyMedium">
                  {numberFormat(
                    parseInt(totalRatingCnt[item.value], 10) +
                      (isEmpty(mineRatings[item.value]) ? 0 : 1),
                  )}
                </PaperText>
              </View>
            </View>
          ))}
        </Collapsible>
        <View style={styles.ratingBtn}>
          {rateUpdated && (
            <MButton
              loading={loading}
              disabled={loading}
              onPress={handleSubmitRating}>
              Save
            </MButton>
          )}
        </View>
        <PaperText variant="bodyMedium" style={[s.secondaryColor, s.mt5]}>
          Description
        </PaperText>
        <PaperText variant="bodyMedium">{data.description}</PaperText>
        <Divider style={s.mv10} />
        <PaperText variant="bodyMedium" style={s.secondaryColor}>
          Service Options
        </PaperText>
        <View style={styles.services}>{renderServices()}</View>
        <View style={styles.services}>
          <View style={styles.others}>
            <PaperText variant="bodyMedium" style={s.secondaryColor}>
              Phone number:
            </PaperText>
            <PaperText variant="bodyMedium">
              {data.international_phone_number}
            </PaperText>
          </View>
          <View style={styles.others}>
            <PaperText variant="bodyMedium" style={s.secondaryColor}>
              Price level:
            </PaperText>
            <PaperText variant="bodyMedium">{data.price_level}</PaperText>
          </View>
          <View style={styles.others}>
            <PaperText variant="bodyMedium" style={s.secondaryColor}>
              Rating:
            </PaperText>
            <PaperText variant="bodyMedium">{data.rating}</PaperText>
          </View>
          <View style={styles.others}>
            <PaperText variant="bodyMedium" style={s.secondaryColor}>
              User Ratings Total:
            </PaperText>
            <PaperText variant="bodyMedium">
              {data.user_ratings_total}
            </PaperText>
          </View>
        </View>
        <PaperText variant="bodyMedium" style={s.secondaryColor}>
          Opening hours:
        </PaperText>
        <View>
          {!isEmpty(data.opening_hours?.weekday_text) && (
            <>
              {data.opening_hours?.weekday_text?.map((item, index) => (
                <View key={index} style={s.d_flex}>
                  <PaperText style={s.w_50} variant="bodyMedium">
                    {item.split('day:')[0]}day:
                  </PaperText>
                  <PaperText
                    numberOfLines={3}
                    style={s.w_50}
                    variant="bodyMedium">
                    {item.split('day:')[1]}
                  </PaperText>
                </View>
              ))}
            </>
          )}
        </View>
      </Card>
      <Card style={styles.card}>
        <PaperText variant="titleLarge">Reviews</PaperText>
        {data?.reviews?.map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.profileContainer}>
                <Avatar.Image
                  size={48}
                  source={{ uri: review.profile_photo_url }}
                />
                <View style={styles.detailsContainer}>
                  <PaperText variant="bodyLarge">
                    {review.author_name}
                  </PaperText>
                  <PaperText variant="bodyMedium" style={s.secondaryColor}>
                    Relative time: {review.relative_time_description}
                  </PaperText>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                <PaperText
                  variant="bodyMedium"
                  style={[s.mr5, s.secondaryColor]}>
                  Ratings:
                </PaperText>
                <AirbnbRating
                  showRating={false}
                  size={25}
                  defaultRating={review.rating}
                  ratingContainerStyle={[s.flex_start, s.mv5]}
                  isDisabled
                />
              </View>
            </View>
            <PaperText variant="bodyMedium">{review.text}</PaperText>
          </View>
        ))}
      </Card>
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
  card: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    padding: 10,
    borderRadius: 10,
    height: 150,
  },
  favoriteIconButton: {
    borderRadius: 5,
    backgroundColor: 'white',
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
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  services: {
    flexDirection: 'row',
    gap: 5,
    overflow: 'hidden',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  others: {
    width: '49%',
  },
  reviewContainer: {
    marginTop: 16,
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
  },
  headerContainer: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 55,
  },
  reviewRating: {
    minWidth: '55%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  w_25: {
    width: 25,
  },
  ratingBtn: {
    marginTop: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
