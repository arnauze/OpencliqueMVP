export const bars = ['Bar', 'bar', 'BAR'];
export const pubs = ['Pubs', 'pubs', 'PUBS', 'Pub', 'pub', 'PUB'];
export const clubs = ['Clubs', 'clubs', 'CLUBS', 'Club', 'club', 'CLUB'];

export const renderMarkerImage = (popularity, category) => {
  let isBar = false;
  let isPub = false;
  let isClub = false;
  // category?.map(d => {
  //   d.map(data => {
  //     if (!isBar && !isPub && !isClub) {
  //       isBar = bars.includes(data);
  //     }
  //     if (!isBar && !isPub && !isClub) {
  //       isPub = pubs.includes(data);
  //     }
  //     if (!isBar && !isPub && !isClub) {
  //       isClub = clubs.includes(data);
  //     }
  //   });
  // });

  if (category === 'Bar') {
    if (popularity === 0) {
      return require('../assets/images/bar/bar_0.png'); //barZero;
    }
    if (popularity >= 0 && popularity <= 10) {
      return require('../assets/images/bar/bar_10.png'); //barOne;
    }
    if (popularity >= 11 && popularity <= 20) {
      return require('../assets/images/bar/bar_20.png'); // barTwo;
    }
    if (popularity >= 21 && popularity <= 30) {
      return require('../assets/images/bar/bar_30.png'); // barThree;
    }
    if (popularity >= 31 && popularity <= 40) {
      return require('../assets/images/bar/bar_40.png'); // barFour;
    }
    if (popularity >= 41 && popularity <= 50) {
      return require('../assets/images/bar/bar_50.png'); // barFive;
    }
    if (popularity >= 51 && popularity <= 60) {
      return require('../assets/images/bar/bar_60.png'); // barSix;
    }
    if (popularity >= 61 && popularity <= 70) {
      return require('../assets/images/bar/bar_70.png'); // barSeven;
    }
    if (popularity >= 71 && popularity <= 80) {
      return require('../assets/images/bar/bar_80.png'); // barEight;
    }
    if (popularity >= 81 && popularity <= 90) {
      return require('../assets/images/bar/bar_90.png'); // barNine;
    }
    if (popularity >= 91 && popularity <= 100) {
      return require('../assets/images/bar/bar_100.png'); // barTen;
    }
  }
  if (category === 'Pub') {
    if (popularity === 0) {
      return require('../assets/images/pub/pub_0.png'); // pubZero;
    }
    if (popularity >= 0 && popularity <= 10) {
      return require('../assets/images/pub/pub_10.png'); // pubOne;
    }
    if (popularity >= 11 && popularity <= 20) {
      return require('../assets/images/pub/pub_20.png'); // pubTwo;
    }
    if (popularity >= 21 && popularity <= 30) {
      return require('../assets/images/pub/pub_30.png'); // pubThree;
    }
    if (popularity >= 31 && popularity <= 40) {
      return require('../assets/images/pub/pub_40.png'); // pubFour;
    }
    if (popularity >= 41 && popularity <= 50) {
      return require('../assets/images/pub/pub_50.png'); // pubFive;
    }
    if (popularity >= 51 && popularity <= 60) {
      return require('../assets/images/pub/pub_60.png'); // pubSix;
    }
    if (popularity >= 61 && popularity <= 70) {
      return require('../assets/images/pub/pub_70.png'); // pubSeven;
    }
    if (popularity >= 71 && popularity <= 80) {
      return require('../assets/images/pub/pub_80.png'); // pubEight;
    }
    if (popularity >= 81 && popularity <= 90) {
      return require('../assets/images/pub/pub_90.png'); // pubNine;
    }
    if (popularity >= 91 && popularity <= 100) {
      return require('../assets/images/pub/pub_100.png'); // pubTen;
    }
  }
  if (category === 'Club') {
    if (popularity === 0) {
      return require('../assets/images/club/club_0.png'); // clubZero;
    }
    if (popularity >= 0 && popularity <= 10) {
      return require('../assets/images/club/club_10.png'); // clubOne;
    }
    if (popularity >= 11 && popularity <= 20) {
      return require('../assets/images/club/club_20.png'); // clubTwo;
    }
    if (popularity >= 21 && popularity <= 30) {
      return require('../assets/images/club/club_30.png'); // clubThree;
    }
    if (popularity >= 31 && popularity <= 40) {
      return require('../assets/images/club/club_40.png'); // clubFour;
    }
    if (popularity >= 41 && popularity <= 50) {
      return require('../assets/images/club/club_50.png'); // clubFive;
    }
    if (popularity >= 51 && popularity <= 60) {
      return require('../assets/images/club/club_60.png'); // clubSix;
    }
    if (popularity >= 61 && popularity <= 70) {
      return require('../assets/images/club/club_70.png'); // clubSeven;
    }
    if (popularity >= 71 && popularity <= 80) {
      return require('../assets/images/club/club_80.png'); // clubEight;
    }
    if (popularity >= 81 && popularity <= 90) {
      return require('../assets/images/club/club_90.png'); // clubNine;
    }
    if (popularity >= 91 && popularity <= 100) {
      return require('../assets/images/club/club_100.png'); // clubTen;
    }
  }

  // return require('../assets/images/club/club_0.png'); //barZero;'0
};

export const heightWidthSize = popularity => {
  if (popularity > 0 && popularity <= 20) {
    return 50;
  }
  if (popularity => 21 && popularity < 40) {
    return 55;
  }
  if (popularity => 41 && popularity < 61) {
    return 60;
  }
  if (popularity => 61 && popularity < 80) {
    return 65;
  }
  if (popularity => 81 && popularity <= 100) {
    return 100;
  }
};
