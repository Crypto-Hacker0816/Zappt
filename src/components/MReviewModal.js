import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import MButton from './MButton';
import MCardView from './MCardView';
import ReviewDetail from '../layout/Location/ReviewDetail';
import PersonalDetail from '../layout/Location/PersonalDetail';
import { AuthState } from '../context/Provider';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function MReviewModal({
  filterData,
  suggestionRating,
  loading,
  setSuggestionRating,
  setFilterData,
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const types = ['Overall Rating', 'Suggestion Rating'];

  const [active, setActive] = useState(types[0]);
  const { auth, setAuth } = AuthState();

  const [selected, setSelected] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [data, setData] = useState([]);
  const [locationIndex, setIndex] = useState(-1);
  const [textState, setTextState] = useState(true);

  const handleClose = () => {
    setAuth(prev => {
      return { ...prev, intake: false };
    });
  };

  useEffect(() => {
    if (selected.length !== 0) {
      setTextState(false);
    } else {
      setTextState(true);
    }
  }, [selected.length]);

  useEffect(() => {
    setData(
      filterData &&
        filterData.filter(item => item.id === selected[locationIndex]),
    );

    // eslint-disable-next-line
  }, [locationIndex]);

  const handleReviewModal = () => {
    setIndex(0);
    setModalState(true);
  };

  const handleMinusIndex = () => {
    if (locationIndex === 0) {
      setIndex(0);
    } else {
      let curIndex = locationIndex;
      setIndex(curIndex - 1);
    }
  };

  const handlePlusIndex = () => {
    if (locationIndex === selected.length - 1) {
      setIndex(selected.length - 1);
    } else {
      let curIndex = locationIndex;
      setIndex(curIndex + 1);
    }
  };

  const handleCardClick = id => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const renderRatingModel = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          {types.map(type => (
            <TouchableOpacity key={type} onPress={() => setActive(type)}>
              <Text
                style={{
                  textDecorationLine: active === type ? 'underline' : 'none',
                  paddingHorizontal: 15,
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={{ height: '85%' }}>
          {active === 'Overall Rating' ? (
            <>
              {data[0] && (
                <ReviewDetail setFilterData={setFilterData} data={data[0]} />
              )}
            </>
          ) : (
            <>
              <PersonalDetail
                setRatings={setSuggestionRating}
                ratings={suggestionRating}
              />
            </>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderOnlySuggestionModel = () => {
    return (
      <View style={{ paddingTop: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <Text
              style={{
                textDecorationLine: 'underline',
                padding: 5,
                fontSize: 15,
                fontWeight: 'bold',
              }}>
              Suggestion Rating
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ height: '85%' }}>
          <PersonalDetail
            setRatings={setSuggestionRating}
            ratings={suggestionRating}
          />
        </ScrollView>
      </View>
    );
  };

  return (
    <Portal>
      <Modal
        visible={auth?.intake && !auth.isNew && filterData}
        onDismiss={() => handleClose()}
        style={styles.modal}>
        <View
          style={{
            paddingTop: 20,
            backgroundColor: 'white',
          }}>
          {!modalState ? (
            <>
              <View style={styles.modalHeader}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                  Which locations did you visit?
                </Text>
              </View>
              <ScrollView style={{ height: '85%' }}>
                {filterData?.length > 0 &&
                  filterData.map((info, index) => {
                    return (
                      <MCardView
                        key={index}
                        info={info}
                        withDesc
                        withRate
                        isShowReviewModal
                        isSelected={selected.includes(info.id)}
                        onPress={() => handleCardClick(info.id)}
                        navigation={navigation}
                        route={route}
                      />
                    );
                  })}
              </ScrollView>
            </>
          ) : textState ? (
            renderOnlySuggestionModel()
          ) : (
            renderRatingModel()
          )}
          {!modalState ? (
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 5,
                width: '60%',
                left: '23%',
              }}>
              <MButton
                buttonColor="#1da1f2"
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={handleReviewModal}>
                {textState
                  ? "I didn't visit any of these locations"
                  : 'Review Locations'}
              </MButton>
              <MButton mode="outlined" onPress={handleClose}>
                Not now
              </MButton>
              <View style={{ marginLeft: 5 }} />
            </View>
          ) : (
            <View style={{ flexDirection: 'column' }}>
              {active === 'Overall Rating' && selected.length > 1 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 30,
                    paddingTop: 20,
                  }}>
                  <View>
                    <Text>
                      {locationIndex + 1}/{selected.length}
                    </Text>
                  </View>
                  <MButton
                    buttonColor="#1da1f2"
                    mode="contained"
                    onPress={handleMinusIndex}>
                    Prev
                  </MButton>
                  <MButton
                    buttonColor="#1da1f2"
                    mode="contained"
                    onPress={handlePlusIndex}>
                    Next
                  </MButton>
                  <MButton
                    buttonColor="#1da1f2"
                    mode="contained"
                    onPress={handleClose}>
                    Close
                  </MButton>
                </View>
              ) : (
                <MButton
                  style={{ marginHorizontal: 10, marginTop: 20 }}
                  buttonColor="#1da1f2"
                  mode="contained"
                  onPress={handleClose}>
                  Close
                </MButton>
              )}
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    flex: 0,
    alignSelf: 'stretch',
    height: '87%',
    backgroundColor: 'white',
    top: '5%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
});
