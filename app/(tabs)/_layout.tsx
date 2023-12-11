import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import Icon from '../../components/common/Icon';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.lightGrey,
      }}>
      <Tabs.Screen
        name="(actions)"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(todo)"
        options={{
          title: 'Todo',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />
        }}
      />
      <Tabs.Screen
        name="(map)"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />
        }}
      />
    </Tabs>
  );
}
