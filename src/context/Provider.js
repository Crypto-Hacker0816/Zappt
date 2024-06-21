import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAPIHeader } from '../utils/api';
// import { isEmpty } from "../utils/util";

const AuthContext = createContext();
const DataContext = createContext();

const Provider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [isAppReady, setIsAppReady] = React.useState(false);
  setAPIHeader(auth?.token);

  useEffect(() => {
    const getAuthData = async () => {
      const authData = await AsyncStorage.getItem('auth');
      const parsedAuthData = JSON.parse(authData);
      if (!authData || parsedAuthData.rememberMe !== true) {
        setAuth({});
      } else if (
        parsedAuthData &&
        new Date() < new Date(parsedAuthData?.expires_at)
      ) {
        setAuth(parsedAuthData);
      }
      setIsAppReady(true);
    };

    getAuthData();
  }, []);

  useEffect(() => {
    const saveAuthData = async () => {
      if (auth !== null) {
        await AsyncStorage.setItem('auth', JSON.stringify(auth));
      }
    };

    saveAuthData();
  }, [auth]);
  //for search modal
  const [drinkModalVisible, setDrinkModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [loading, setLoading] = useState(false);

  // for user search
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({});
  const [dropDownState, setDropdownState] = useState(false);
  const [excFormData, setExcFormData] = useState({});
  const [mapFormData, setMapFormData] = useState({ distance: 300 });
  const [mostFavoriteLocations, setMostFavoriteLocations] = useState([]);
  const [featuredLocations, setFeaturedLocations] = useState([]);

  // for admin edit data
  const [editLocation, setEditLocation] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAppReady, setIsAppReady }}>
      <DataContext.Provider
        value={{
          tableData,
          setTableData,
          mostFavoriteLocations,
          setMostFavoriteLocations,
          featuredLocations,
          setFeaturedLocations,
          formData,
          setFormData,
          excFormData,
          setExcFormData,
          mapFormData,
          setMapFormData,
          editLocation,
          setEditLocation,
          drinkModalVisible,
          setDrinkModalVisible,
          searchModalVisible,
          setSearchModalVisible,
          loading,
          setLoading,
          dropDownState,
          setDropdownState,
          showHeader,
          setShowHeader,
        }}>
        {children}
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export const AuthState = () => {
  return useContext(AuthContext);
};

export const DataState = () => {
  return useContext(DataContext);
};

export default Provider;
