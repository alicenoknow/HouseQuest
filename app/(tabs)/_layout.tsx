import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import Icon from '../../components/common/Icon';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.lightGrey,
      }}>
      <Tabs.Screen
        name="actions"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: 'Todo',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="code" color={color} />
        }}
      />
    </Tabs>
  );
}
