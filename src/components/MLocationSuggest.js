import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { View } from 'react-native';
import { getLocationSuggest } from '../utils/api';
import DropDownPicker from 'react-native-dropdown-picker';

export default function MLocationSuggest(props) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [changed, setChanged] = React.useState(false);
  const [value, setValue] = useState(null);
  const fetch = React.useMemo(
    () =>
      debounce(async (request, callback) => {
        const results = await getLocationSuggest(request);
        callback(results);
      }, 700),
    [],
  );

  useEffect(() => {
    let active = true;

    if (!changed || !open || inputValue === '') {
      return undefined;
    }

    fetch({ key: inputValue }, results => {
      if (active) {
        setOptions(results);
        setChanged(false);
      }
    });

    return () => {
      active = false;
    };
  }, [changed, inputValue, fetch]);

  const selectValue = currentValue => {
    let chosenValue = currentValue();
    if (chosenValue === value) {
      setValue('');
    } else {
      setValue(currentValue);
    }
  };

  return (
    <View style={{ padding: 10, zIndex: 9999 }}>
      <DropDownPicker
        placeholder="Search for a Specific Business"
        listMode="SCROLLVIEW"
        scrollViewProps={{
          decelerationRate: 'fast',
        }}
        open={open}
        value={value}
        schema={{ label: 'name', value: 'name' }}
        items={options}
        searchable={true}
        onChangeValue={newValue => {}}
        onSelectItem={newValue => {
          props.onChange(newValue);
        }}
        onChangeSearchText={newInputValue => {
          setInputValue(newInputValue);
          setChanged(true);
        }}
        setOpen={setOpen}
        setValue={selectValue}
        autoScroll={true}
      />
    </View>
  );
}
