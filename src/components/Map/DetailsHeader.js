/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  currentLiveStatus,
  priceLevel,
  screenWidth,
} from '../../Utils/functions';
import cross from '../../assets/images/icons/cross.png';
import placeImg from '../../assets/images/place-img.png';
// import placeImgTwo from '../../assets/images/place_img_two.jpg';
// import placeImgThree from '../../assets/images/palce_img_three.jpg';

const entries = [
  {
    img: placeImg,
    id: 1,
  },
  {
    img: placeImg,
    id: 2,
  },
  {
    img: placeImg,
    id: 3,
  },
];

export default function DetailsHeader({selectedPoint, closeSheet = {}}) {
  const [activeSlide, setActiveSlide] = useState(1);
  const carousel = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      carousel?.current?.snapToItem(1, false, false);
    }, 1000);
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={[styles.placeImgBox]} key={item.id}>
        <Image source={item.img} style={[styles.placeImg]} />
      </View>
    );
  };
  const pagination = () => {
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        dotContainerStyle={{marginHorizontal: 3}}
        containerStyle={{
          position: 'absolute',
          bottom: -18,
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
        dotColor={'white'}
        inactiveDotOpacity={0.6}
        inactiveDotColor={'#ECEFF1'}
        inactiveDotScale={0.9}
      />
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          closeSheet();
        }}>
        <View style={styles.crossBtn}>
          <Image source={cross} style={{width: 11, height: 11}} />
        </View>
      </TouchableOpacity>
      <Text style={styles.topTitle}>{selectedPoint?.name}</Text>
      <View style={[styles.topTitleDetail]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name="star-sharp"
            backgroundColor="white"
            color="#e9b260"
            size={17}
            style={{bottom: 2}}
          />
          <Text style={{paddingVertical: 5, color: 'gray'}}>
            <Text style={{color: '#e9b260', fontWeight: '700'}}>
              {selectedPoint?.rating}
            </Text>{' '}
            - {selectedPoint?.type} -
            {priceLevel(selectedPoint?.price_level)} -{' '}
            {selectedPoint?.distance?.toFixed(1)}km
          </Text>
        </View>
        <Text style={styles.liveText}>
          <Text style={styles.redText}>Live: </Text>
          {currentLiveStatus(selectedPoint?.current_popularity)}
        </Text>
      </View>
      <View style={{position: 'relative', padding: 0, width: '100%'}}>
        <Carousel
          ref={carousel}
          data={entries}
          renderItem={renderItem}
          onSnapToItem={index => setActiveSlide(index)}
          sliderWidth={screenWidth - 40}
          itemWidth={screenWidth - 41}
          inactiveSlideOpacity={1}
        />
        {pagination()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  crossBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#D4D7D9',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    bottom: 20,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    // fontFamily: 'SFPRODISPLAYBOLD',
  },
  liveText: {
    fontSize: 16,
    color: '#333',
  },
  redText: {
    color: 'red',
  },
  placeImgBox: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 30,
  },
  placeImg: {
    width: '100%',
  },
});
