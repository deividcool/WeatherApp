import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { theme } from '../theme';
import {debounce} from 'lodash';
import { fetchLocations, fetchWeatherForecast } from "../Api/weather";

import { CalendarDaysIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { weatherImages } from "../constants";


export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({})
  
  const handleLocation = (loc) => {
    console.log('loacation: ', loc);
    setLocations([]);
    toggleSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setWeather(data);
      console.log('got forescast: ', data);
    })
  }
  
  const handleSearch = value => {
    if(value.length>2){
      fetchLocations({cityName: value}).then(data=>{
        setLocations(data);
      })
    }
  }
  
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  
  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image blurRadius={70} source={require('../../assets/images/bg.png')}
        className="absolute h-full w-full"
      />
      <SafeAreaView className="flex flex-1">
        <View style={{ height: '7%' }} className="mx-4 relative mt-10 z-50 " >

          <View className="flex-row justify-end items-center rounded-full "
            style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}
          >
            {
              showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search City"
                  placeholderTextColor={'lightgray'}
                  className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                />
              ) : null
            }
            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{ backgroundColor: theme.bgWhite(0.3) }}
              className="rounded-full p-3 m-1"
            >
              <MagnifyingGlassIcon size="25" color="white" />
            </TouchableOpacity>
          </View>
          {
            locations.length != 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                {
                  locations.map((loc, index) => {
                    let showBorder = index + 1 != locations.length;
                    let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                    return (
                      <TouchableOpacity
                        onPress={() => handleLocation(loc)}
                        key={index}
                        className={"flex-row items-center px-4 border-0 p-3 mb-1 " + borderClass}
                      >
                        <MapPinIcon size="25" color="gray" />
                        <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            ) : null
          }
        </View>
        <View className="mx-4 flex justify-around flex-1 mb-2">
          <Text className="text-white text-center text-2xl font-bold">
            {location?.name},
            <Text className="text-lg font-semibold text-gray-300">
              {" "+location?.country}
            </Text>
          </Text>

          <View className="flex-row justify-center">
            <Image
              source={weatherImages[current?.condition?.text]}
              className="w-52 h-52"
            />
          </View>


          <View className="space-y-2">
            <Text className="text-white text-center font-bold text-6xl ml-5">
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-white text-center text-xl tracking-widest">
              {current?.condition.text}
            </Text>
          </View>

          <View className="flex-row justify-between mx-4">
            <View className="flex-row items-center space-x-2">
              <Image source={require('../../assets/icons/wind.png')} className="w-6 h-6" />
              <Text className="text-white font-semibold text-base">
                22km
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <Image source={require('../../assets/icons/drop.png')} className="w-6 h-6" />
              <Text className="text-white font-semibold text-base">
                23%
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <Image source={require('../../assets/icons/sun.png')} className="w-6 h-6" />
              <Text className="text-white font-semibold text-base">
                6:05 AM
              </Text>
            </View>
          </View>

          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-white text-base">Daily forescast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              <View
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{ backgroundColor: theme.bgWhite(0.15) }}
              >
                <Image source={require('../../assets/images/heavyrain.png')} 
                className="w-11 h-11" />
                <Text className="text-white">Monday</Text>
                <Text className="text-white text-xl font-semibold">
                  13&#176;
                </Text>
              </View>
              <View
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{ backgroundColor: theme.bgWhite(0.15) }}
              >
                <Image source={require('../../assets/images/heavyrain.png')} 
                className="w-11 h-11" />
                <Text className="text-white">Tuesday</Text>
                <Text className="text-white text-xl font-semibold">
                  13&#176;
                </Text>
              </View>
              <View
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{ backgroundColor: theme.bgWhite(0.15) }}
              >
                <Image source={require('../../assets/images/heavyrain.png')} 
                className="w-11 h-11" />
                <Text className="text-white">Wednesday</Text>
                <Text className="text-white text-xl font-semibold">
                  13&#176;
                </Text>
              </View>
              <View
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{ backgroundColor: theme.bgWhite(0.15) }}
              >
                <Image source={require('../../assets/images/heavyrain.png')} 
                className="w-11 h-11" />
                <Text className="text-white">Thursday</Text>
                <Text className="text-white text-xl font-semibold">
                  13&#176;
                </Text>
              </View>
              <View
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{ backgroundColor: theme.bgWhite(0.15) }}
              >
                <Image source={require('../../assets/images/heavyrain.png')} 
                className="w-11 h-11" />
                <Text className="text-white">Friday</Text>
                <Text className="text-white text-xl font-semibold">
                  13&#176;
                </Text>
              </View>
              <View
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{ backgroundColor: theme.bgWhite(0.15) }}
              >
                <Image source={require('../../assets/images/heavyrain.png')} 
                className="w-11 h-11" />
                <Text className="text-white">Saturday</Text>
                <Text className="text-white text-xl font-semibold">
                  13&#176;
                </Text>
              </View>
              <View
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{ backgroundColor: theme.bgWhite(0.15) }}
              >
                <Image source={require('../../assets/images/heavyrain.png')} 
                className="w-11 h-11" />
                <Text className="text-white">Sunday</Text>
                <Text className="text-white text-xl font-semibold">
                  13&#176;
                </Text>
              </View>

            </ScrollView>

          </View>


        </View>



      </SafeAreaView>
    </View>
  );
}