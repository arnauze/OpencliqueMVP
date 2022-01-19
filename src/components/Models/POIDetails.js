/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import busy from '../../assets/images/busyLevel/busy.png';
import littleBusy from '../../assets/images/busyLevel/littleBusy.png';
import relaxed from '../../assets/images/busyLevel/relaxed.png';
import ultraBusy from '../../assets/images/busyLevel/ultraBusy.png';
import veryBusy from '../../assets/images/busyLevel/veryBusy.png';
import bars from '../../assets/images/icons/bars.png';
import clubs from '../../assets/images/icons/clubs.png';
import pubs from '../../assets/images/icons/pubs.png';
import iconFiltersGray from '../../assets/images/filters_gray.png';
import iconRelocation from '../../assets/images/relocation-1.png';
import MapScreen from '../Map/MapScreen';
import {isIos, screenHeight} from '../../Utils/functions';

const {width: screenWidth} = Dimensions.get('window');

const maxButtonWidth = (screenWidth - 60) / 2;

export default function POIDetails() {
  const filterActionSheetRef = useRef(null);

  const [pointsFiltered, setPointsFilter] = useState(['Bar', 'Pub', 'Club']);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [busyFilter, setBusyFilter] = useState([
    'relaxed',
    'littleBusy',
    'busy',
    'veryBusy',
    'ultraBusy',
  ]);

  const resetFilters = () => {
    setBusyFilter(['relaxed', 'littleBusy', 'busy', 'veryBusy', 'ultraBusy']);
    setPointsFilter(['Bar', 'Pub', 'Club']);
  };

  const togglePointFilter = pointName => {
    setPointsFilter(
      pointsFiltered.includes(pointName)
        ? pointsFiltered.filter(d => d !== pointName && d !== pointsFiltered)
        : [...pointsFiltered, pointName],
    );
  };

  const toggleBusyFilter = busyLevel => {
    setBusyFilter(
      busyFilter.includes(busyLevel)
        ? busyFilter.filter(d => d !== busyLevel && d !== busyFilter)
        : [...busyFilter, busyLevel],
    );
  };

  const openFilterActionSheet = () => {
    filterActionSheetRef.current?.show();
  };

  return (
    <>
      <View style={{flex: 1, height: 100, position: 'relative'}}>
        <MapScreen busyFilter={busyFilter} pointsFiltered={pointsFiltered} />
        <View style={[styles.mainView, {backgroundColor: 'red'}]}>
          <FiltersButton
            filtersApplied={filtersApplied}
            openFilterActionSheet={openFilterActionSheet}
          />
        </View>
      </View>
      <ActionSheet
        bounceOnOpen={true}
        bounciness={4}
        containerStyle={{backgroundColor: '#ECEFF1'}}
        defaultOverlayOpacity={0.3}
        gestureEnabled={true}
        indicatorColor="#ccc"
        initialOffsetFromBottom={0.95}
        ref={filterActionSheetRef}>
        <ScrollView
          nestedScrollEnabled={true}
          onMomentumScrollEnd={() =>
            filterActionSheetRef.current?.handleChildScrollEnd()
          }>
          <View
            style={{
              backgroundColor: '#ECEFF1',
              flex: 1,
              borderRadius: 20,
            }}>
            <View style={styles.poiPopup}>
              <View style={[styles.whiteBox, styles.pV6]}>
                <View style={styles.detailBox}>
                  <View style={styles.detailBoxInr}>
                    <View style={styles.detailBoxInrLeft}>
                      <Image
                        source={pubs}
                        style={styles.bottomFilterIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={[styles.filterBoxInrRight]}>
                      <TouchableOpacity
                        style={styles.filterBoxRow}
                        onPress={() => {
                          togglePointFilter('Pub');
                        }}
                        disabled={
                          pointsFiltered?.length === 1 &&
                          pointsFiltered.includes('Pub')
                        }>
                        <Text style={styles.filterLabel}>Pubs</Text>
                        <Text
                          style={
                            pointsFiltered.includes('Pub')
                              ? styles.radioDesignfill
                              : styles.radioDesignBoder
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.detailBoxInr}>
                    <View style={styles.detailBoxInrLeft}>
                      <Image
                        source={bars}
                        style={styles.bottomFilterIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.filterBoxInrRight}>
                      <TouchableOpacity
                        style={styles.filterBoxRow}
                        onPress={() => {
                          togglePointFilter('Bar');
                        }}
                        disabled={
                          pointsFiltered?.length === 1 &&
                          pointsFiltered.includes('Bar')
                        }>
                        <Text style={styles.filterLabel}>Bars</Text>
                        <Text
                          style={
                            pointsFiltered.includes('Bar')
                              ? styles.radioDesignfill
                              : styles.radioDesignBoder
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.detailBoxInr}>
                    <View style={styles.detailBoxInrLeft}>
                      <Image
                        source={clubs}
                        style={styles.bottomFilterIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.filterBoxInrRight}>
                      <TouchableOpacity
                        style={[styles.filterBoxRow, styles.borderBottomUnset]}
                        onPress={() => {
                          togglePointFilter('Club');
                        }}
                        disabled={
                          pointsFiltered?.length === 1 &&
                          pointsFiltered.includes('Club')
                        }>
                        <Text style={styles.filterLabel}>Clubs</Text>
                        <Text
                          style={
                            pointsFiltered.includes('Club')
                              ? styles.radioDesignfill
                              : styles.radioDesignBoder
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.whiteBox, styles.pV6, {marginTop: 22}]}>
                <View style={styles.detailBox}>
                  <View style={styles.detailBoxInr}>
                    <View style={styles.detailBoxInrLeft}>
                      <Image
                        source={relaxed}
                        style={styles.bottomFilterIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.filterBoxInrRight}>
                      <TouchableOpacity
                        style={styles.filterBoxRow}
                        onPress={() => {
                          toggleBusyFilter('relaxed');
                        }}
                        disabled={
                          busyFilter?.length === 1 &&
                          busyFilter.includes('relaxed')
                        }>
                        <Text style={styles.filterLabel}>Relaxed</Text>
                        <Text
                          style={
                            busyFilter.includes('relaxed')
                              ? styles.radioDesignfill
                              : styles.radioDesignBoder
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.detailBoxInr}>
                    <View style={styles.detailBoxInrLeft}>
                      <Image
                        source={littleBusy}
                        style={styles.bottomFilterIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.filterBoxInrRight}>
                      <TouchableOpacity
                        style={styles.filterBoxRow}
                        onPress={() => {
                          toggleBusyFilter('littleBusy');
                        }}
                        disabled={
                          busyFilter?.length === 1 &&
                          busyFilter.includes('littleBusy')
                        }>
                        <Text style={styles.filterLabel}>A little busy</Text>
                        <Text
                          style={
                            busyFilter.includes('littleBusy')
                              ? styles.radioDesignfill
                              : styles.radioDesignBoder
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.detailBoxInr}>
                    <View style={styles.detailBoxInrLeft}>
                      <Image
                        source={busy}
                        style={styles.bottomFilterIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.filterBoxInrRight}>
                      <TouchableOpacity
                        style={styles.filterBoxRow}
                        onPress={() => {
                          toggleBusyFilter('busy');
                        }}
                        disabled={
                          busyFilter?.length === 1 &&
                          busyFilter.includes('busy')
                        }>
                        <Text style={styles.filterLabel}>Busy</Text>
                        <Text
                          style={
                            busyFilter.includes('busy')
                              ? styles.radioDesignfill
                              : styles.radioDesignBoder
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.detailBoxInr}>
                    <View style={styles.detailBoxInrLeft}>
                      <Image
                        source={veryBusy}
                        style={styles.bottomFilterIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.filterBoxInrRight}>
                      <TouchableOpacity
                        style={styles.filterBoxRow}
                        onPress={() => {
                          toggleBusyFilter('veryBusy');
                        }}
                        disabled={
                          busyFilter?.length === 1 &&
                          busyFilter.includes('veryBusy')
                        }>
                        <Text style={styles.filterLabel}>Very Busy</Text>
                        <Text
                          style={
                            busyFilter.includes('veryBusy')
                              ? styles.radioDesignfill
                              : styles.radioDesignBoder
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.detailBoxInr}>
                    <View style={styles.detailBoxInrLeft}>
                      <Image
                        source={ultraBusy}
                        style={styles.bottomFilterIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.filterBoxInrRight}>
                      <TouchableOpacity
                        style={[styles.filterBoxRow, styles.borderBottomUnset]}
                        onPress={() => {
                          toggleBusyFilter('ultraBusy');
                        }}
                        disabled={
                          busyFilter?.length === 1 &&
                          busyFilter.includes('ultraBusy')
                        }>
                        <Text style={styles.filterLabel}>Ultra Busy</Text>
                        <Text
                          style={
                            busyFilter.includes('ultraBusy')
                              ? styles.radioDesignfill
                              : styles.radioDesignBoder
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.groupBtns}>
                  <TouchableOpacity
                    onPress={() => {
                      setFiltersApplied(false);
                      filterActionSheetRef.current?.hide();
                      resetFilters();
                    }}>
                    <View style={[styles.resetBtn, {maxWidth: maxButtonWidth}]}>
                      <Text style={styles.blackText}>Reset</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setFiltersApplied(true);
                      filterActionSheetRef.current?.hide();
                    }}>
                    <View
                      style={
                        pointsFiltered.length === 0 && busyFilter.length === 0
                          ? [
                              styles.resetBtn,
                              styles.disableBtn,
                              {maxWidth: maxButtonWidth},
                            ]
                          : [styles.applyBtn, {maxWidth: maxButtonWidth}]
                      }>
                      <Text style={styles.whiteText}>Apply</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ActionSheet>
    </>
  );
}

