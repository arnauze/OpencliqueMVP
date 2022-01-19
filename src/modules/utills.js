import {View} from 'react-native';
import settings from '../config';

export const navigateToScreen = (opt = {}, props) => {
  if (opt.pathName && props) {
    props.navigation.push(opt.pathName);
  }
};

export const renderGraphs = index => {
  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View
        style={{
          backgroundColor: 'red',
          height: 60,
          // width: 16,
          top: 50,
          borderRadius: 5,
          flex: 1,
        }}></View>
    </View>
  );
};

export const renderGraph = max => {
  let renderItem = [];
  for (let range = 0; range <= max; range++) {
    renderItem = (
      <View
        style={{
          backgroundColor: 'red',
          height: 60,
          // width: 16,
          top: 50,
          borderRadius: 5,
          flex: 1,
        }}></View>
    );
  }
  return renderItem;
};

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getApiEndpoint = () => {
  return settings.apiUrl.replace(/[^\x20-\x7E]/g, '');
};

export const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

export const parsePopularity = popularity => {
  let value = parseInt(popularity);
  if (value > 100) {
    return 100;
  } else if (value < 1) {
    return 0;
  }
  return value;
};
