import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {
  currentDayIndex,
  isValidArray,
  screenWidth,
  weekDayName,
} from '../../Utils/functions';
import Graph from '../CustomGraph/Graph';

export default function PopularityGraph({selectedPoint}) {
  const graphIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

  const [graphActiveSlide, setGraphActiveSlide] = useState(graphIndex);

  const graphCarousel = useRef(null);

  const {populartimes} = selectedPoint;
  const popularTimes = populartimes
    ?.filter(data => {
      return data.name === weekDayName(currentDayIndex);
    })
    .map(data => {
      return data.data;
    });

  useEffect(() => {
    setTimeout(() => {
      graphCarousel?.current?.snapToItem(graphIndex, false, false);
    }, 1250);
  }, []);

  const graphPagination = index => {
    return (
      <Pagination
        currentIndex={graphActiveSlide}
        dotsLength={populartimes.length}
        activeDotIndex={graphActiveSlide}
        dotContainerStyle={{marginHorizontal: 3}}
        containerStyle={{
          position: 'absolute',
          bottom: -45,
          justifyContent: 'center',
          width: '100%',
        }}
        dotStyle={{
          width: 5,
          height: 5,
          borderRadius: 5,
          backgroundColor: '#F4F4F4',
        }}
        inactiveDotStyle={{
          width: 5,
          height: 5,
          borderRadius: 5,
        }}
        dotColor={'rgba(0,0,0,0.5)'}
        inactiveDotOpacity={0.6}
        inactiveDotColor={'#ECEFF1'}
        inactiveDotScale={0.9}
      />
    );
  };

  const renderGraph = ({item, index}) => {
    return <Graph key={item.name} {...item}></Graph>;
  };

  return (
    <View style={[styles.whiteBox]}>
      <View>
        <Text style={styles.whiteLightTitleBox}>Forecast</Text>
        <Text
          style={[
            styles.whiteDarkTitleBox,
            {marginBottom: 30, fontStyle: 'italic'},
          ]}>
          tap to see wait time
        </Text>

        {isValidArray(popularTimes) && (
          <View
            style={{
              position: 'relative',
              padding: 0,
              bottom: 20,
            }}>
            <Carousel
              ref={graphCarousel}
              data={populartimes}
              renderItem={renderGraph}
              // currentIndex={graphActiveSlide}
              onSnapToItem={index => {
                setGraphActiveSlide(index);
              }}
              sliderWidth={screenWidth - 70}
              itemWidth={screenWidth - 70}
              inactiveSlideOpacity={0}
            />
            {graphPagination(currentDayIndex)}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  whiteBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 28,
  },
  whiteLightTitleBox: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'SF PRO Display',
    color: '#9A9A9A',
  },
  whiteDarkTitleBox: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
    // fontFamily: 'SF PRO Display',
  },
});
