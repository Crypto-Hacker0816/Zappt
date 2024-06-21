import * as React from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MHeader from '../components/MHeader.js';
import MSidebar from '../components/MSidebar.js';
import Search from './Search/index.js';
import LocationDetail from './Location/Detail.js';
import SignIn from './SignIn/index.js';
import SignUp from './SignUp/index.js';
import ForgetPassword from './SignIn/ForgetPassword.js';
import { AuthState, DataState } from '../context/Provider.js';
import FavoriteLocation from './FavoriteLocation/index.js';
import Recommendation from './Recommendation/index.js';
import Help from './Help/index.js';
import BottomTabNavigator from './Navigators/BottomTabNavigators.js';

const Drawer = createDrawerNavigator();

const Layout = () => {
  const { auth } = AuthState();
  const { isAuthenticated } = auth || {};
  const initialRouteName = isAuthenticated ? 'dashboard' : 'signIn';
  const hiddenHeaderScreens = ['signIn', 'signup', 'forgetPassword'];
  const { showHeader, setShowHeader } = DataState();
  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={props => <MSidebar {...props} />}
          screenOptions={route => ({
            header: props => {
              if (
                hiddenHeaderScreens.includes(route.route.name) ||
                !showHeader
              ) {
                return null;
              }
              return <MHeader {...props} />;
            },
            drawerPosition: 'right',
            drawerType: 'front',
            drawerStyle: {
              backgroundColor: 'transparent',
              width: '50%',
            },
          })}
          initialRouteName={initialRouteName}>
          <Drawer.Screen
            name="dashboard"
            initialParams={{ title: 'Home' }}
            component={BottomTabNavigator}
          />
          <Drawer.Screen
            name="favorite"
            initialParams={{ title: 'Favorite Location' }}
            component={FavoriteLocation}
          />
          <Drawer.Screen
            name="recommendation"
            initialParams={{ title: 'Recommendation' }}
            component={Recommendation}
          />
          <Drawer.Screen
            name="help"
            initialParams={{ title: 'Help' }}
            component={Help}
          />
          <Drawer.Screen
            name="search"
            initialParams={{ title: 'Search' }}
            component={Search}
          />
          <Drawer.Screen
            options={{ headerShown: false }}
            name="signIn"
            initialParams={{ title: 'Sign In' }}
            component={SignIn}
          />
          <Drawer.Screen
            options={{ headerShown: false }}
            name="signup"
            initialParams={{ title: 'Sign Up' }}
            component={SignUp}
          />
          <Drawer.Screen
            options={{ headerShown: false }}
            name="forgetPassword"
            initialParams={{ title: 'Forget Password' }}
            component={ForgetPassword}
          />
          <Drawer.Screen
            name="location"
            initialParams={{ title: 'Location Info' }}
            component={LocationDetail}
          />
          <Drawer.Screen
            name="map"
            initialParams={{ title: 'Map View' }}
            component={BottomTabNavigator}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Layout;
