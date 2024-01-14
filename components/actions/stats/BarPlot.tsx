import { View, useWindowDimensions, Text, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import Bar from './Bar';
import Colors from '../../../constants/Colors';
import Style from '../../../constants/Style';
import UserAvatar from '../../UserAvatar';
import Fonts from '../../../constants/Fonts';

export interface BarData {
    value: number;
    bottomImage?: string;
}

interface BarChartProps {
    data: ReadonlyArray<BarData>;
}

const BarChart: FC<BarChartProps> = ({ data }) => {
    const chartHeight = 200;
    const { width } = useWindowDimensions();
    const margin = 5;
    const yMaxValue = data.map(it => it.value).reduce((max, current) => (current > max ? current : max));

    const calculateBarHeight = (barValue: BarData) => {
        return (barValue.value / (1.1 * yMaxValue)) * chartHeight;
    };

    const calculateBarWidth = () => {
        return 0.85 * width / data.length - margin * 2;
    };

    return (
        <>
            <View style={styles.container}>
                {data.map((bar, index) => {
                    const barHeight = calculateBarHeight(bar);
                    const barWidth = calculateBarWidth();
                    return (
                        <View key={index.toString()}>
                            <Text style={styles.caption}>
                                {bar.value}
                            </Text>
                            <Bar
                                barMargin={margin}
                                barHeight={barHeight}
                                barWidth={barWidth}
                                totalHeight={chartHeight}
                            />
                            {bar.bottomImage && <View style={styles.bottomImage}><UserAvatar avatarUri={bar.bottomImage} /></View>}
                        </View>
                    );
                })}
            </View>
        </>
    );
};

export default BarChart;


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    bar: {
        backgroundColor: Colors.yellow,
        borderRadius: Style.largeRadius,
        justifyContent: "flex-end",
    },
    caption: {
        alignSelf: "center",
        fontSize: Fonts.large,
        fontWeight: "bold",
    },
    bottomImage: {
        alignItems: "center",
    }
});