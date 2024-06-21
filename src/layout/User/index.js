import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getUserById,
  updateUserProfile,
  uploadFileToServer,
} from '../../utils/api';
import { AuthState, DataState } from '../../context/Provider';
import { dateFormat, isEmpty } from '../../utils/util';
import notify from '../../utils/notify';
import {
  useTheme,
  Text as PaperText,
  TextInput,
  Chip,
  IconButton,
} from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import MButton from '../../components/MButton';
import images from '../../assets/images';
import s from '../../utils/styles';
import MCardViewMedium from '../../components/MCardViewMedium';
import MButtonGroup from '../../components/MButtonGroup';
import DatePicker from 'react-native-date-picker';

export default function UserPage() {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { auth: userData, setAuth } = AuthState();
  const { id } = userData;
  const [isLoading, setIsLoading] = useState(false);
  const { favorite_locations, isAuthenticated } = userData || {};
  const [formData, setFormData] = useState(userData);
  const [isUpdateQuestion, setIsUpdateQuestion] = useState(false);
  const [isUpdateDate, setIsUpdateDate] = useState(false);
  const { setShowHeader, setToggleIntialState } = DataState();
  useEffect(() => {
    if (route.name === 'auth') setShowHeader(false);
  }, [route]);

  useEffect(() => {
    setShowHeader(false);
  }, []);

  const questions = [
    {
      title: 'What type of Bars Do You Enjoy?',
      attribute: 'barType',
      multiSelect: true,
      options: [
        'College kids(party)',
        'Mature/upscale(classy)',
        'Sports bar',
        'Dive',
        'Clubs',
        'Lounge',
      ],
      type: 'buttonGroup',
    },
    {
      title: 'What Experiences Are You Looking For?',
      attribute: 'experienceType',
      multiSelect: true,
      options: ['Events', 'Restaurants', 'Bars'],
      type: 'buttonGroup',
    },
    {
      title: 'What Do You Like to Drink?',
      attribute: 'drinkType',
      multiSelect: true,
      options: ['Mixed drinks', 'Beer', 'Seltzer', 'Wine', 'Mixology drinks'],
      type: 'buttonGroup',
    },
    {
      title: 'What is your Typical Weekend Night Spend?',
      subQuestion: [
        {
          title: 'On a typical weekend night out how much do you spend?',
          attribute: 'currentSpend',
          options: ['$10-25', '$26-50', '$50-100', '$100-200', '$200+'],
          multiSelect: false,
          type: 'buttonGroup',
        },
        {
          title: 'Are you happy about this?',
          attribute: 'statusSpend',
          options: ['Yes', 'No'],
          multiSelect: false,
          type: 'buttonGroup',
        },
        {
          title:
            'On a typical weekend night out how much would you like to spend?',
          attribute: 'idealSpend',
          options: ['$10-25', '$26-50', '$50-100', '$100-200', '$200+'],
          multiSelect: false,
          type: 'buttonGroup',
        },
      ],
      type: 'group',
    },
    {
      title: 'How Old are You?',
      subQuestion: [
        {
          title: 'How old are you?',
          attribute: 'birthday',
          label: '',
          options: [],
          type: 'datepicker',
        },
        {
          title: 'What age do you feel?',
          attribute: 'idealAge',
          label: '',
          options: Array.from({ length: 100 }, (_, index) => ({
            text: index,
            value: index,
          })),
          type: 'inputNumber',
        },
      ],
      type: 'group',
    },
    {
      title: 'What Gender do you Identify as?',
      attribute: 'gender',
      multiSelect: false,
      options: ['Male', 'Female', 'None-binary', 'Prefer not to say'],
      type: 'buttonGroup',
    },
    {
      title: 'What Ethnicity are you?',
      attribute: 'identify',
      multiSelect: false,
      options: [
        'American Indian or Alaskan Native',
        'Asian / Pacific Islander',
        'Black or African American',
        'Hispanic',
        'White / Caucasian',
        'Other',
        'Prefer not to say',
      ],
      type: 'buttonGroup',
    },
    {
      title: 'What brings you to Zappt?',
      attribute: 'reason',
      multiSelect: true,
      options: [
        'New date ideas',
        'Explore new spots',
        'Looking for something in particular',
        'Just here for fun',
        'Prefer not to say',
      ],
      type: 'buttonGroup',
    },
    {
      title: 'Ideal night out?',
      attribute: 'ideal',
      multiSelect: true,
      options: [
        'Craft cocktails',
        'Good beer',
        'Swanky vibe',
        'High energy',
        'Cozy spot',
        'Snacks on hand',
        'Lots around to walk to',
        'Meeting new people',
        'None of these',
      ],
      type: 'buttonGroup',
    },
  ];

  useEffect(() => {
    getUserById(id).then(userDetail => {
      setAuth({
        ...userData,
        ...userDetail,
        firstName: userDetail.first_name,
        lastName: userDetail.last_name,
      });
      setFormData({
        ...userDetail,
        firstName: userDetail.first_name,
        lastName: userDetail.last_name,
      });
    });
    // eslint-disable-next-line
  }, [id]);

  // useEffect(() => {
  //   setFormData({
  //     ...formData,
  //     age: new Date().getFullYear() - new Date(formData.birthday).getFullYear(),
  //   });
  //   // eslint-disable-next-line
  // }, [formData.birthday]);

  const handleChangeWithName = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = () => {
    setIsLoading(true);
    if (isUpdateQuestion) {
      setIsUpdateQuestion(false);
    }
    updateUserProfile({ formData })
      .then(data => {
        setAuth({ ...userData, ...formData, ...data, intake: userData.intake });
        setIsLoading(false);
        notify('User profile updated', 'success');
      })
      .catch('null');
  };

  const handleChangeUserAvatar = async () => {
    if (!isLoading) {
      try {
        const options = {
          mediaType: 'photo',
        };
        setIsLoading(true);
        const result = await launchImageLibrary(options);
        if (result.didCancel) {
          console.log('User cancelled image picker');
        } else if (result.error) {
          console.log('ImagePicker Error: ', result.error);
        } else {
          const file = result.assets[0];
          const uri = file.uri;
          const type = file.type;
          const name = file.fileName;
          const source = {
            uri,
            type,
            name,
          };
          setFormData({ ...formData, avatar: '' });
          const form = new FormData();
          form.append('avatar', source);
          const res = await uploadFileToServer(form);
          setFormData({ ...formData, avatar: res?.secure_url });
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    }
  };

  const renderQuestionCmp = question => {
    if (question.type === 'buttonGroup') {
      return (
        <MButtonGroup
          listItems={question.options}
          formData={formData}
          setFormData={setFormData}
          attribute={question.attribute}
          isEdit={isUpdateQuestion}
          disabled={!isUpdateQuestion}
          isMultiSelect={question.multiSelect}
          prefix="letter"
        />
      );
    } else if (question.type === 'inputNumber') {
      if (isUpdateQuestion) {
        return (
          <TextInput
            mode="outlined"
            value={formData[question.attribute]}
            onChangeText={value =>
              setFormData({ ...formData, [question.attribute]: value })
            }
          />
        );
      } else if (!isEmpty(formData[question.attribute])) {
        return (
          <View style={s.d_flex}>
            <Chip mode="outlined">
              - {formData[question.attribute]} year old
            </Chip>
          </View>
        );
      } else {
        return null;
      }
    } else if (question.type === 'datepicker') {
      if (isUpdateQuestion) {
        return (
          <>
            <View style={s.d_flex}>
              <Chip mode="outlined" onPress={() => setIsUpdateDate(true)}>
                {dateFormat(
                  formData[question.attribute] || new Date(1970, 1, 1),
                )}
              </Chip>
              {!isEmpty(formData.age) && !isNaN(formData.age) && (
                <Chip
                  style={s.ml5}
                  mode="outlined">{`${formData.age} year old`}</Chip>
              )}
            </View>
            <DatePicker
              modal
              mode="date"
              open={isUpdateDate}
              date={
                new Date(formData[question.attribute]) || new Date(1970, 1, 1)
              }
              onConfirm={date => {
                setIsUpdateDate(false);
                setFormData({ ...formData, [question.attribute]: date });
              }}
              onCancel={() => setIsUpdateDate(false)}
            />
          </>
        );
      } else if (!isEmpty(formData.age) && !isNaN(formData.age)) {
        return (
          <View style={s.d_flex}>
            <Chip mode="outlined">
              {`- ${dateFormat(formData[question.attribute])} / ${
                formData.age
              } year old`}
            </Chip>
          </View>
        );
      }
    } else if (question.type === 'group') {
      return question.subQuestion.map((subQuestion, index) => (
        <View key={index} style={styles.sub_question}>
          <PaperText variant="bodyMedium" style={s.mb10}>
            {`${index + 1}. ${subQuestion.title}`}
          </PaperText>
          {renderQuestionCmp(subQuestion)}
        </View>
      ));
    }
    return null;
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={styles.card}>
        <View style={{ alignItems: 'center', marginVertical: '10%' }}>
          <Text
            style={{
              paddingBottom: 50,
              fontSize: 24,
              fontFamily: 'Roboto',
              fontWeight: '600',
              color: 'black',
            }}>
            Edit Profile
          </Text>
          <ImageBackground
            source={
              !isEmpty(formData.avatar) ? { uri: formData.avatar } : images.icon
            }
            style={styles.avatar}>
            <IconButton
              icon="pencil"
              containerColor={theme.colors.primary}
              iconColor="white"
              style={styles.avatarIcon}
              onPress={handleChangeUserAvatar}
            />
          </ImageBackground>
          <Text
            style={{
              padding: 5,
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Roboto',
              color: 'black',
            }}>
            {formData?.firstName || userData?.firstName}{' '}
            {formData?.lastName || userData?.lastName}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={value => handleChangeWithName('firstName', value)}
          value={formData?.firstName || userData?.firstName}
          right={<TextInput.Icon icon="pencil" size={20} />}
          left={<TextInput.Icon icon="account" size={20} />}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={value => handleChangeWithName('lastName', value)}
          value={formData?.lastName || userData?.lastName}
          right={<TextInput.Icon icon="pencil" size={20} />}
          left={<TextInput.Icon icon="account" size={20} />}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          disabled={true}
          value={userData?.email || ''}
          left={<TextInput.Icon icon="at" size={20} />}
        />
        <MButton
          loading={isLoading}
          disabled={isLoading}
          style={s.mt15}
          onPress={() => handleUpdateProfile()}>
          Save
        </MButton>
      </View>
      <View>
        <PaperText
          style={{
            fontSize: 20,
            left: '5%',
            marginTop: 10,
            fontWeight: '700',
          }}
          variant="headlineMedium">
          Favorite Location
        </PaperText>
        <ScrollView
          style={{ flexDirection: 'row', minHeight: 200 }}
          horizontal={true}>
          {!isEmpty(favorite_locations) ? (
            favorite_locations?.map((info, index) => (
              <MCardViewMedium
                key={index}
                info={info}
                navigation={navigation}
                route={route}
              />
            ))
          ) : (
            <PaperText
              style={{
                ...s.mt15,
                ...s.ml20,
                alignItems: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              variant="bodyLarge">
              No Location
            </PaperText>
          )}
        </ScrollView>
      </View>
      <View style={styles.card}>
        <View style={s.flex_between}>
          <PaperText
            style={{
              fontSize: 20,
              left: '5%',
              marginTop: 10,
              fontWeight: '700',
            }}
            variant="headlineMedium">
            User Questions
          </PaperText>
        </View>
        <View>
          {questions.map((question, index) => (
            <View key={index} style={styles.question}>
              <PaperText variant="bodyMedium" style={s.mb10}>
                {`${index + 1}. ${question.title}`}
              </PaperText>
              {renderQuestionCmp(question)}
            </View>
          ))}
        </View>
        {isUpdateQuestion && (
          <View style={[s.mt15, s.flex_end]}>
            <MButton
              mode="outlined"
              style={s.mr5}
              onPress={() => setIsUpdateQuestion(false)}>
              Cancel
            </MButton>
            <MButton onPress={handleUpdateProfile}>Save</MButton>
          </View>
        )}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {!isUpdateQuestion && (
            <MButton
              style={{ marginHorizontal: 5 }}
              icon="plus"
              mode="outlined"
              onPress={() => setIsUpdateQuestion(true)}>
              Add
            </MButton>
          )}
          {!isUpdateQuestion && (
            <MButton
              icon="pencil"
              mode="outlined"
              onPress={() => setIsUpdateQuestion(true)}>
              Edit
            </MButton>
          )}
        </View>
      </View>
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
  card: {
    margin: 15,
    padding: 15,
    // backgroundColor: 'white',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: '50%',
  },
  avatarIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 5,
    color: 'white',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
  },
  input: {
    backgroundColor: '#F9F9F9',
    height: 50,
    marginTop: 10,
    color: '#9D9D9D',
    fontSize: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  disabledInput: {
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: '#1c1c1f',
  },
  question: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sub_question: {
    marginVertical: 5,
  },
});
