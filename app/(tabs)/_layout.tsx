import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import Icon from '../../components/common/Icon';
import { TodoActionType, TodoProvider, useTodoContext } from '../../contexts/TodoContext';
import { AnnouncementActionType, AnnouncementProvider, useAnnouncementContext } from '../../contexts/AnnouncementsContext';
import { TaskActionType, TaskProvider, useTaskContext } from '../../contexts/TasksContext';
import { RewardsActionType, RewardsProvider, useRewardsContext } from '../../contexts/RewardsContext';
import { KudosOrSlobsActionType, KudosOrSlobsProvider, useKudosOrSlobsContext } from '../../contexts/KudosContext';
import { LocationShareProvider } from '../../contexts/LocationShareContext';
import { useContext, useEffect } from 'react';
import { UserActionType, useUserContext } from '../../contexts/UserContext';
import { fetchAnnouncements, fetchKudosSlobs, fetchMembers, fetchRewards, fetchTasks, fetchTodos } from '../../remote/db';
import { Announcement, KudosOrSlobs, Reward, Task, Todo, User } from '../../models';

// TODO place providers in correct place and fetch data from db on init

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

  useEffect(() => {
    const householdId = state.householdId;

    if (householdId == undefined) {
      // TODO navigate to create household screen or so
      return;
    }

    const fetchDataOnInit = async () => {
      await fetchMembers(householdId,
        (member: User) => userDispatch({
          type: UserActionType.UPDATE_MEMBER,
          member,
        }));

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
    };

    fetchDataOnInit();
  }, []);

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
