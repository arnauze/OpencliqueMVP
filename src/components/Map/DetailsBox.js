/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  currentDayIndex,
  getFormattedHours,
  isIos,
  weekDayName,
} from '../../Utils/functions';
import websiteImg from '../../assets/images/icons/website.png';
import clock from '../../assets/images/icons/clock.png';
import location from '../../assets/images/icons/location.png';
import receiver from '../../assets/images/icons/receiver.png';

const DetailsBox = ({selectedPoint}) => {
  const [isOpenTimings, toggleOpenTimings] = useState(false);
  if (selectedPoint) {
    return (
      <View style={[styles.whiteBox, {marginBottom: isIos() ? 100 : 50}]}>
        <View>
          <Text style={styles.whiteLightTitleBox}>Details</Text>
        </View>
        <View style={styles.detailBox}>
          {selectedPoint?.website !== '' && (
            <React.Fragment>
              <View style={styles.detailBoxInr}>
                <View style={styles.detailBoxInrLeft}>
                  <Image
                    source={websiteImg}
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.detailBoxInrRight}>
                  <TouchableOpacity
                    onPress={() => {
                      selectedPoint?.website &&
                        Linking.openURL(`${selectedPoint?.website}`).catch(
                          err => {
                            // console.error('Failed to Open Browser ', err);
                          },
                        );
                    }}>
                    <Text style={styles.clickable}>
                      {`${selectedPoint?.website}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </React.Fragment>
          )}
          {/* {selectedPoint?.social_url !== '' && (
                        <View style={styles.detailBoxInr}>
                          <View style={styles.detailBoxInrLeft}>
                            <Image
                              source={camera}
                              style={{width: 20, height: 20}}
                              resizeMode="contain"></Image>
                          </View>
                          <View style={styles.detailBoxInrRight}>
                            <Text style={styles.clickable}>N/A</Text>
                          </View>
                        </View>
                      )} */}

          <View style={styles.detailBoxInr}>
            <View style={styles.detailBoxInrLeft}>
              <Image
                source={clock}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                toggleOpenTimings(!isOpenTimings);
              }}
              style={[
                styles.detailBoxInrRight,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <Text style={[styles.SimpleText]}>
                <Text style={{marginRight: 500, padding: 20}}>
                  {selectedPoint?.open_now ? 'Open Now' : 'Closed'}
                </Text>
                <FontAwesome
                  name="chevron-down"
                  backgroundColor="white"
                  color="black"
                />
              </Text>
            </TouchableOpacity>
          </View>
          {isOpenTimings &&
            selectedPoint?.open_hours?.map(d => {
              return (
                <React.Fragment key={d.day}>
                  <View>
                    <View style={styles.dayTimesView}>
                      <Text
                        style={[
                          styles.dayNameText,
                          {
                            fontWeight:
                              weekDayName(currentDayIndex) === d.day
                                ? '700'
                                : '100',
                          },
                        ]}>
                        {d?.day}
                      </Text>
                      <Text
                        style={[
                          styles.openTimeText,
                          {
                            fontWeight:
                              weekDayName(currentDayIndex) === d.day
                                ? '700'
                                : '100',
                          },
                        ]}>
                        {d.hour_open > 0 && d.hour_close > 0
                          ? `${getFormattedHours(
                              d.hour_open,
                            )}-${getFormattedHours(d.hour_close)}`
                          : 'Closed'}
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
          <View style={styles.detailBoxInr}>
            <View style={styles.detailBoxInrLeft}>
              <Image
                source={location}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            </View>
            <View style={styles.detailBoxInrRight}>
              <Text style={styles.SimpleText}>{selectedPoint?.address}</Text>
            </View>
          </View>
          {selectedPoint?.phone_number !== '' && (
            <View style={[styles.detailBoxInr]}>
              <View style={styles.detailBoxInrLeft}>
                <Image
                  source={receiver}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity
                style={styles.detailBoxInrRight}
                onPress={() => {
                  Linking.openURL(`tel:${selectedPoint?.phone_number}`).catch(
                    err => {
                      // console.error('Failed to Dial a Number ', err);
                    },
                  );
                }}>
                <Text style={[styles.SimpleText, styles.borderBottomUnset]}>
                  {selectedPoint?.phone_number}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
};

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
  detailBox: {
    width: '100%',
  },
  detailBoxInr: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginRight: 34,
  },
  detailBoxInrRight: {
    width: '80%',
  },
  clickable: {
    color: '#4361EE',
    textDecorationLine: 'underline',
    fontSize: 14,
    paddingVertical: 17,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    marginLeft: 23,
    width: '100%',
    fontFamily: 'SF PRO Display',
  },
  SimpleText: {
    color: '#333',
    fontSize: 14,
    paddingVertical: 17,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    marginLeft: 23,
    width: '100%',
    fontFamily: 'SF PRO Display',
  },
  dayTimesView: {
    marginLeft: 45,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  openTimeText: {
    marginRight: 20,
    fontFamily: 'SF PRO Display',
    color: '#333',
    fontSize: 14,
  },
  borderBottomUnset: {
    borderBottomWidth: 0,
  },
  dayNameText: {
    marginBottom: 2,
    fontFamily: 'SF PRO Display',
    color: '#333',
    fontSize: 14,
  },
});

export default DetailsBox;
