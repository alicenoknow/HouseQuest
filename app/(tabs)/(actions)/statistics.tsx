import React, { useMemo, useState } from 'react';
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
import {
  KSAction,
  KudosOrSlobs,
  Reward,
  RewardStatus,
  Task,
  TaskStatus,
  User
} from '../../../models';
import {
  useKudosOrSlobsContext,
  useRewardsContext,
  useTaskContext
} from '../../../contexts';
import { router } from 'expo-router';
import { verifyHousehold, verifyUser } from '../../../functions/verify';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface PointsItemProps {
  value: number;
  title: string;
  subtitle: string;
}

const Statistics: React.FC = () => {
  const { state } = useUserContext();
  const {
    state: { tasks }
  } = useTaskContext();
  const {
    state: { kudosOrSlobs }
  } = useKudosOrSlobsContext();
  const {
    state: { rewards }
  } = useRewardsContext();
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('LEFT');

  const { user, householdId, householdMembers } = state ?? {};

  if (!verifyUser(user)) {
    console.log('user undefined');
    router.replace('/auth');
    return;
  }

  if (!verifyHousehold(householdId)) {
    console.log('household undefined');
    router.replace('/household');
    return;
  }

  const { id, photoURL, totalPoints, currentPoints } = user;
  const isPointsMode = selectionMode === 'LEFT';

  const getUsersData = (
    data: ReadonlyArray<User>,
    selectionMode: SelectionMode
  ) => {
    if (selectionMode == 'LEFT') {
      return data.map((data) => ({
        value: data.totalPoints,
        bottomImage: data.photoURL
      }));
    }
    return data.map((data) => ({
      value: data.currentPoints,
      bottomImage: data.photoURL
    }));
  };

  const getPointsData = (
    tasks: ReadonlyArray<Task>,
    rewards: ReadonlyArray<Reward>,
    kudosOrSlobs: ReadonlyArray<KudosOrSlobs>
  ): ReadonlyArray<PointsItemProps> => {
    const taskPoints = tasks
      .filter(
        (task) => task.assignee == id && task.status == TaskStatus.CONFIRMED
      )
      .map((task) => ({
        value: task.points ?? 0,
        title: task.title,
        subtitle: 'Task'
      }));
    const rewardsPoints = rewards
      .filter(
        (reward) =>
          reward.recipient == id && reward.status == RewardStatus.GRANTED
      )
      .map((reward) => ({
        value: reward.points ?? 0,
        title: reward.title,
        subtitle: 'Reward'
      }));
    const kudosPoints = kudosOrSlobs
      .filter((kudos) => kudos.receiver == id)
      .map((kudos) => ({
        value: kudos.points ?? 0,
        title: kudos.message,
        subtitle: kudos.type == KSAction.KUDOS ? 'Kudos' : 'Slobs'
      }));
    return [...taskPoints, ...rewardsPoints, ...kudosPoints];
  };

  const pointsData = useMemo(
    () => getPointsData(tasks, rewards, kudosOrSlobs),
    [tasks, rewards, kudosOrSlobs]
  );

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
          avatarUri={photoURL ?? ''}
          score={isPointsMode ? totalPoints : currentPoints}
          scoreEmoji={isPointsMode ? '🔥' : '💲'}
        />
        <View style={styles.divider} />
        <Text style={styles.plotTitle}>
          {isPointsMode ? '🔥 Points Ranking 🔥' : '💲 Coins Ranking 💲'}
        </Text>
        <BarChart data={getUsersData(householdMembers, selectionMode)} />
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pointsData}
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
