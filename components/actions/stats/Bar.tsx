import { View, StyleSheet } from 'react-native';
import React, { FC, useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import Style from '../../../constants/Style';

interface BarProps {
    totalHeight: number;
    barHeight: number;
    barWidth: number;
    barMargin: number;
}

const Bar: FC<BarProps> = ({ totalHeight, barHeight, barWidth, barMargin }) => {
    const animatedHeight = useSharedValue<number>(0);

    useEffect(() => {
        animatedHeight.value = withTiming(barHeight);
    }, [barHeight, animatedHeight]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: animatedHeight.value,
        };
    });

    return (
        <View
            style={[
                styles.barContainer,
                { marginHorizontal: barMargin },
                { height: totalHeight, width: barWidth },
            ]}
        >
            <Animated.View
                style={[
                    styles.bar,
                    { width: barWidth },
                    animatedStyle,
                ]}
            />
        </View>
    );
};

export default Bar;


const styles = StyleSheet.create({
    barContainer: {
        backgroundColor: Colors.lightGrey,
        flexDirection: "row",
        borderRadius: Style.largeRadius,
        borderBottomLeftRadius: Style.radius,
        borderBottomRightRadius: Style.radius,
    },
    bar: {
        backgroundColor: Colors.yellow,
        borderRadius: Style.largeRadius,
        borderBottomLeftRadius: Style.radius,
        borderBottomRightRadius: Style.radius,
        alignSelf: "flex-end",
    }
});

