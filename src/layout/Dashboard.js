import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  PaperProvider,
  Searchbar,
  IconButton,
  useTheme,
} from 'react-native-paper';
import MInTakeModal from '../components/MInTakeModal';
import { DataState } from '../context/Provider';
import { isEmpty } from '../utils/util';
import { getFeaturedLocations } from '../utils/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import MCardViewSmall from '../components/MCardViewSmall';
import MCardViewMedium from '../components/MCardViewMedium';

const service = [
  {
    image: require('../assets/icons/truck.png'),
    title: 'Shuttle Service',
  },
  {
    image: require('../assets/icons/resturant.png'),
    title: 'Restaurants',
  },
  {
    image: require('../assets/icons/healthcare.png'),
    title: 'Healthcare',
  },
  {
    image: require('../assets/icons/park.png'),
    title: 'Park',
  },
  {
    image: require('../assets/icons/beaches.png'),
    title: 'Beaches',
  },
];

export default function Dashboard(props) {
  const { featuredLocations, setFeaturedLocations, setDrinkModalVisible } =
    DataState();
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (isEmpty(featuredLocations)) {
      getFeaturedLocations()
        .then(data =>
          setFeaturedLocations(data.slice(0, Math.min(data.length, 6))),
        )
        .catch(null);
    }
  }, []);

  return (
    <PaperProvider>
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.searchPart}>
          <Searchbar
            placeholder="Discover your journey..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              backgroundColor: '#F6F6F6',
              width: '80%',
              borderRadius: 15,
              height: 50,
            }}
            inputStyle={{
              fontSize: 16,
              color: 'black',
              padding: 0,
              textAlignVertical: 'center',
              minHeight: 0,
            }}
          />
          <View style={styles.shadow}>
            <IconButton
              style={{
                borderRadius: 10,
                textAlign: 'center',
              }}
              icon="tune"
              iconColor={theme.colors.primary}
              containerColor="#fff"
              size={32}
              // onPress={() =>
              //   // props.navigation.dispatch(DrawerActions.openDrawer())
              // }
            />
          </View>
        </View>
        <ScrollView
          style={{ flexDirection: 'row', margin: '5%', width: '100%' }}
          horizontal={true}>
          {service.map((item, index) => {
            return (
              <View style={styles.cardStyle} key={index}>
                <ImageBackground
                  source={item.image}
                  style={{
                    width: '70%',
                    height: '70%',
                    left: '20%',
                    top: '10%',
                  }}
                />
                <Text
                  style={{ fontSize: 12, color: 'black', textAlign: 'center' }}>
                  {item.title}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <Text
          style={{
            fontSize: 16,
            left: '5%',
            marginTop: 10,
            fontWeight: '700',
          }}>
          Popular Hotels
        </Text>
        <ScrollView
          style={{ flexDirection: 'row', minHeight: 200 }}
          horizontal={true}>
          {featuredLocations?.map((info, index) => (
            <View style={styles.hotelPart} key={index}>
              <MCardViewSmall
                key={index}
                info={info}
                navigation={navigation}
                route={route}
              />
            </View>
          ))}
        </ScrollView>
        <Text
          style={{
            fontSize: 16,
            left: '5%',
            marginTop: 20,
            fontWeight: '700',
          }}>
          Popular Destinations
        </Text>
        <ScrollView style={{ flexDirection: 'row' }} horizontal={true}>
          {featuredLocations?.map((info, index) => (
            <MCardViewMedium
              key={index}
              info={info}
              navigation={navigation}
              route={route}
            />
          ))}
        </ScrollView>
        <MInTakeModal />
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 30,
    paddingVertical: 70,
  },
  shadow: {
    shadowColor: '#cccaca',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    shadowOpacity: 1,
    shadowRadius: 0.5,
    elevation: 7,
    // For non-rounded button, you can adjust the borderRadius here
    borderRadius: 10, // Adjust this value to match the IconButton's borderRadius if needed
    justifyContent: 'center', // Center the IconButton vertically
    alignItems: 'center', // Center the IconButton horizontally
  },
  text: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  drinksButton: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#1da1f2',
  },
  drinksLabel: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  title: {
    marginTop: 50,
    color: '#1c1c1f',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featured: {
    fontWeight: 'bold',
    color: '#1da1f2',
  },
  subTitle: {
    fontSize: 16,
    color: '#5b5b63',
    fontWeight: '400',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    alignItems: 'center',
  },
  cardStyle: {
    width: 90,
    height: 90,
    borderColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 2,
    marginRight: 5,
  },
  hotelPart: {
    width: '33%',
    marginTop: 5,
  },
});
