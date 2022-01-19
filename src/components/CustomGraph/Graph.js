/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {currentDayIndex, isIos, weekDayName} from '../../Utils/functions';
import xAxis from '../../assets/images/x_axis.png';

const currentHour = moment().format('H');
const graphGray = '#ECEFF1';
const graphPink = '#F72C89';

const inputStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    height: 10,
    marginRight: 25,
    marginLeft: 0,
    paddingTop: 25,
    paddingBottom: 70,
    borderStyle: 'dotted',
    borderWidth: 2,
    borderColor: '#b7c2c6',
    overflow: 'hidden',
    position: 'relative',
    top: 5,
  },
  topMask: {
    height: 9999,
    width: 9999,
    backgroundColor: 'white',
    position: 'absolute',
    top: -3,
    left: 0,
  },
  rightMask: {
    height: 9999,
    width: 3,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    right: 50,
    left: 50,
  },
  leftMask: {
    backgroundColor: 'red',
    minHeight: 50,
    height: 3,
    width: 3,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: -3,
  },
});

// const loopIndex = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,22,];
export default function Graph({data, name}) {
  const listData = data.map((d, i) => {
    return {popularity: d, isCurrentHour: i == currentHour};
  });

  return (
    <>
      {/* X- AXIS line */}
      {/* <Text>
        {name}
        {weekDayName(currentDayIndex)}
      </Text> */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 80,
        }}>
        <Image source={xAxis} style={{height: 80, width: 4}} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginBottom: 10,
          paddingLeft: 5,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          height: 80,
        }}>
        {[...listData.slice(6), ...listData.slice(0, 6)].map((d, i) => {
          return (
            <React.Fragment key={i}>
              <View
                key={i}
                style={{
                  backgroundColor:
                    d?.isCurrentHour && weekDayName(currentDayIndex) === name
                      ? graphPink
                      : graphGray,
                  height: d?.popularity * 0.85,
                  borderRadius: 5,
                  flex: 1,
                  marginRight: 1,
                }}
              />
            </React.Fragment>
          );
        })}
      </View>

      {/* Y - AXIS Line */}
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          style={{
            backgroundColor: '#ECEFF1',
            height: 2,
            borderRadius: 5,
            flex: 1,
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text />
        </View>
        <View>
          <Text>9a</Text>
        </View>
        <View>
          <Text>12p</Text>
        </View>
        <View>
          <Text>3p</Text>
        </View>
        <View>
          <Text>6p</Text>
        </View>
        <View>
          <Text>9p</Text>
        </View>
        <View>
          <Text />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
