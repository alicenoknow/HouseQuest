import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import AnimatedSwitch, {
  SelectionMode
} from '../../../components/actions/stats/AnimatedSwitch';
import ScorePill from '../../../components/actions/stats/ScorePill';
import { useUserContext } from '../../../contexts/UserContext';
import Spacers from '../../../constants/Spacers';
import Colors from '../../../constants/Colors';
import BarChart from '../../../components/actions/stats/BarPlot';
import Fonts from '../../../constants/Fonts';
import PointsListItem from '../../../components/actions/stats/PointsListItem';

// TODO: change to values from db
const MOCK_USERS_DATA = [
  {
    avatarUri:
      'https://static.wikia.nocookie.net/pkmnshuffle/images/f/f4/Charmander_%28Winking%29.png',
    totalPoints: 123,
    currentPoints: 43
  },
  {
    avatarUri:
      'https://miro.medium.com/v2/resize:fit:302/1*KuSu6ZTyLAcRDwOsI9ZzZA.png',
    totalPoints: 42,
    currentPoints: 32
  },
  {
    avatarUri:
      'https://shop7.webmodule.prestashop.net/pokedoge/11263-large_default/bulbasaur.jpg',
    totalPoints: 78,
    currentPoints: 55
  }
];

// TODO: change to values from db: rewards, kudos, slobs, tasks and filter by our user to get relevant data and transform to ths form
const MOCK_POINTS_DATA = [
  {
    value: 10,
    title: 'Cleaning bathroom',
    subtitle: 'Task'
  },
  {
    value: -5,
    title: 'Left dirty dishes',
    subtitle: 'Slobs'
  },
  {
    value: -7,
    title: 'Ice cream',
    subtitle: 'Reward'
  },
  {
    value: 4,
    title: 'Help in the garden',
    subtitle: 'Kudos'
  }
];

const Statistics: React.FC = () => {
  const { state: userState } = useUserContext();
  const { photoURL, totalPoints, currentPoints } = userState.user ?? {};
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('LEFT');

  const isPointsMode = selectionMode === 'LEFT';

  // TODO user undefined, go to auth
  if (!photoURL || totalPoints == undefined || currentPoints == undefined)
    return null;

  const getData = (data: any[], selectionMode: SelectionMode) => {
    if (selectionMode == 'LEFT') {
      return data.map((data) => ({
        value: data.totalPoints,
        bottomImage: data.avatarUri
      }));
    }
    return data.map((data) => ({
      value: data.currentPoints,
      bottomImage: data.avatarUri
    }));
  };

  const renderListItem = ({ item }: { item: PointsListItem }) => {
    return <PointsListItem {...item} />;
  };

  const renderListHeader = () => {
    return (
      <View style={styles.listHeader}>
        <AnimatedSwitch
          option1="🔥 Points"
          option2="💲 Coins"
          color={Colors.blue}
          defaultSelectionMode={selectionMode}
          onSelectSwitch={setSelectionMode}
        />
        <View style={styles.divider} />
        <ScorePill
          avatarUri={photoURL}
          score={isPointsMode ? totalPoints : currentPoints}
          scoreEmoji={isPointsMode ? '🔥' : '💲'}
        />
        <View style={styles.divider} />
        <Text style={styles.plotTitle}>
          {isPointsMode ? '🔥 Points Ranking 🔥' : '💲 Coins Ranking 💲'}
        </Text>
        <BarChart
          data={getData(
            [{ photoURL, totalPoints, currentPoints }, ...MOCK_USERS_DATA],
            selectionMode
          )}
        />
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_POINTS_DATA}
        style={styles.list}
        ListHeaderComponent={renderListHeader()}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderListItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Spacers.large,
    alignItems: 'center'
  },
  list: {
    flex: 1,
    width: '100%'
  },
  listHeader: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  divider: {
    width: '100%',
    height: Spacers.medium
  },
  plotTitle: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
    margin: Spacers.medium
  }
});

export default Statistics;
