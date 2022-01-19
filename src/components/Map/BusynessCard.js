import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {renderMarkerImage} from '../../data/marker';
import {
  current24Time,
  currentDayIndex,
  currentLiveStatus,
  getFormattedHours,
  isValidArray,
  progressBar,
  screenWidth,
  weekDayName,
} from '../../Utils/functions';

export default function BusynessCard({selectedPoint}) {
  const getBusyTimeSlot = (data, hourType) => {
    let setData = {};
    if (isValidArray(data)) {
      data.forEach((d, i) => {
        if (data[i + 3]) {
          setData[`${getFormattedHours(i)} to ${getFormattedHours(i + 3)}`] =
            d + data[i + 3];
        }
      });
      const validVal = Object.values(setData).map(d => {
        return Number(d);
      });
      const maxBusyValue =
        hourType === 'busy' ? Math.max(...validVal) : Math.min(...validVal);

      if (Number.isFinite(maxBusyValue)) {
        let maxValueKey = '';
        Object.keys(setData).forEach((d, i) => {
          if (setData[d] === maxBusyValue) {
            maxValueKey = d;
          }
        });

        return maxValueKey;
      }
      return '';
    }
    return '';
  };

  const {populartimes} = selectedPoint;

  const popularTimes = populartimes
    ?.filter(data => {
      return data.name === weekDayName(currentDayIndex);
    })
    .map(data => {
      return data.data;
    });

  const busyTime = getBusyTimeSlot(popularTimes?.[0], 'busy');
  const quietHour = getBusyTimeSlot(popularTimes?.[0], 'quiet');

  const avgLessMore = selectedPoint?.populartimes?.map(data => {
    return data.data[current24Time];
  });
  const avgBusyness =
    avgLessMore && avgLessMore?.reduce((a, b) => a + b) / avgLessMore?.length;
  const lessOrMore =
    selectedPoint?.current_popularity === 0
      ? ' Usual busy'
      : selectedPoint?.current_popularity > avgBusyness
      ? `+${parseFloat(avgBusyness).toFixed(0)}% more busy then normal`
      : `-${parseFloat(avgBusyness).toFixed(0)}% less busy then normal`;

  const foreCastData = selectedPoint?.populartimes
    ?.filter(data => {
      return data?.name === weekDayName(currentDayIndex);
    })
    .map(data => {
      return data?.data[parseInt(current24Time) + 2];
    });

  const avg =
    popularTimes?.[0]?.reduce((a, b) => a + b) / popularTimes?.[0]?.length;

  return (
    <View style={styles.whiteBox}>
      <View>
        <Text style={styles.whiteLightTitleBox}>Busyness</Text>
        <Text style={styles.whiteDarkTitleBox}>
          {currentLiveStatus(selectedPoint?.current_popularity)}({lessOrMore} )
        </Text>
      </View>
      <View style={styles.whiteMiddleBox}>
        <View style={styles.whiteMiddleBoxLeft}>
          <View style={styles.progressBarBox}>
            <Text style={styles.progressBarTitle}>Live</Text>
            <View style={styles.progressBarOuter}>
              <View
                style={progressBar(
                  true,
                  selectedPoint?.current_popularity,
                )}></View>
            </View>
          </View>
          <View style={styles.progressBarBox}>
            <Text style={styles.progressBarTitle}>Average (Now)</Text>
            <View style={styles.progressBarOuter}>
              <View style={progressBar(false, avg)}></View>
            </View>
          </View>
          <View style={styles.progressBarBox}>
            <Text style={styles.progressBarTitle}>In 2 hours (Forecasted)</Text>
            <View style={styles.progressBarOuter}>
              <View style={progressBar(false, foreCastData[0])}></View>
            </View>
          </View>
        </View>
        <View style={styles.whiteMiddleBoxRight}>
          <Image
            source={renderMarkerImage(
              selectedPoint?.current_popularity,
              selectedPoint?.place_types,
            )}
            style={{width: 100, height: 100, top: 15}}
            resizeMode="contain"></Image>
        </View>
      </View>
      {busyTime && busyTime !== '' && quietHour && quietHour !== '' ? (
        <React.Fragment>
          <View style={styles.borderBox}>
            <Text style={styles.whiteLightTitleBox}>Busy Hours</Text>
            <Text style={[styles.whiteDarkTitleBox, {fontWeight: '400'}]}>
              It will be busy from {busyTime}
            </Text>
          </View>
          <View style={styles.borderBox}>
            <Text style={styles.whiteLightTitleBox}>Quiet Hours</Text>
            <Text style={[styles.whiteDarkTitleBox, {fontWeight: '400'}]}>
              It will be quiet from {quietHour}
            </Text>
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment></React.Fragment>
      )}
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
  whiteMiddleBox: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  whiteMiddleBoxLeft: {
    width: '60%',
  },
  progressBarBox: {
    marginBottom: 15,
  },
  progressBarTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'SF PRO Display',
  },
  progressBarOuter: {
    height: 8,
    width: 154,
    backgroundColor: '#ECEFF1',
    borderRadius: 8,
  },
  progressBarOuter: {
    height: 8,
    width: 154,
    backgroundColor: '#ECEFF1',
    borderRadius: 8,
  },
  whiteMiddleBoxRight: {
    justifyContent: 'center',
    width: screenWidth / 2 + 38,
    // backgroundColor: 'blue',
    // marginBottom:50
  },
  borderBox: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingVertical: 16,
  },
});
