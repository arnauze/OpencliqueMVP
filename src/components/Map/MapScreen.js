/* eslint-disable react-native/no-inline-styles */
import debounce from 'lodash.debounce';
import moment from 'moment';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-map-clustering';
import {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import {connect} from 'react-redux';
import settings from '../../config';
import {customMapStyle} from '../../data/data';
import {heightWidthSize, renderMarkerImage} from '../../data/marker';
import {parsePopularity, removeDuplicates} from '../../modules/utills';
import {fetchPlaceNearBy} from '../../redux/actions/places-near-by';
import {
  busyNessFilters,
  currentDayIndex,
  distance,
  isValidArray,
  isValidObject,
  pointsFilters,
  screenWidth,
  weekDayName,
} from '../../Utils/functions';
import {LocateButton} from '../Models/POIDetails';
import DetailsView from './DetailsView';
import iconRelocation from '../../assets/images/relocation.png';

const {height: screenHeight} = Dimensions.get('window');

const initialData = {
  region: {
    latitude: settings?.defaultPlace?.latitude,
    longitude: settings?.defaultPlace?.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  },
};

export class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialData,
      pointLat: '',
      pointLong: '',
      zoom: Math.round(Math.log(360 / 0.1) / Math.LN2),
      isDisplayFilledPlace: false,
      selectedPoint: {},
      userLatitude: '',
      userLongitude: '',
    };
    this.mapView = null;
    this.superCluster = React.createRef();
    this.actionSheetRef = React.createRef();
    this.markerRef = React.createRef();
    this.loadPointsData = debounce(this.getRenderMarkerData, 1500);
  }

  async componentDidMount() {
    // this.loadPointsData();
    await this.requestLocation();
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) {
      Toast.show('Location Permission is Required');
    }
  }

  requestLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          this.setState(
            {
              userLatitude: position.coords.latitude,
              userLongitude: position.coords.longitude,
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              },
            },
            () => {
              if (hasLocationPermission) {
                this.loadPointsData();
                this.mapView?.animateToRegion(
                  {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  },
                  1000,
                );
              }
            },
          );
        },
        error => {
          if (!hasLocationPermission) {
            Toast.show('Location Permission is Required');
          }
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );
    } else {
      Toast.show('Location Permission is Required');
    }
  };
  hasLocationPermissionIOS = async () => {
    const status = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'denied') {
      Toast.show('Location Permission is Required');
    }
    return status === 'granted';
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    return false;
  };

  openActionSheet = d => {
    this.setState(
      {
        selectedPoint: d,
      },
      this.actionSheetRef?.current?.show(),
    );
  };

  getRenderMarkerData = (lat = '', lng = '') => {
    const {placeNearByDataLoading} = this.props;
    if (!placeNearByDataLoading) {
      const {region, pointLat, pointLong, userLatitude, userLongitude} =
        this.state;

      const passLat = lat || pointLat || region?.latitude;

      const passLong = lng || pointLong || region?.longitude;

      const passData = {
        latitude: passLat,
        longitude: passLong,
        user_latitude: userLatitude,
        user_longitude: userLongitude,
        epoch: moment().unix(),
      };

      const calculateDistance = distance(
        pointLat,
        pointLong,
        passLat,
        passLong,
      );
      // if (calculateDistance > 3) {
      // this.setState({
      //   pointLat: passLat,
      //   pointLong: passLong,
      // });
      this.props.fetchPlaceNearBy(passData);
      // }
    }
  };

  getFilteredData = () => {
    const {placeNearByData, busyFilter, pointsFiltered} = this.props;

    const currentDay = moment().day();
    if (isValidArray(placeNearByData)) {
      let filtered = [...placeNearByData];

      if (isValidArray(busyFilter)) {
        filtered = [];
        Object.keys(busyNessFilters).forEach(d => {
          if (busyFilter.includes(d)) {
            placeNearByData.forEach(place => {
              const {min, max} = busyNessFilters[d];
              if (
                place?.current_popularity >= min &&
                place?.current_popularity <= max &&
                place?.open_now &&
                place?.open_hours[currentDay - 1]?.hour_open > 0 &&
                place?.open_hours[currentDay - 1]?.hour_close > 0
              ) {
                filtered = [...filtered, place];
              }
            });
          }
        });
      }
      if (isValidArray(pointsFiltered)) {
        const list = [...filtered];
        filtered = [];
        list.forEach(place => {
          const selected = pointsFiltered.includes(place?.type);
          if (selected) {
            filtered = [...filtered, place];
          }
        });
      }

      return filtered;
    }

    return [];
  };

  renderMarkers = () => {
    const {zoom} = this.state;
    const newObj = removeDuplicates(this.getFilteredData(), 'place_id') || [];

    return (
      isValidArray(newObj) &&
      newObj
        .filter(
          d =>
            d.place_id &&
            d?.coordinates?.lat &&
            d?.coordinates?.lng &&
            d?.current_popularity,
        )
        .map(d => {
          return (
            <Marker
              key={d?.place_id}
              coordinate={{
                latitude: d.coordinates.lat,
                longitude: d.coordinates.lng,
              }}
              popularity={d?.current_popularity}
              onPress={() => this.openActionSheet(d)}
              placeType={d?.place_types}>
              <View style={{position: 'relative'}}>
                <Image
                  source={renderMarkerImage(
                    d?.current_popularity,
                    d?.place_types,
                  )}
                  style={{
                    width: heightWidthSize(d?.current_popularity),
                    height: heightWidthSize(d?.current_popularity),
                    position: 'relative',
                    left: 7,
                  }}
                  resizeMode="contain"
                />
                {zoom > 10 && (
                  <Text style={{position: 'relative', top: -10}}>
                    {d?.name}
                  </Text>
                )}
              </View>
            </Marker>
          );
        })
    );
  };

  render() {
    const {region, selectedPoint, zoom, userLatitude, userLongitude, pointLat} =
      this.state;
    const {placeNearByDataLoading, pointsFiltered, busyFilter} =
      this.props;

    const newObj = removeDuplicates(this.getFilteredData(), 'place_id') || [];

    const filterPlaceBasedOnRegion = (data, properties) => {
      const highestPopularity = Math.max(
        ...data.map(d => d.properties.popularity),
      );
      const filterPlaceType = data.filter(
        d =>
          d.properties.popularity === highestPopularity &&
          d.properties.placeType,
      );
      const placeType = filterPlaceType[0].properties.placeType;
      return (
        <Image
          source={renderMarkerImage(highestPopularity, placeType)}
          style={{
            width: heightWidthSize(properties?.popularity),
            height: heightWidthSize(properties?.popularity),
          }}
          resizeMode="contain"
        />
      );
    };

    return (
      <React.Fragment>
        {placeNearByDataLoading && (
          <ActivityIndicator
            size="large"
            color="#4361EE"
            style={styles.loading}
          />
        )}

        <MapView
          showsMyLocationButton={false}
          loadingEnabled={true}
          loadingBackgroundColor="#4361EE"
          provider={PROVIDER_GOOGLE}
          superClusterRef={this.superCluster}
          initialRegion={region}
          style={{flex: 1}}
          customMapStyle={customMapStyle}
          rotateEnabled={false}
          showsUserLocation={true}
          onRegionChangeComplete={d => {
            let zoom = Math.round(Math.log(360 / d.longitudeDelta) / Math.LN2);
            this.setState({
              zoom: zoom,
              pointLat: d?.latitude,
              pointLong: d?.longitude,
            });
          }}
          animationEnabled={true}
          clusteringEnabled={true} //cluster on-off
          mapRef={ref => (this.mapView = ref)}
          renderCluster={cluster => {
            const {geometry, properties} = cluster;
            const markers = this.superCluster.current.getLeaves(
              cluster.id,
              Infinity,
            );
            return (
              <Marker
                tracksClusterViewChanges={false}
                preserveClusterPressBehavior={true}
                key={`${geometry.coordinates[0]}_${geometry.coordinates[1]}`}
                coordinate={{
                  longitude: geometry.coordinates[0],
                  latitude: geometry.coordinates[1],
                }}>
                {filterPlaceBasedOnRegion(markers, properties)}
              </Marker>
            );
          }}>
          {isValidArray(newObj) &&
            newObj
              .filter(
                d =>
                  d.place_id &&
                  d?.coordinates?.lat &&
                  d?.coordinates?.lng &&
                  d?.current_popularity,
              )
              .map(d => {
                return (
                  <Marker
                    key={`${d.place_id}+${moment().format('YYYY-MM-DD-HH-mm')}`}
                    coordinate={{
                      latitude: d.coordinates.lat,
                      longitude: d.coordinates.lng,
                    }}
                    popularity={d?.current_popularity}
                    onPress={() => this.openActionSheet(d)}
                    placeType={d?.type}>
                    <View style={{position: 'relative'}}>
                      <Image
                        source={renderMarkerImage(
                          d?.current_popularity,
                          d?.type,
                        )}
                        style={{
                          width: heightWidthSize(d?.current_popularity),
                          height: heightWidthSize(d?.current_popularity),
                          position: 'relative',
                        }}
                        resizeMode="contain"
                      />
                      {zoom > 11 && (
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={{
                              position: 'relative',
                              top: -10,
                              flexWrap: 'wrap',
                              flex: 1,
                              fontSize: 10,
                              textAlign: 'center',
                              maxWidth: 100,
                            }}>
                            {zoom > 12 ? d?.name : d?.name.substring(0, 10)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Marker>
                );
              })}
        </MapView>

        <View style={[styles.container]}>
          <View style={styles.buttonContainer}>
            <LocateButton requestLocation={this.requestLocation} />
          </View>
          <View style={styles.buttonContainer}>
            <SearchButton getRenderMarkerData={this.getRenderMarkerData} />
          </View>
          <View style={[styles.buttonContainer, {opacity: 0}]}>
            <LocateButton requestLocation={this.requestLocation} />
          </View>
        </View>

        <ActionSheet
          ref={this.actionSheetRef}
          initialOffsetFromBottom={0.85}
          containerStyle={{backgroundColor: '#ECEFF1'}}
          indicatorColor="#ECEFF1"
          gestureEnabled={true}
          defaultOverlayOpacity={0.3}
        >
          {isValidObject(selectedPoint) && (
            <ScrollView
              nestedScrollEnabled={true}
              onMomentumScrollEnd={() => {
                setTimeout(() => {
                  this.actionSheetRef?.current?.handleChildScrollEnd();
                }, 0);
              }}>
              <View style={styles.poiPopup}>
                <DetailsView
                  closeSheet={() => {
                    this.actionSheetRef?.current?.hide();
                  }}
                  selectedPoint={selectedPoint}
                />
              </View>
            </ScrollView>
          )}
        </ActionSheet>
      </React.Fragment>
    );
  }
}

export class SearchButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.getRenderMarkerData();
        }}>
        <View
          style={{
            width: 170,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            backgroundColor: 'white',
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOpacity: 0.5,
            elevation: 3,
            shadowRadius: 50,
            shadowOffset: {width: 1, height: 13},
          }}>
          <Text
            style={{
              color: 'black',
              alignSelf: 'center',
              alignItems: 'center',
              fontWeight: '500',
              fontSize: 16,
              fontFamily: 'SF PRO Display',
            }}>
            Search in this area
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  const {isLoading, data} = state?.placeNearByData || {};
  const currentDay = moment().day();
  const currentHour = moment().hours();

  let placeNearByData = isValidArray(data) ? data : [];
  placeNearByData = placeNearByData.map(place => {
    if (
      !place.has_current_popularity &&
      !isNaN(place?.populartimes[currentDay]['data'][currentHour])
    ) {
      const currentPopularity =
        place?.populartimes[currentDay]['data'][currentHour] -
        place?.populartimes[currentDay]['data'][currentHour] * 0.05;
      return {
        ...place,
        current_popularity: parsePopularity(currentPopularity),
      };
    }
    return {
      ...place,
      current_popularity: parsePopularity(place?.current_popularity || 0),
    };
  });
  return {
    placeNearByDataLoading: isLoading,
    placeNearByData,
  };
};
const mapDispatchToProps = {fetchPlaceNearBy};
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 30,
    left: 15,
    alignItems: 'center',
    width: screenWidth - 30,
  },
  buttonContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    alignSelf: 'center',
    top: screenHeight / 7,
    position: 'absolute',
    zIndex: 5,
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 55,
    height: 55,
  },
  poiPopup: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});
