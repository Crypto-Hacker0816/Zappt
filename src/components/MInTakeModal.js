import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Checkbox,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import { updateUserProfile } from '../utils/api';
import { AuthState } from '../context/Provider';
import { isEmpty, numberFormat } from '../utils/util';
import MButton from './MButton';
import notify from '../utils/notify';

export default function InTakeModal({ show }) {
  const [curStep, setCurStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = AuthState();
  // const curYear = new Date().getFullYear();

  const steps = [
    {
      title: 'What type of Bars Do You Enjoy?',
      attribute: 'barType',
      options: [
        'College kids(party)',
        'Mature/upscale(classy)',
        'Sports bar',
        'Dive',
        'Clubs',
        'Lounge',
      ],
      type: 'checkbox',
    },
    {
      title: 'What Experiences Are You Looking For?',
      attribute: 'experienceType',
      options: ['Events', 'Restaurants', 'Bars'],
      type: 'checkbox',
    },
    {
      title: 'How old are you?',
      attribute: 'age',
      label: 'Age',
      type: 'number',
    },
    {
      title: 'What Gender do you Identify as?',
      attribute: 'gender',
      options: ['Male', 'Female', 'None-binary', 'Prefer not to say'],
      type: 'radio',
    },
    {
      title: 'What brings you to Zappt?',
      attribute: 'reason',
      options: [
        'New date ideas',
        'Explore new spots',
        'Looking for something in particular',
        'Just here for fun',
        'Prefer not to say',
      ],
      type: 'checkbox',
    },
  ];

  useEffect(() => {
    if (auth?.isNew) {
      notify(
        'To help improve accuracy of searches you can update this info at any time on your profile page.',
        'success',
      );
    }
    setCurStep(0);
    setFormData(auth);
  }, [auth?.isNew]);

  // useEffect(() => {
  //   setFormData({
  //     ...formData,
  //     age: (curYear - formData.birthdayYear).toString(),
  //   });
  // }, [formData.birthdayYear]);

  const handleSubmitChange = () => {
    const abortController = new AbortController();
    setLoading(true);
    updateUserProfile(
      { formData: { ...formData, isNew: false } },
      abortController.signal,
    )
      .then(data => {
        setLoading(false);
        setAuth({ ...auth, ...formData, ...data, isNew: false });
      })
      .catch('null');
  };

  const handleClose = () => {
    const abortController = new AbortController();
    updateUserProfile({ formData: { isNew: false } }, abortController.signal)
      .then(() => {
        setAuth({ ...auth, isNew: false });
      })
      .catch('null');
    notify(
      'To get better recommendations, you can fill this out at anytime on your profile page.',
      'warn',
    );
  };

  const RadioGroup = ({ title, attribute, options, formData, setFormData }) => (
    <View>
      <Text style={styles.titleHeader}>{title} </Text>
      {options.map((option, index) => (
        <Pressable
          style={styles.checkboxOption}
          key={option + '_' + attribute + '_' + index}
          onPress={newValue =>
            setFormData({ ...formData, [attribute]: newValue ? option : '' })
          }>
          <RadioButton
            color="#1da1f2"
            status={option === formData[attribute] ? 'checked' : 'unchecked'}
          />
          <Text>{option}</Text>
        </Pressable>
      ))}
    </View>
  );

  const CheckBoxGroup = ({
    title,
    attribute,
    options,
    formData,
    setFormData,
  }) => (
    <View>
      <Text style={styles.titleHeader}>{title} </Text>
      {options.map((option, index) => {
        const isIncluded = formData[attribute]?.includes(option);
        return (
          <View key={option + '_' + attribute + '_' + index}>
            <Pressable
              style={styles.checkboxOption}
              onPress={() =>
                setFormData(prevData => {
                  const updatedData = prevData[attribute]
                    ? [...prevData[attribute]]
                    : [];
                  if (!isIncluded) {
                    updatedData.push(option);
                  } else {
                    const idx = updatedData.indexOf(option);
                    updatedData.splice(idx, 1);
                  }
                  return { ...prevData, [attribute]: updatedData };
                })
              }>
              <Checkbox
                color="#1da1f2"
                status={isIncluded ? 'checked' : 'unchecked'}
              />
              <Text>{option}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );

  const renderQuestionCmp = question => {
    if (question.type === 'radio') {
      return (
        <RadioGroup
          attribute={question.attribute}
          options={question.options}
          formData={formData}
          setFormData={setFormData}
          title={question.title}
        />
      );
    } else if (question.type === 'checkbox') {
      return (
        <CheckBoxGroup
          attribute={question.attribute}
          formData={formData}
          setFormData={setFormData}
          options={question.options}
          title={question.title}
        />
      );
    } else if (question.type === 'number') {
      return (
        <>
          {!isEmpty(question.title) && (
            <Text style={styles.titleHeader}>- {question.title}</Text>
          )}
          <TextInput
            activeOutlineColor="#1da1f2"
            mode="outlined"
            keyboardType="numeric"
            value={numberFormat(formData[question.attribute]) || ''}
            onChangeText={e =>
              setFormData({
                ...formData,
                [question.attribute]: Math.max(1, Math.min(e, 300)),
              })
            }
          />
        </>
      );
    }
  };

  return (
    <View>
      <Portal>
        <Modal
          visible={auth?.isNew}
          onDismiss={handleClose}
          style={styles.modal}>
          <View
            style={{
              padding: 20,
              backgroundColor: 'white',
            }}>
            <View style={styles.modalHeader}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                Questionare
              </Text>
            </View>
            <View>{renderQuestionCmp(steps[curStep])}</View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: 10,
              }}>
              <MButton
                style={styles.button}
                buttonColor="#1da1f2"
                mode="contained"
                onPress={() => setCurStep(curStep - 1)}
                disabled={curStep === 0}>
                Prev
              </MButton>
              <MButton
                style={styles.button}
                buttonColor="#1da1f2"
                mode="contained"
                onPress={() => setCurStep(curStep + 1)}
                disabled={curStep === steps.length - 1}>
                Next
              </MButton>
              {curStep === steps.length - 1 ? (
                <MButton
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  buttonColor="#1da1f2"
                  mode="contained"
                  onPress={handleSubmitChange}>
                  Done
                </MButton>
              ) : (
                <MButton
                  style={styles.button}
                  buttonColor="#1da1f2"
                  mode="contained"
                  onPress={handleClose}>
                  Not Now
                </MButton>
              )}
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    flex: 0,
    alignSelf: 'stretch',
  },
  mapViewContainer: {
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  titleHeader: {
    fontSize: 15,
    padding: 10,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },
  button: {
    margin: 5,
  },
});
