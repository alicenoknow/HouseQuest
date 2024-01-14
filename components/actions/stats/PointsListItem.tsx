import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../../common/Icon';
import Colors from '../../../constants/Colors';
import Spacers from '../../../constants/Spacers';
import Fonts from '../../../constants/Fonts';

interface PointsListItem {
    value: number;
    title: string;
    subtitle: string;
}

const PointsListItem = ({ value, title, subtitle }: PointsListItem) => {
    const valueColor = value > 0 ? Colors.darkGreen : Colors.pink;
    return (
        <View style={styles.transactionItem}>
            <Icon name={value > 0 ? "caret-up-outline" : "caret-down-outline"}
                color={valueColor}
                size={40}
            />
            <View style={styles.details}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <Text style={[styles.points, { color: valueColor }]}>{value > 0 ? "+" : ""}{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacers.medium,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
    },
    details: {
        flex: 1,
        marginLeft: Spacers.large,
    },
    title: {
        fontSize: Fonts.medium,
        fontWeight: 'bold',
    },
    subtitle: {
        color: Colors.darkGrey,
    },
    points: {
        fontSize: Fonts.medium,
        fontWeight: 'bold',
        marginHorizontal: Spacers.medium,
    },
});

export default PointsListItem;
