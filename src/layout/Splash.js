import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Easing, View } from 'react-native';
import images from '../assets/images';
import { AuthState } from '../context/Provider';

export function WithSplashScreen({ children }) {
  const { isAppReady } = AuthState();

  return (
    <>
      {isAppReady && children}

      <Splash isAppReady={isAppReady} />
    </>
  );
}

const LOADING_IMAGE = 'Loading image';
const FADE_IN_IMAGE = 'Fade in image';
const WAIT_FOR_APP_TO_BE_READY = 'Wait for app to be ready';
const FADE_OUT = 'Fade out';
const HIDDEN = 'Hidden';
const text = 'Zappt';

export const Splash = ({ isAppReady }) => {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imagePosition = useRef(new Animated.Value(-150)).current;
  const ellipseScaled = useRef(new Animated.Value(1)).current;
  const ballPositionY = useRef(new Animated.Value(0)).current;
  const [state, setState] = useState(LOADING_IMAGE);
  const animatedValues = useRef(
    text.split('').map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    if (state === FADE_IN_IMAGE) {
      Animated.timing(ellipseScaled, {
        toValue: 0,
        duration: 700,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        Animated.sequence([
          Animated.timing(ballPositionY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(ballPositionY, {
            toValue: 0,
            friction: 5,
            tension: 2,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.timing(imagePosition, {
            toValue: -180,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start();
          setTimeout(() => {
            const animations = animatedValues.map((animatedValue, index) =>
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                delay: 50 * index,
                useNativeDriver: true,
              }),
            );
            Animated.stagger(200, animations).start(() => {
              setState(WAIT_FOR_APP_TO_BE_READY);
            });
          }, 600);
        });
      });
    }
  }, [imageOpacity, imagePosition, animatedValues, state]);

  useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY) {
      if (isAppReady) {
        setState(FADE_OUT);
      }
    }
  }, [isAppReady, state]);

  useEffect(() => {
    if (state === FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 1000,
        delay: 1000,
        useNativeDriver: true,
      }).start(() => {
        setState(HIDDEN);
      });
    }
  }, [containerOpacity, state]);

  if (state === HIDDEN) {
    return null;
  }

  return (
    <Animated.View
      collapsable={false}
      style={[
        style.container,
        {
          opacity: containerOpacity,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent : 'center'
        },
      ]}>
      <View style={{ zIndex: -99, left: '6%' }}>
        <Animated.Image
          source={images.drop_image}
          style={{
            transform: [{ scaleX: ellipseScaled }, { scaleY: ellipseScaled }],
          }}
        />
      </View>
      <Animated.Image
        source={images.logo_white}
        fadeDuration={0}
        onLoad={() => {
          setState(FADE_IN_IMAGE);
        }}
        style={{
          ...style.image,
          opacity: imageOpacity,
          transform: [
            { translateX: imagePosition },
            { translateY: ballPositionY },
          ],
          marginRight: 40,
          zIndex: 99,
        }}
        resizeMode="contain"
      />
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          left: "45%",
          zIndex: 99,
          marginLeft: 7,
        }}>
        {text.split('').map((char, index) => (
          <Animated.Text
            key={index}
            style={{
              opacity: animatedValues[index],
              fontSize: 40,
              fontWeight: 700,
              color: 'white',
              fontFamily: 'roboto',
            }}>
            {char}
          </Animated.Text>
        ))}
      </View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1da1f2',
    alignItems: 'center',
  },
  image: {
    width: 66,
    height: 68,
  },
});
