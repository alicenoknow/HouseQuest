import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Spacers, Colors, Style, Fonts } from '../../../constants';
import { useUserContext } from '../../../contexts';
import Animated, { ReduceMotion, useSharedValue, Easing, withTiming, BounceIn, BounceOut } from 'react-native-reanimated';
import UserAvatar from '../../UserAvatar';
import PieChart from './PieChart';
import { User } from '../../../models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SpinningWheelProps {
    isModalVisible: boolean;
    setModalVisible: (isVisible: boolean) => void;
    setAssignee: (assigneeId: string) => void;
}

export default function SpinningWheelModal({ isModalVisible, setModalVisible, setAssignee }: SpinningWheelProps) {
    const [selectedMember, setSelectedMember] = useState<User>();
    const rotation = useSharedValue(0);

    const { state: { householdMembers } } = useUserContext();

    const handleSpinButton = () => {
        const randomRotation = 10 * Math.random() * 360;
        const householdCount = householdMembers.length;
        const selectedMemberIdx = householdCount - Math.ceil((randomRotation % 360) / (360 / householdCount));

        rotation.value = 0;
        rotation.value = withTiming(randomRotation, {
            duration: 3000,
            easing: Easing.out(Easing.cubic),
            reduceMotion: ReduceMotion.System,
        })

        setTimeout(() => setSelectedMember(householdMembers[selectedMemberIdx]), 3000);
    }

    const onModalClose = () => {
        setModalVisible(false);
        setSelectedMember(undefined);
    }

    const handleConfirmButton = () => {
        selectedMember && setAssignee(selectedMember.id);
        onModalClose();
    }

    const handleCancelButton = () => {
        rotation.value = 0;
        onModalClose();
    }

    const renderSelected = () => {
        if (!selectedMember) return null;
        return <Animated.View
            entering={BounceIn}
            exiting={BounceOut}
            style={styles.selectedContainer}>
            {selectedMember.photoURL && <UserAvatar avatarUri={selectedMember.photoURL} />}
            <View style={styles.selectedTextContainer} >
                <Text style={[styles.mediumText, { flex: 1, textAlign: "center", fontSize: Fonts.xLarge }]}>✨</Text>
                <Text style={[styles.mediumText, { flex: 2, textAlign: "center" }]}>{selectedMember.displayName} was selected!</Text>
                <Text style={[styles.mediumText, { flex: 1, textAlign: "center", fontSize: Fonts.xLarge }]}>✨</Text>
            </View>
        </Animated.View>
    }

    const renderButtons = () => <>
        <TouchableOpacity
            style={[styles.button, styles.buttonSpin, { opacity: !!selectedMember ? 0.6 : 1 }]}
            disabled={!!selectedMember}
            onPress={handleSpinButton}>
            <Text style={[styles.mediumText, {
                color: Colors.black,
            }]}>Spin</Text>
        </TouchableOpacity>
        <View style={styles.actionButtons}>
            <TouchableOpacity
                disabled={!selectedMember}
                style={[styles.button, styles.buttonConfirm, { opacity: !!selectedMember ? 1 : 0.6 }]}
                onPress={handleConfirmButton}>
                <Text style={styles.mediumText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={handleCancelButton} >
                <Text style={styles.mediumText}>Cancel</Text>
            </TouchableOpacity>
        </View></>

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(!isModalVisible)}>
            <ScrollView contentContainerStyle={styles.scrollView} style={styles.centeredView}>
                <View style={styles.chartView}>
                    <View ><Text style={{ fontSize: 100 }}>👇</Text></View>

                    <PieChart rotation={rotation}
                        data={householdMembers.map(m => ({ value: 1, label: m.displayName }))}
                        innerRadius={10}
                        outerRadius={0.8 * (SCREEN_WIDTH / 2)} />
                </View>
                {renderSelected()}
                {renderButtons()}
            </ScrollView>
        </Modal>

    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacers.medium,
    },
    chartView: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginVertical: Spacers.medium,
        marginTop: Spacers.xLarge,
    },
    button: {
        backgroundColor: Colors.yellow,
        marginTop: Spacers.medium,
        padding: Spacers.medium,
        alignItems: 'center',
        borderRadius: Style.radius,
        fontSize: Fonts.large,
    },
    buttonSpin: {
        backgroundColor: Colors.yellow
    },
    buttonConfirm: {
        flex: 1,
        marginRight: Spacers.small,
        backgroundColor: Colors.lightGreen
    },
    buttonCancel: {
        flex: 1,
        marginLeft: Spacers.small,
        backgroundColor: Colors.lightGrey,
    },
    actionButtons: {
        marginBottom: Spacers.medium,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    mediumText: {
        fontSize: Fonts.large,
        color: Colors.black,
        fontWeight: "bold"
    },
    selectedContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: Spacers.small,
    },
    selectedTextContainer: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignContent: "center",
    }
});
