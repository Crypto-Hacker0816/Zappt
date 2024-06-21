import React, { useState } from 'react';
import {
  barType,
  specialtyType,
  events,
  games,
  barMusic,
  parking,
  dogFriendly,
  time2visit,
  amenities,
  ambiance,
  close2Others,
  sports,
  typesOfSports,
  dancing,
  levelOfMixology,
  costOfDrinks,
  costOfCans,
  drinkSpecialties,
  happyHour,
  offersFood,
  foodType,
  foodCost,
  reservation,
  restaurantType,
  meal,
} from '../layout/Location/DrowndownList';

import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, Platform } from 'react-native';

export default function MLocationSuggest(props) {
  const searchItems =
    props.curState === 'type'
      ? [
          {
            listItems: barType,
            label: 'Bar Type',
            attribute: 'barType',
            isMultiSelect: true,
          },
          {
            listItems: specialtyType,
            label: 'Specialty Type',
            attribute: 'specialtyType',
            isMultiSelect: true,
          },
          {
            listItems: events,
            label: 'Events',
            attribute: 'events',
            isMultiSelect: true,
          },
        ]
      : props.curState === 'vibe'
      ? [
          {
            listItems: games,
            label: 'Games',
            attribute: 'games',
            isMultiSelect: true,
          },
          {
            listItems: barMusic,
            label: 'Bar Music',
            attribute: 'barMusic',
            isMultiSelect: true,
          },
          {
            listItems: parking,
            label: 'Parking',
            attribute: 'parking',
            isMultiSelect: true,
          },
          {
            listItems: dogFriendly,
            label: 'Pet Friendly',
            attribute: 'dogFriendly',
            isMultiSelect: false,
          },
          {
            listItems: time2visit,
            label: 'Best Time to Visit',
            attribute: 'time2visit',
            isMultiSelect: true,
          },
          {
            listItems: amenities,
            label: 'Amenities',
            attribute: 'amenities',
            isMultiSelect: true,
          },
          {
            listItems: ambiance,
            label: 'Ambiance',
            attribute: 'ambiance',
            isMultiSelect: true,
          },
          {
            listItems: close2Others,
            label: 'Close to Other bars',
            attribute: 'close2Others',
            isMultiSelect: true,
          },
          {
            listItems: sports,
            label: 'Sports Watching',
            attribute: 'sports',
            isMultiSelect: true,
          },
          {
            listItems: typesOfSports,
            label: 'Types of Sports',
            attribute: 'typesOfSports',
            isMultiSelect: true,
          },
          {
            listItems: dancing,
            label: 'Dancing',
            attribute: 'dancing',
            isMultiSelect: false,
          },
        ]
      : props.curState === 'drinks'
      ? [
          {
            listItems: levelOfMixology,
            label: 'Mixology',
            attribute: 'mixology',
            isMultiSelect: true,
          },
          {
            listItems: costOfDrinks,
            label: 'Drink Cost',
            attribute: 'drinkCost',
            isMultiSelect: true,
          },
          {
            listItems: costOfCans,
            label: 'Beer Cost',
            attribute: 'beerCost',
            isMultiSelect: true,
          },
          {
            listItems: drinkSpecialties,
            label: 'Drink Specialties',
            attribute: 'drinkSpecialties',
            isMultiSelect: true,
          },
          {
            listItems: happyHour,
            label: 'Happy Hour',
            attribute: 'happyHour',
            isMultiSelect: true,
          },
        ]
      : [
          {
            listItems: offersFood,
            label: 'Offers Food',
            attribute: 'offersFood',
            isMultiSelect: false,
          },
          {
            listItems: foodType,
            label: 'Food Type',
            attribute: 'foodType',
            isMultiSelect: true,
          },
          {
            listItems: foodCost,
            label: 'Cost of Food',
            attribute: 'foodCost',
            isMultiSelect: true,
          },
          {
            listItems: reservation,
            label: 'Reservation',
            attribute: 'reservation',
            isMultiSelect: false,
          },
          {
            listItems: meal,
            label: 'Meal',
            attribute: 'meal',
            isMultiSelect: true,
          },
          {
            listItems: restaurantType,
            label: 'Restaurant Type',
            attribute: 'restaurantType',
            isMultiSelect: true,
          },
        ];

  const { formData, setFormData } = props;
  const { dropDownState, setDropdownState } = props;
  const [openValue, setOpenValue] = useState(-1);
  const [direction, setDirection] = useState('top');

  return (
    <View style={styles.container}>
      {searchItems.map((item, index) => (
        <View
          key={index}
          style={{
            margin: 5,
            flexDirection: 'row',
            zIndex : direction === 'top' ? 9999 - index : 1
          }}>
          <DropDownPicker
            listMode="SCROLLVIEW"
            scrollViewProps={{
              decelerationRate: 'fast',
            }}
            items={item.listItems}
            open={openValue === index}
            value={
              formData[item.attribute] ? props.formData[item.attribute] : null
            }
            dropDownContainerStyle={{
              position: 'absolute',
              zIndex: 100000,
              elevation: 100000,
              width: '100%',
            }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            setOpen={() => {
              if (openValue !== index) {
                setOpenValue(index);
                setDropdownState(true);
              } else {
                setOpenValue(-1);
                setDropdownState(false);
              }
            }}
            onDirectionChanged={(direction) => {
              setDirection(direction)
            }}
            onClose={() => {
              setOpenValue(-1);
            }}
            setValue={callback => {
              setFormData(formData => ({
                ...formData,
                [item.attribute]: callback(
                  formData && formData[item.attribute]
                    ? formData[item.attribute]
                    : null,
                ),
              }));
            }}
            autoScroll={true}
            multiple={item.isMultiSelect}
            dropDownDirection="AUTO"
            bottomOffset={150}
            placeholder={`Choose ${item.label}`}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 260,
    padding: 20,
    flexGrow: 1,
  },
});
