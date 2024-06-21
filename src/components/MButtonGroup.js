import React from 'react';
import { isEmpty } from '../utils/util';
import { Chip, useTheme } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

export default function MButtonGroup({
  listItems,
  formData,
  setFormData,
  attribute,
  prefix,
  isEdit,
  isMultiSelect,
  activeVariant = 'flat',
  normalVariant = 'outlined',
  withAttribute = false,
  disabled,
  ...props
}) {
  const theme = useTheme();
  const currentData = isMultiSelect
    ? formData[attribute]
    : isEmpty(formData[attribute])
      ? []
      : [formData[attribute]];

  const getPrefix = index => {
    if (isEmpty(prefix)) {
      return;
    } else if (prefix === 'letter') {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return index > 25 ? '-' : alphabet[index] + '.';
    } else {
      return prefix;
    }
  };

  const handleChange = (item, included) => {
    let newValue;
    if (isMultiSelect) {
      if (included) {
        newValue = formData[attribute].filter(data => data !== item);
      } else {
        newValue = isEmpty(formData[attribute])
          ? [item]
          : [...formData[attribute], item];
      }
    } else {
      if (included) {
        newValue = null;
      } else {
        newValue = item;
      }
    }

    setFormData({ ...formData, [attribute]: newValue });
  };

  let buttons = [];
  if (!isEmpty(listItems)) {
    buttons = listItems.reduce((accumulator, item, index) => {
      const included =
        currentData?.includes(item) || currentData?.includes(item.value);

      if (isEdit || included) {
        accumulator.push(
          <Chip
            key={index}
            style={!disabled && included ? styles.flat_wrapper : {}}
            mode={!disabled && included ? activeVariant : normalVariant}
            onPress={() =>
              !disabled && handleChange(item?.value || item, included)
            }
            {...props}>
            <Text style={!disabled && included ? styles.flat_color : {}}>
              {withAttribute ? attribute + ': ' : ''}
              {getPrefix(index)} {item?.text || item}
            </Text>
          </Chip>,
        );
      }
      return accumulator;
    }, []);
  }

  return (
    <>{!isEmpty(buttons) && <View style={styles.wrapper}>{buttons}</View>}</>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  flat_wrapper: {
    backgroundColor: '#1da1f2',
    color: 'white',
  },
  flat_color: {
    color: 'white',
  },
});
