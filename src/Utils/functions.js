import moment from 'moment';
import {Dimensions, Platform} from 'react-native';
import {bars, clubs, pubs} from '../data/marker';

export const {width: screenWidth, height: screenHeight} =
  Dimensions.get('window');

export const isValidObject = data => {
  return typeof data === 'object' && data
    ? Object.keys(data).length > 0
    : false;
};

export const isValidArray = data => {
  return data && Array.isArray(data) && data.length > 0;
};

export const currentDayIndex = moment().day();
export const current24Time = moment().format('H');

export const getFormattedHours = index => {
  return moment({hour: index}).format('ha');
};
MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

DAYS = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  '13th',
  '14th',
  '15th',
  '16th',
  '17th',
  '18th',
  '19th',
  '20th',
  '21st',
  '22nd',
  '23rd',
  '24th',
  '25th',
  '26th',
  '27th',
  '28th',
  '29th',
  '30th',
  '31st',
];

export const busyNessFilters = {
  relaxed: {min: 0, max: 20},
  littleBusy: {min: 21, max: 40},
  busy: {min: 41, max: 60},
  veryBusy: {min: 61, max: 80},
  ultraBusy: {min: 81, max: 100},
};

// "bar": ['Bar', 'Bistro', 'Cocktail bar', 'Stand bar', 'Wine bar', 'Hookah bar', 'Karaoke bar', 'Live music bar', 'Piano bar', 'Gay bar']
// "pub": ['Pub', 'Brewery', 'Lounge', 'Beer hall', 'Irish pub', 'Brewpub']
// "night_club" = ['Night club', 'Disco club', 'Gay night club', 'Club', 'Blues club', 'Jazz club']

export const pointsFilters = {
  bars: ['bar', 'bars', 'Bar'],
  pubs: ['pubs', 'pub', 'Pub'],
  clubs: ['clubs', 'club', 'Club'],
};

export function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,

export const progressBar = (highlight, percentage) => {
  return {
    width:
      parseFloat(percentage).toFixed(0) === 0
        ? 0
        : `${parseFloat(percentage).toFixed(0)}%`,
    backgroundColor: highlight ? '#F72C89' : '#ccc',
    borderRadius: 8,
    height: 8,
  };
};

export const navigateToScreen = (opt = {}, props) => {
  if (opt.pathName && props) {
    props.navigation.push(opt.pathName);
  }
};

export const platform = Platform.OS;

export const isIos = () => {
  return platform === 'ios' ? true : false;
};

export const currentLiveStatus = popularity => {
  if (popularity < 20) {
    return 'Relaxed';
  }
  if (popularity >= 21 && popularity <= 40) {
    return 'A Little Busy';
  }
  if (popularity >= 41 && popularity <= 60) {
    return 'Busy';
  }
  if (popularity >= 61 && popularity <= 80) {
    return 'Very Busy';
  }
  if (popularity >= 81 && popularity <= 100) {
    return 'Ultra busy';
  }
};

export const filterBusyness = (filter, data) => {
  if (filter.toString() === 'relaxed') {
    return data?.popularity < 20;
  }
  if (filter.toString() === 'littleBusy') {
    return data?.popularity >= 21 && data?.popularity <= 40;
  }
  if (filter.toString() === 'busy') {
    return data?.popularity >= 41 && data?.popularity <= 60;
  }
  if (filter.toString() === 'veryBusy') {
    return data?.popularity >= 61 && data?.popularity <= 80;
  }
  if (filter.toString() === 'ultraBusy') {
    return data?.popularity >= 81 && data?.popularity <= 100;
  }
};

export const pointsFilter = place_types => {
  let isBar = false;
  let isPub = false;
  let isClub = false;
  place_types?.map(d => {
    d.map(data => {
      if (!isBar && !isPub && !isClub) {
        isBar = bars.includes(data);
      }
      if (!isBar && !isPub && !isClub) {
        isPub = pubs.includes(data);
      }
      if (!isBar && !isPub && !isClub) {
        isPub = clubs.includes(data);
      }
    });
  });
  return {isBar, isClub, isPub};
};

export const priceLevel = priceLevel => {
  let level = '';
  switch (priceLevel) {
    case 0:
    default:
      level = '$';
      break;
    case 1:
      level = '$';
      break;
    case 2:
      level = '$$';
      break;
    case 3:
      level = '$$$';
      break;
    case 4:
      level = '$$$$';
      break;
  }
  return level;
};

export const weekDayName = dayIndex => {
  let day = '';
  switch (dayIndex) {
    case 0:
      day = 'Sunday';
      break;
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    case 6:
    default:
      day = 'Saturday';
      break;
  }
  return day;
};

export const relDiff = (a, b) => {
  return 100 * Math.abs((a - b) / ((a + b) / 2));
};

export const findIndicesOfMax = (inp, count) => {
  var outp = [];
  for (var i = 0; i < inp.length; i++) {
    outp.push(i); // add index to output array
    if (outp.length > count) {
      outp.sort(function (a, b) {
        return inp[b] - inp[a];
      }); // descending sort the output array
      outp.pop(); // remove the last index (index of smallest element in output array)
    }
  }
  return outp;
};

export const findLargest3 = scoreByPattern => {
  if (scoreByPattern) {
    scoreByPattern.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    return scoreByPattern.slice(0, 3);
  }
};

export const distance = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    const radLat1 = (Math.PI * lat1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radTheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radLat1) * Math.sin(radLat2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') {
      dist = dist * 1.609344;
    }
    if (unit === 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
};
export const getActionSheetProps = () => {
  let common = {
    userInterfaceStyle: 'light',
    theme: 'ios',
  };

  return common;
};

export const actionSheetProps = getActionSheetProps();
