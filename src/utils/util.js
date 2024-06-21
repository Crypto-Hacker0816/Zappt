import haversineDistance from 'haversine-distance';

export const isEmpty = value =>
  value === undefined ||
  value === 'undefined' ||
  value === null ||
  value === 'null' ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export const dateFormat = value => {
  const date = new Date(value);
  const formattedDate =
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2) +
    '-' +
    date.getFullYear();
  return formattedDate;
};

export const dateTimeFormat = value => {
  const date = new Date(value);
  const formattedDateTime =
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2) +
    ' ' +
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2);
  return formattedDateTime;
};

export const toCamelCase = inputString => {
  return inputString.replace(/[-_]+([a-z])/g, function (match, letter) {
    return letter.toUpperCase();
  });
};

export const toUpperCamelCase = inputString => {
  return inputString
    .replace(/^([a-z])/, (match, letter) => letter.toUpperCase())
    .replace(/[-_]+([a-z])/g, (match, letter) => ' ' + letter.toUpperCase());
};

export const dateFormat1 = value => {
  if (isEmpty(value)) {
    return '';
  }
  let date = value.split(' ')[0];
  if (date.length < 10) {
    date = new Date(date);
    date =
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '/' +
      ('0' + date.getDate()).slice(-2) +
      '/' +
      date.getFullYear();
  }
  return date;
};

export const numberFormat = value => {
  return isEmpty(value) || isNaN(value)
    ? ''
    : parseFloat(value).toFixed(1).replace(/\.0$/, '').toString();
};

export const rad2deg = rad => rad * (180 / Math.PI);

export const deg2rad = deg => deg * (Math.PI / 180);

export const feetToLatitudeDegrees = feet => feet / 364000;

export const feetToLongitudeDegrees = (feet, latitude) =>
  feet / (Math.cos(deg2rad(latitude)) * 364000);

export const isWithinRadius = (point, center, radiusInMeters) => {
  return haversineDistance(point, center) <= radiusInMeters;
};

export const filteredLocations = (allLocations, mapFormData) => {
  const radiusInMeters = mapFormData.distance * 0.3048;

  const centers = mapFormData.markers?.map(marker => ({
    latitude: marker.geometry.location.lat,
    longitude: marker.geometry.location.lng,
  }));

  if (isEmpty(centers)) return [];
  return allLocations.filter(dataPoint => {
    const info = dataPoint.geometry.location;
    return centers.some(center =>
      isWithinRadius(
        {
          latitude: info.lat,
          longitude: info.lng,
        },
        center,
        radiusInMeters,
      ),
    );
  });
};
