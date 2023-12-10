import { StyleSheet, View } from 'react-native';
import ActionCard from '../../components/actionPanel/ActionCard';
import Colors from '../../constants/Colors';
import Spacers from '../../constants/Spacers';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ActionCard
          color={Colors.yellow}
          title={'Tasks'}
          subtitle={''}
          iconName={'create-outline'}
          iconColor={Colors.black}
          navigateTo={'/dashboard'}
        />
        <ActionCard
          color={Colors.pink}
          title={'Statistics'}
          subtitle={''}
          iconName={'stats-chart'}
          iconColor={Colors.black}
          navigateTo={'/dashboard'}
        />
      </View>
      <View style={styles.row}>
        <ActionCard
          color={Colors.pink}
          title={'Rewards'}
          subtitle={''}
          iconName={'trophy-outline'}
          iconColor={Colors.black}
          navigateTo={'/dashboard'}
        />
        <ActionCard
          color={Colors.yellow}
          title={'Kudos & Slobs'}
          subtitle={''}
          iconName={'flash'}
          iconColor={Colors.black}
          navigateTo={'/dashboard'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    margin: Spacers.small,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
