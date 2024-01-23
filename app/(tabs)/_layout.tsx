import React, { useCallback, useEffect } from 'react';
import { Tabs, router, useRootNavigation } from 'expo-router';
import Colors from '../../constants/Colors';
import Icon from '../../components/common/Icon';
import { TodoActionType, useTodoContext, AnnouncementActionType, useAnnouncementContext, TaskActionType, useTaskContext, UserActionType, useUserContext, KudosOrSlobsActionType, useKudosOrSlobsContext, RewardsActionType, useRewardsContext } from '../../contexts/';
import { LocationShareProvider } from '../../contexts/LocationShareContext';
import { fetchAnnouncements, fetchKudosSlobs, fetchMembers, fetchRewards, fetchTasks, fetchTodos } from '../../remote/db';
import { Announcement, KudosOrSlobs, Reward, Task, Todo, User } from '../../models';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { LoadingActionType, useLoadingContext } from '../../contexts/LoadingContext';
import { Fonts, Spacers } from '../../constants';

export const unstable_settings = {
  initialRouteName: 'index'
};

export default function TabLayout() {
  const { state, dispatch: userDispatch } = useUserContext();
  const { dispatch: todoDispatch } = useTodoContext();
  const { dispatch: announcementsDispatch } = useAnnouncementContext();
  const { dispatch: taskDispatch } = useTaskContext();
  const { dispatch: rewardsDispatch } = useRewardsContext();
  const { dispatch: kudosSlobsDispatch } = useKudosOrSlobsContext();
  const { state: { isLoading }, dispatch: dispatchLoading } = useLoadingContext();
  const { user, householdId } = state;

  const rootNavigation = useRootNavigation();


  const renderLoading = () =>
    <View style={styles.loadingView} >
      <ActivityIndicator size={40} />
      <Text style={styles.loadingText}>⏳ Updating your data, give us a second</Text>
    </View>

  if (!rootNavigation?.isReady()) {
    return renderLoading();
  }

  if (user == undefined) {
    console.log("user undefined")
    router.replace('/auth');
    return;
  }
  if (householdId == undefined) {
    console.log("household undefined")
    router.replace('/household');
    return;
  }


  useEffect(() => {
    const fetchDataOnInit = async () => {
      dispatchLoading({ type: LoadingActionType.CHANGE_STATE, isLoading: true })

      await fetchMembers(householdId,
        (member: User) => {
          if (member.id == user.id) {
            userDispatch({
              type: UserActionType.UPDATE_USER,
              user: member,
            })
          }
          userDispatch({
            type: UserActionType.UPDATE_MEMBER,
            member,
          })
        });

      await fetchTasks(householdId,
        (task: Task) => taskDispatch({
          type: TaskActionType.ADD,
          task
        }));

      await fetchRewards(householdId,
        (reward: Reward) => rewardsDispatch({
          type: RewardsActionType.ADD,
          reward,
        }));

      await fetchKudosSlobs(householdId,
        (kudosOrSlobs: KudosOrSlobs) => kudosSlobsDispatch({
          type: KudosOrSlobsActionType.ADD,
          kudosOrSlobs,
        }));

      await fetchTodos(householdId,
        (todo: Todo) => todoDispatch({
          type: TodoActionType.ADD,
          todo,
        }));

      await fetchAnnouncements(householdId,
        (announcement: Announcement) => announcementsDispatch({
          type: AnnouncementActionType.ADD,
          announcement,
        }));
      dispatchLoading({ type: LoadingActionType.CHANGE_STATE, isLoading: false })
    };
    fetchDataOnInit();
  }, []);

  if (isLoading) {
    return renderLoading();
  }

  return (
    <LocationShareProvider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.lightGrey
        }}>
        <Tabs.Screen
          name="(actions)"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color }) => (
              <Icon name="list-outline" color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="(todo)"
          options={{
            title: 'Todo',
            tabBarIcon: ({ color }) => (
              <Icon name="briefcase-outline" color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Icon name="home-outline" color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="(map)"
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => (
              <Icon name="map-outline" color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <Icon name="person-outline" color={color} />
            )
          }}
        />
      </Tabs>
    </LocationShareProvider >
  );
}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginTop: Spacers.large,
    fontSize: Fonts.medium,
  }
});