import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Rating } from 'react-native-ratings';
import Collapsible from 'react-native-collapsible';
import { setSuggestionRating } from '../../utils/api';
import { numberFormat } from '../../utils/util';
import notify from '../../utils/notify';
import { Card, IconButton, Text as PaperText } from 'react-native-paper';
import MButton from '../../components/MButton';
import s from '../../utils/styles';

export default function PersonalDetail({ ratings, setRatings }) {
  const ratingItems = [
    { text: 'Vibe', value: 'vibe' },
    { text: 'Amenties', value: 'amenties' },
    { text: 'Cost', value: 'cost' },
    { text: 'Quality', value: 'quality' },
  ];
  const [updatedRates, setUpdatedRates] = useState([]);
  const [rateUpdated, setRateUpdated] = useState(false);
  const [isShowRatings, setIsShowRatings] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const abortController = new AbortController();
    let updatedRatings = {};
    updatedRates.forEach(key => (updatedRatings[key] = ratings[key]));
    setSuggestionRating(
      { ratings: updatedRatings },
      abortController.signal,
    ).then(() => {
      setLoading(false);
      notify('Saved Successfully', 'success');
    });
  };

  return (
    <>
      <Card style={styles.card}>
        <PaperText variant="bodyMedium" style={s.secondaryColor}>
          How'd we do with this recommendation?
        </PaperText>
        <Pressable
          style={s.flex_between}
          onPress={() => setIsShowRatings(!isShowRatings)}>
          <View style={styles.reviewRating}>
            {ratings && ratings?.overall >= 0 && (
              <PaperText style={[s.mr5, styles.w_25]} variant="bodyMedium">
                {numberFormat(ratings.overall)}
              </PaperText>
            )}
            <Rating
              imageSize={25}
              fractions={1}
              jumpValue={0.5}
              startingValue={numberFormat(ratings?.overall)}
              style={s.mr5}
              onFinishRating={value => handleChangeStarRating(value, 'overall')}
            />
            <PaperText style={s.ml5} variant="bodyMedium">
              {parseFloat(ratings?.overall) || 0}
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
                  {ratings && ratings[item.value] >= 0
                    ? numberFormat(ratings[item.value])
                    : ''}
                </PaperText>
                <Rating
                  imageSize={25}
                  fractions={1}
                  jumpValue={0.5}
                  startingValue={ratings && numberFormat(ratings[item.value])}
                  style={s.mr5}
                  onFinishRating={value =>
                    handleChangeStarRating(value, item.value)
                  }
                />
                <PaperText variant="bodyMedium">
                  {parseFloat((ratings && ratings[item.value]) || 0)}
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
              buttonColor="#1da1f2"
              mode="contained"
              onPress={handleSubmitRating}>
              Save
            </MButton>
          )}
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
  },
  reviewRating: {
    minWidth: '55%',
    flexDirection: 'row',
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
