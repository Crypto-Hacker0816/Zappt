import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Divider,
  Drawer as PaperDrawer,
  Text,
} from 'react-native-paper';
import MButton from './MButton';
import MDrinksNearMe from './MDrinksNearMe';
import MSearchModal from './MSearchModal';
import { AuthState, DataState } from '../context/Provider';
import { DrawerActions } from '@react-navigation/native';
import s from '../utils/styles';
import { isEmpty } from '../utils/util';

const CustomDrawerItem = ({
  onPress,
  label,
  active,
  icon,
  mode = 'contained',
  style,
}) => (
  <View style={[styles.customItem, style]}>
    <MButton
      size="small"
      mode={active && mode === 'text' ? 'contained' : mode}
      onPress={onPress}
      icon={icon}
      style={active && mode === 'text' ? { backgroundColor: '#1da1f299' } : {}}>
      {label}
    </MButton>
  </View>
);

const MSidebar = props => {
  const { auth, setAuth } = AuthState();
  const { isAuthenticated } = auth || {};
  const { drinkModalVisible, setDrinkModalVisible } = DataState();
  const { searchModalVisible, setSearchModalVisible } = DataState();
  const activeRoute = props.state.routes[props.state.index].name;
  const { showHeader, setShowHeader } = DataState();

  const navList = [
    { label: 'Home', name: 'dashboard', icon: 'home-outline' },
    {
      label: 'Favorite Location',
      name: 'favorite',
      icon: 'map-marker-outline',
    },
    { label: 'Recommendation', name: 'recommendation', icon: 'star-outline' },
    { label: 'Help', name: 'help', icon: 'progress-question' },
  ];

  const handleSignOut = async () => {
    // await GoogleSignin.signOut();
    setAuth({});
  };

  return (
    <PaperDrawer.Section
      title={
        isAuthenticated ? (
          <View style={s.align_center}>
            {isEmpty(auth.avatar) ? (
              <Avatar.Icon
                style={styles.avatarBG}
                color="white"
                size={48}
                icon="account"
              />
            ) : (
              <Avatar.Image size={48} source={{ uri: auth.avatar }} />
            )}
            <Text style={s.ml5}>
              {`${auth?.firstName ? auth.firstName : ''} ${
                auth?.lastName ? auth.lastName : ''
              } `}
            </Text>
          </View>
        ) : (
          ''
        )
      }
      style={styles.section}
      showDivider={false}>
      <CustomDrawerItem
        style={s.mv5}
        label="Drinks near me"
        onPress={() => {
          setDrinkModalVisible(true);
          setShowHeader(false);
          props.navigation.dispatch(DrawerActions.closeDrawer());
        }}
      />
      <CustomDrawerItem
        style={s.mv5}
        label="Search"
        onPress={() => {
          setSearchModalVisible(true);
          setShowHeader(true);
          props.navigation.dispatch(DrawerActions.closeDrawer());
        }}
      />
      {!isAuthenticated && (
        <>
          <CustomDrawerItem
            style={s.mv5}
            label="Sign In"
            onPress={() => {
              props.navigation.navigate('signIn');
            }}
          />
          <CustomDrawerItem
            style={s.mv5}
            mode="outlined"
            label="Sign Up"
            onPress={() => {
              props.navigation.navigate('signup');
            }}
          />
        </>
      )}
      <Divider style={styles.divider} />
      {navList.map((nav, index) => (
        <CustomDrawerItem
          key={index}
          mode="text"
          icon={nav.icon}
          label={nav.label}
          active={activeRoute === nav.name}
          onPress={() => {
            props.navigation.navigate(nav.name);
          }}
        />
      ))}
      {isAuthenticated && (
        <>
          <CustomDrawerItem
            mode="text"
            icon="account"
            label="Profile"
            active={activeRoute === 'auth'}
            onPress={() => {
              props.navigation.navigate('auth', { id: auth.id });
            }}
          />
          <CustomDrawerItem
            mode="text"
            icon="logout"
            label="Log Out"
            onPress={() => {
              props.navigation.navigate('signIn');
              handleSignOut();
            }}
          />
        </>
      )}
      <MDrinksNearMe
        visible={drinkModalVisible}
        onDismiss={() => setDrinkModalVisible(false)}
      />
      <MSearchModal
        visible={searchModalVisible}
        onDismiss={() => setSearchModalVisible(false)}
      />
    </PaperDrawer.Section>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 30,
  },
  divider: {
    marginVertical: 20,
    borderWidth: 0.2,
    borderColor: '#1da1f2',
  },
  customItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginLeft: 10,
    borderWidth: 0,
  },
  avatarBG: {
    backgroundColor: '#838390',
    marginRight: 10,
  },
});

export default MSidebar;
