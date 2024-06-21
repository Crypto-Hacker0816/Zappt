import Toast from 'react-native-toast-message';

const notify = (message, type) => {
  if (type === 'success') {
    return Toast.show({
      type: 'success',
      text1: message,
    });
  } else if (type === 'warn') {
    return Toast.show({
      type: 'info',
      text1: message,
    });
  } else if (type === 'error') {
    return Toast.show({
      type: 'error',
      text1: message,
    });
  }
};

export default notify;
