import { StyleSheet, View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import Spacers from '../../../constants/Spacers';
import ActionCard from '../../../components/actions/ActionCard';

export default function Actions() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ActionCard
          color={Colors.yellow}
          title={'Tasks'}
          subtitle={''}
          iconName={'create-outline'}
          iconColor={Colors.black}
          navigateTo={'/(actions)/tasks'}
        />
        <ActionCard
          color={Colors.pink}
          title={'Statistics'}
          subtitle={''}
          iconName={'stats-chart'}
          iconColor={Colors.black}
          navigateTo={'/(actions)/statistics'}
        />
      </View>
      <View style={styles.row}>
        <ActionCard
          color={Colors.pink}
          title={'Rewards'}
          subtitle={''}
          iconName={'trophy-outline'}
          iconColor={Colors.black}
          navigateTo={'/(actions)/rewards'}
        />
        <ActionCard
          color={Colors.yellow}
          title={'Kudos & Slobs'}
          subtitle={''}
          iconName={'flash'}
          iconColor={Colors.black}
          navigateTo={'/(actions)/kudos'}

        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Spacers.xLarge,
    height: '100%',

  },
  subtitle: {
    fontSize: 20,
    marginBottom: -5,
    color: Colors.black,
    marginLeft: 10,
    marginTop: 10,
  },

  row: {
    flexDirection: 'row',
    margin: Spacers.small,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
