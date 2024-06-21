import * as React from 'react';
import { isEmpty } from './util';
import notify from './notify';
import { Icon } from 'react-native-paper';

const APP_BASE_URL = 'https://zappt.app';
const API_BASE_URL = APP_BASE_URL + '/api';
export const GOOGLE_MAP_API_KEY = 'AIzaSyDcW2YYAOG307nbLBYXnvxs_lQraz2kBh0';
export const APP_GOOGLE_CLIENT_ID =
  '272080202810-fjsngm5pm8dv2a8trqedgn8luskg1iu1.apps.googleusercontent.com';
export const ANDROID_GOOGLE_CLIENT_ID =
  '272080202810-dfanbqejjia4ulo0rb0o5ipstupp5smi.apps.googleusercontent.com';
export const IOS_GOOGLE_CLIENT_ID =
  '272080202810-s86159p2009qhckm8t8tiou2blosv2t8.apps.googleusercontent.com';

const headers = new Headers();
const headersFile = new Headers();
headers.append('Content-Type', 'application/json');

export const setAPIHeader = token => {
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    headersFile.set('Authorization', `Bearer ${token}`);
  }
  if (!token) {
    headers.delete('Authorization');
    headersFile.delete('Authorization');
  }
};

async function fetchJson(url, options, onCancel) {
  try {
    return fetch(url, options).then(async response => {
      if (response.status === 204) {
        return null;
      }
      const data = await response.json();
      if (response.status === 403) {
        if (!isEmpty(data.message)) {
          notify(data.message, 'warn');
        }
        return null;
      }
      return data;
    });
  } catch (error) {
    console.log(error);
  }
}

export async function listLocation(signal) {
  const url = new URL(`${API_BASE_URL}/location`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function createLocation(data, signal) {
  const url = `${API_BASE_URL}/location`;
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: data }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function updateLocation(data, signal) {
  const url = `${API_BASE_URL}/location`;
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: data }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function deleteLocation(data, signal) {
  const url = `${API_BASE_URL}/location`;
  const options = {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ data: data }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function listLocationSearch(data, signal) {
  const url = new URL(`${API_BASE_URL}/location/search`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function getLocationDetailByID(id, signal) {
  const url = new URL(`${API_BASE_URL}/location/${id}`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function setLocationRating(data, signal) {
  const url = new URL(`${API_BASE_URL}/location/rate`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function getRatingDataByUserID(signal) {
  const url = new URL(`${API_BASE_URL}/search/getRatingDataByUserID`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function setSuggestionRating(data, signal) {
  const url = new URL(`${API_BASE_URL}/location/suggestion_rate`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function listSearch(data, signal) {
  const url = new URL(`${API_BASE_URL}/search`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function nearDrinks(data, signal) {
  const url = new URL(`${API_BASE_URL}/search/drinks`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function getLocationSuggest(data, signal) {
  const url = new URL(`${API_BASE_URL}/search/suggest`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function handleCreateNewLocations(data, signal) {
  const url = `${API_BASE_URL}/location/locations`;
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function listCheckLocations(data, signal) {
  const url = `${API_BASE_URL}/location/check_locations`;
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function deleteAllNewLocations(signal) {
  const url = new URL(`${API_BASE_URL}/location/new`);
  const options = {
    method: 'DELETE',
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

export async function deleteAllConflictNewLocations(signal) {
  const url = new URL(`${API_BASE_URL}/location/conflict`);
  const options = {
    method: 'DELETE',
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

export async function markAllNewLocationsAsOld(signal) {
  const url = new URL(`${API_BASE_URL}/location/mark`);
  const options = {
    method: 'PUT',
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

export async function getBusinessDetailById(id, signal) {
  const url = new URL(`${API_BASE_URL}/google/${id}`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function listAnalysisData(data, signal) {
  const url = new URL(`${API_BASE_URL}/location/analysis`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function deleteAnalysis(data, signal) {
  const url = `${API_BASE_URL}/location/analysis`;
  const options = {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ data: data }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function deleteAllNotFoundAnalysis(signal) {
  const url = `${API_BASE_URL}/location/analysis/not_found`;
  const options = {
    method: 'DELETE',
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

export async function analyzeData(data, signal) {
  const url = new URL(`${API_BASE_URL}/location/analysis/${data.id}`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function getUserById(id, signal) {
  const url = new URL(`${API_BASE_URL}/auth/${id}`);
  return await fetchJson(url, { headers, signal }, []);
}

////////////////////////////////////////////////////////////////
// Auth api
////////////////////////////////////////////////////////////////

export async function signIn(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/signIn`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function googleSign(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/googleSign`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function signUp(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/signUp`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function forgetPassword(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/forget-password`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function resetPassword(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/reset-password`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

////////////////////////////////////////////////////////////////
// User api
////////////////////////////////////////////////////////////////

export async function setFavoriteLocation(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/set-favorite`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function setViewedLocation(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/set-viewed`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function updateUserProfile(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/profile`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export function getImageURL(url) {
  if (isEmpty(url)) {
    return null;
  }
  return { uri: APP_BASE_URL + url };
}

export async function getListMetrics(data, signal) {
  const url = new URL(`${API_BASE_URL}/search/metrics`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function deleteUser(id, signal) {
  const url = new URL(`${API_BASE_URL}/auth/${id}`);
  const options = {
    method: 'DELETE',
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

////////////////////////////////////////////////////////////////
// Get Recommendation api
////////////////////////////////////////////////////////////////

export async function getRecommendations(data, signal) {
  const url = new URL(`${API_BASE_URL}/search/recommendations`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function getFeaturedLocations(data, signal) {
  const url = new URL(`${API_BASE_URL}/search/featuredLocations`);
  return await fetchJson(url, { headers, signal }, []);
}

////////////////////////////////////////////////////////////////
// Set Image to Cloudinary api
////////////////////////////////////////////////////////////////
export async function uploadFileToServer(data, signal) {
  const url = new URL(`${API_BASE_URL}/auth/file`);
  const options = {
    method: 'POST',
    headers: headersFile,
    body: data,
    signal,
  };
  return fetchJson(url, options);
}

////////////////////////////////////////////////////////////////
// Set Location Owner API
////////////////////////////////////////////////////////////////
export async function setClaimLocation(data, signal) {
  const url = new URL(`${API_BASE_URL}/owner`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}
export async function removeClaimLocation(data, signal) {
  const url = new URL(`${API_BASE_URL}/owner`);
  const options = {
    method: 'DELETE',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function getAllClaims(data, signal) {
  const url = new URL(`${API_BASE_URL}/owner/claims`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function setHandleLocationClaim(data, signal) {
  const url = new URL(`${API_BASE_URL}/owner/approve`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}

export async function getMyClaims(signal) {
  const url = new URL(`${API_BASE_URL}/owner`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function updateEvents(data, signal) {
  const url = new URL(`${API_BASE_URL}/owner/events`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options);
}