export class LocateButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.requestLocation();
        }}>
        <Image
          source={iconRelocation}
          style={{
            width: 62,
            height: 62,
            minWidth: 62,
            minHeight: 62,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

class FiltersButton extends React.Component {
  render() {
    const {filtersApplied} = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.openFilterActionSheet();
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
        <Image
          source={iconFiltersGray}
          style={{
            top: 0,
            left: 0,
            width: 62,
            height: 62,
          }}
          resizeMode="contain"
        />
        {filtersApplied && (
          <View
            style={{
              width: 18,
              height: 18,
              top: 2,
              right: -8,
              backgroundColor: '#4361EE',
              borderRadius: 20,
              marginRight: 10,
              position: 'absolute',
            }}
          />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    position: 'absolute',
    top: isIos() ? 40 : 15,
    right: 77,
  },
  androidView: {
    position: 'absolute',
    top: 15,
    right: 77,
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
  whiteBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },

  poiPopup: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  borderBottomUnset: {
    borderBottomWidth: 0,
  },
  bottomFilterIcon: {
    width: 33,
    height: 35,
  },
  filterBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    marginLeft: 15,
  },
  filterBoxInrRight: {
    width: '87%',
  },
  filterLabel: {
    color: '#333333',
    fontSize: 14,
    fontFamily: 'SF PRO Display',
    paddingVertical: 16,
    fontWeight: '800',
  },
  radioDesignBoder: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    width: 25,
    height: 25,
  },
  radioDesignfill: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: '#4361EE',
    overflow: 'hidden',
  },
  groupBtns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingBottom: 40,
  },
  resetBtn: {
    padding: 12,
    backgroundColor: '#fff',
    width: screenWidth / 4 + 75,
    borderRadius: 10,
  },
  applyBtn: {
    padding: 12,
    backgroundColor: '#4361EE',
    width: screenWidth / 4 + 75,
    borderRadius: 10,
  },
  whiteText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'SF PRO Display',
  },
  blackText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'SF PRO Display',
  },
  disableBtn: {
    backgroundColor: '#ccc',
  },
  pV6: {
    paddingVertical: 6,
  },
});
