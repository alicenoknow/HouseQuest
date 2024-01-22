import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Todo, TodoCategory, TodoStatus } from '../../models';
import { Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { Extrapolation, FadeIn, FadeOut, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Colors, Fonts, Spacers, Style } from '../../constants';
import Icon from '../common/Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TodoListItemProps {
    todo: Todo;
    color: string;
    onDelete: (item: Todo) => void;
    onComplete: (item: Todo) => void;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ todo, color, onDelete, onComplete }) => {
    const [isLoading, setLoading] = useState(false);
    const [toDelete, setToDelete] = useState(false);
    const [toComplete, setToComplete] = useState(false);
    const offset = useSharedValue(0);
    const pressed = useSharedValue(false);
    const absoluteX = useSharedValue(0);

    useEffect(() => {
        if (toDelete) {
            setLoading(true);
            onDelete(todo);
            setLoading(false);
        }
    }, [toDelete]);

    useEffect(() => {
        if (toComplete) {
            setLoading(true);
            onComplete(todo);
            setLoading(false);
        }
    }, [toComplete]);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            { translateX: offset.value },
            { scale: withTiming(pressed.value ? 1.1 : 1) },
        ],
        opacity: pressed.value ? 0.7 : 1,
    }));


    const animatedDoneIcon = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(offset.value, [0, -SCREEN_WIDTH], [1.2, 2.2], Extrapolation.CLAMP) },
        ],
        opacity: withTiming(pressed.value ? 1 : 0),
    }));


    const animatedTrashIcon = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(offset.value, [0, SCREEN_WIDTH], [1.2, 2.2], Extrapolation.CLAMP) },
        ],
        opacity: withTiming(pressed.value ? 1 : 0),
    }));

    const pan = Gesture.Pan()
        .onBegin(() => {
            pressed.value = true;
        })
        .onChange((event) => {
            offset.value = event.translationX;
            absoluteX.value = event.absoluteX;
        })
        .onFinalize(() => {
            if (offset.value > SCREEN_WIDTH / 2 || absoluteX.value > 0.85 * SCREEN_WIDTH) {
                runOnJS(setToDelete)(true);
                offset.value = withSpring(2 * SCREEN_WIDTH);
            } else if (offset.value < -SCREEN_WIDTH / 3 || absoluteX.value < 0.15 * SCREEN_WIDTH) {
                runOnJS(setToComplete)(true);
                offset.value = withSpring(0);
            } else {
                offset.value = withSpring(0);
            }
            pressed.value = false;
        }); (10);

    const isDone = todo.status == TodoStatus.DONE;


    const renderDoneActionIcon = () => {
        return !isDone ? <Animated.View style={[styles.icon, styles.iconDone, animatedDoneIcon]} >
            <Icon name="checkmark-circle-outline" color={Colors.darkGreen} />
        </Animated.View> : null;
    }

    const renderDeleteActionIcon = () =>
        <Animated.View style={[styles.icon, styles.iconTrash, animatedTrashIcon]} >
            <Icon name="trash-outline" color={Colors.pink} />
        </Animated.View>

    const renderItemContent = () =>
        <Animated.View style={[styles.item, { backgroundColor: color }, animatedStyles]}>
            <View style={styles.todoContainer}>
                {isDone ? <Icon name="checkmark-circle-outline" color={Colors.darkGreen} /> : null}
                <Text style={styles.todoText}>{todo.description}</Text>
            </ View>
        </Animated.View>

    return (<GestureDetector gesture={pan}>
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.itemContainer}>
            {renderItemContent()}
            {renderDoneActionIcon()}
            {renderDeleteActionIcon()}
        </Animated.View>
    </GestureDetector >)
};
export default TodoListItem;

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: "row",
        marginHorizontal: Spacers.medium,
        paddingHorizontal: Spacers.large,
        paddingVertical: Spacers.small,
        alignContent: "flex-start",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignSelf: "flex-start",
    },
    item: {
        flex: 1,
        height: 50,
        padding: Spacers.medium,
        fontSize: Fonts.medium,
        borderRadius: Style.largeRadius,
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        alignContent: 'center',
        justifyContent: 'center',
        zIndex: 2,
        top: "30%",
    },
    iconDone: {
        left: 0,
    },
    iconTrash: {
        right: 0,
    },
    todoText: {
        paddingLeft: Spacers.medium,
    },
    todoContainer: {
        flexDirection: "row",
        alignItems: 'center',
    }
});