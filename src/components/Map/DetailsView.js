import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BusynessCard from './BusynessCard';
import DetailsBox from './DetailsBox';
import DetailsHeader from './DetailsHeader';
import PopularityGraph from './PopularityGraph';

export default function DetailsView({closeSheet, selectedPoint}) {
  return (
    <React.Fragment>
      <DetailsHeader closeSheet={closeSheet} selectedPoint={selectedPoint} />
      <PopularityGraph selectedPoint={selectedPoint} />
      <BusynessCard selectedPoint={selectedPoint} />
      <DetailsBox selectedPoint={selectedPoint} />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({});
