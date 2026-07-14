// /components/MarqueeText.js
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function MarqueeText({ text, style, containerStyle }) {
  const [containerW, setContainerW] = useState(0);
  const [shouldScroll, setShouldScroll] = useState(false);
  const translateX = useSharedValue(0);

  const onTextLayout = (e) => {
    const w = e.nativeEvent.layout.width;
    if (containerW > 0 && w > containerW) {
      const distance = w - containerW + 20;
      setShouldScroll(true);
      translateX.value = withDelay(
        1000,
        withRepeat(
          withSequence(
            withTiming(-distance, { duration: distance * 20, easing: Easing.linear }),
            withTiming(-distance, { duration: 800 }),
            withTiming(0, { duration: distance * 20, easing: Easing.linear }),
            withTiming(0, { duration: 800 })
          ),
          -1,
          false
        )
      );
    }
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[styles.container, containerStyle]}
      onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
    >
      <Animated.View style={[styles.textWrap, shouldScroll ? animStyle : undefined]}>
        <Text numberOfLines={1} onLayout={onTextLayout} style={[style, shouldScroll && { flexShrink: 0 }]}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: "hidden", width: "100%" },
  textWrap: { flexDirection: "row" },
});
