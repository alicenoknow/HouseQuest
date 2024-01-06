import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import Icon from '../../components/common/Icon';
import { TodoProvider } from '../../contexts/TodoContext';
import { AnnouncementProvider } from '../../contexts/AnnouncementsContext';
import { TaskProvider } from '../../contexts/TasksContext';
import { RewardsProvider } from '../../contexts/RewardsContext';
import { KudosOrSlobsProvider } from '../../contexts/KudosContext';
import { LocationShareProvider } from '../../contexts/LocationShareContext';

// TODO place providers in correct place and fetch data from db on init

export const unstable_settings = {
  initialRouteName: 'index'
};

export default function TabLayout() {
  return (
    <LocationShareProvider>
      <TodoProvider>
        <AnnouncementProvider>
          <TaskProvider>
            <RewardsProvider>
              <KudosOrSlobsProvider>
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
              </KudosOrSlobsProvider>
            </RewardsProvider>
          </TaskProvider>
        </AnnouncementProvider>
      </TodoProvider>
    </LocationShareProvider>
  );
}
