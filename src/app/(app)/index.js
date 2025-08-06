import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "@/lib/supabase";

import {
  useFonts,
  Spartan_500Medium,
  Spartan_600SemiBold,
  Spartan_700Bold,
  Spartan_800ExtraBold,
  Spartan_400Regular,
} from "@expo-google-fonts/spartan";
import { images } from "@/constants/images";

import Login from "./login";

const Stack = createNativeStackNavigator();

const slides = [
  {
    id: 1,
    title: "Meet Doctors Online",
    text: "Connect with Specialized Doctors Online for Convenient and Comprehensive Medical Consultations.",
    image: images.image,
  },
  {
    id: 2,
    title: "Meet Doctors Online",
    text: "Connect with Specialized Doctors Online for Convenient and Comprehensive Medical Consultations.",
    image: images.image1,
  },
  {
    id: 3,
    title: "Meet Doctors Online",
    text: "Connect with Specialized Doctors Online for Convenient and Comprehensive Medical Consultations.",
    image: images.image2,
  },
];

const { width, height } = Dimensions.get("window");

const GetStartedScreen = ({ navigation }) => (
  <View style={styles.container}>
    <ImageBackground
      source={images.splash}
      resizeMethod="auto"
      style={styles.image}
    />
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Onboarding")}
    >
      <Text style={styles.buttonText}>Get Started</Text>
    </TouchableOpacity>
  </View>
);

const SlideItem = ({ item, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.3, 1, 0.3]
    ),
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [0.8, 1, 0.8]
        ),
      },
    ],
  }));

  const [loading, error] = useFonts({
    Spartan_500Medium,
    Spartan_600SemiBold,
    Spartan_700Bold,
    Spartan_800ExtraBold,
    Spartan_400Regular,
  });

  if (!loading && !error) {
    return null;
  }
  return (
    <View style={[styles.slide, { width }]}>
      <Animated.Image
        source={item.image}
        style={[styles.slideimage, animatedStyle]}
        resizeMode="contain"
      />
      <View style={styles.sliderText}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.text}</Text>
      </View>
    </View>
  );
};

const PaginationDots = ({ data, scrollX }) => {
  return (
    <View style={styles.dotsContainer}>
      {data.map((_, index) => {
        const dotStyle = useAnimatedStyle(() => {
          const scale = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.8, 1.4, 0.8],
            "clamp"
          );

          const opacity = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.3, 1, 0.3],
            "clamp"
          );

          return {
            transform: [{ scale }],
            opacity,
          };
        });

        return <Animated.View key={index} style={[styles.dot, dotStyle]} />;
      })}
    </View>
  );
};

const OnboardingScreen = ({ navigation }) => {
  const scrollX = useSharedValue(0);
  const currentIndex = useRef(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      currentIndex.current = Math.round(event.contentOffset.x / width);
    },
  });

  const scrollViewRef = useRef(null);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={scrollViewRef}
        data={slides}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
      <PaginationDots data={slides} scrollX={scrollX} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.replace("Auth")}
        >
          <Text style={styles.nextText}>Skip</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
const AuthScreen = () => (
  <View style={styles.logincontainer}>
    <Login />
  </View>
);

export default function Index() {
  const [initialRoute, setInitialRoute] = useState(null); // State to control the initial route

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setInitialRoute("Auth");
      } else {
        setInitialRoute("GetStarted");
      }
    };

    checkSession();
  }, []);

  if (!initialRoute) {
    // Show a loading indicator while determining the initial route
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C2A3A" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logincontainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#1C2A3A",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    position: "absolute",
    bottom: 100,
    width: 200,
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: 500,
    textAlign: "center",
  },
  slide: {
    flex: 1,
    gap: 20,
    // paddingHorizontal: 40,
  },
  slideimage: {
    width: "100%",
    height: height * 0.6,
    objectFit: "cover",
    marginBottom: 40,
  },
  sliderText: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: "Spartan_600SemiBold",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "Spartan_500Medium",
    color: "#666",
    marginBottom: 40,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  skipButton: {
    padding: 15,
  },
  skipText: {
    color: "#666",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#1C2A3A",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
  },
  nextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Spartan_600SemiBold",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1C2A3A",
    marginHorizontal: 5,
  },
});
