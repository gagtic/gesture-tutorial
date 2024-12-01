import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, SharedValue } from 'react-native-reanimated';




const SIZE = 80
const DAMPING = 10

// for animation 2
// const SCREEN_WIDTH = Dimensions.get('window').width;
// const ADJUST = 40

interface AnimatedPosition {
  x: SharedValue<number>,
  y: SharedValue<number>

}

const useFollowAnimatedPosition = ({ x, y }: AnimatedPosition) => {
  const followX = useDerivedValue(() => {
    return withSpring(x.value, { damping: DAMPING })
  })

  const followY = useDerivedValue(() => {
    return withSpring(y.value, { damping: DAMPING })
  })

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: followX.value }, { translateY: followY.value }]
    }
  })

  return { followX, followY, rStyle }
}

export default function App() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const context = useSharedValue({ x: 0, y: 0 })


  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value }
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x
      translateY.value = event.translationY + context.value.y

    })
    .onEnd(() => {
      translateX.value = 0
      translateY.value = 0

      // Animation 2
      // if (translateX.value > 0 && translateX.value < (SCREEN_WIDTH / 2))
      //   translateX.value = (SCREEN_WIDTH / 2) - (SIZE - ADJUST)
      // else
      //   translateX.value = -(SCREEN_WIDTH / 2) + (SIZE - ADJUST)
    })


  const { followX: blueFollowX, followY: blueFollowY, rStyle: reanimatedBlueCircleStyle } = useFollowAnimatedPosition({ x: translateX, y: translateY })

  const { followX: redFollowX, followY: redFollowY, rStyle: reanimatedRedCircleStyle } = useFollowAnimatedPosition({ x: blueFollowX, y: blueFollowY })

  const { followX: greenFollowX, followY: greenFollowY, rStyle: reanimatedGreebCircleStyle } = useFollowAnimatedPosition({ x: redFollowX, y: redFollowY })
  const { followX: pinkFollowX, followY: pinkFollowY, rStyle: reanimatedPinkCircleStyle } = useFollowAnimatedPosition({ x: greenFollowX, y: greenFollowY })
  const { followX: orangeFollowX, followY: orangeFollowY, rStyle: reanimatedOrangeCircleStyle } = useFollowAnimatedPosition({ x: pinkFollowX, y: pinkFollowY })
  const { rStyle: reanimatedYellowCircleStyle } = useFollowAnimatedPosition({ x: orangeFollowX, y: orangeFollowY })



  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.circle, { backgroundColor: 'red' }, reanimatedRedCircleStyle]} />
      <Animated.View style={[styles.circle, { backgroundColor: 'green' }, reanimatedGreebCircleStyle]} />
      <Animated.View style={[styles.circle, { backgroundColor: 'pink' }, reanimatedPinkCircleStyle]} />
      <Animated.View style={[styles.circle, { backgroundColor: 'orange' }, reanimatedOrangeCircleStyle]} />
      <Animated.View style={[styles.circle, { backgroundColor: 'yellow' }, reanimatedYellowCircleStyle]} />

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.circle, reanimatedBlueCircleStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    height: SIZE,
    width: SIZE,
    backgroundColor: 'blue',
    borderRadius: SIZE / 2,
    opacity: 0.8
  }
});
