import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import Style from '../../../constants/Style';
import Fonts from '../../../constants/Fonts';

export type SelectionMode = "LEFT" | "RIGHT";

interface AnimatedSwitchProps {
    defaultSelectionMode?: SelectionMode;
    option1: string;
    option2: string;
    color: string;
    onSelectSwitch: (value: SelectionMode) => void;
}

const AnimatedSwitch = ({
    defaultSelectionMode,
    option1,
    option2,
    color,
    onSelectSwitch,
}: AnimatedSwitchProps) => {
    const [selectionMode, setSelectionMode] = useState<SelectionMode>(defaultSelectionMode ?? "LEFT");

    const updatedSwitchData = (value: SelectionMode) => {
        setSelectionMode(value);
        onSelectSwitch(value);
    };

    const getBackgroundColor = (side: SelectionMode, value: SelectionMode) => {
        if (side == value) {
            return color;
        } else {
            return Colors.lightGrey;
        }
    }

    const getTextColor = (side: SelectionMode, value: SelectionMode) => {
        if (side == value) {
            return Colors.white
        } else {
            return Colors.black;
        }
    }

    return (
        <View>
            <View
                style={styles.container}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => updatedSwitchData("LEFT")}
                    style={[styles.toggle, { backgroundColor: getBackgroundColor("LEFT", selectionMode) }]}>
                    <Text style={[styles.text, { color: getTextColor("LEFT", selectionMode) }]}>
                        {option1}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => updatedSwitchData("RIGHT")}
                    style={[styles.toggle, { backgroundColor: getBackgroundColor("RIGHT", selectionMode) }]}>
                    <Text style={[styles.text, { color: getTextColor("RIGHT", selectionMode) }]}>
                        {option2}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default AnimatedSwitch;

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: "85%",
        backgroundColor: Colors.lightGrey,
        borderRadius: Style.largeRadius,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 2,
    },
    toggle: {
        flex: 1,
        borderRadius: Style.largeRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: Fonts.large,
        fontWeight: "bold",
    }
});