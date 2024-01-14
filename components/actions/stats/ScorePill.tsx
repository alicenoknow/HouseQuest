
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserAvatar from '../../UserAvatar';
import Style from '../../../constants/Style';
import Spacers from '../../../constants/Spacers';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

interface ScorePillProps {
    avatarUri: string;
    score: number;
    scoreEmoji: string;
}


const ScorePill: React.FC<ScorePillProps> = ({ avatarUri, score, scoreEmoji }) => {
    return (
        <View style={styles.scorePillContainer}>
            <UserAvatar avatarUri={avatarUri} size="LARGE" />
            <View style={styles.scoreContent}>
                <Text style={styles.score}>{score}</Text>
                <Text style={styles.scoreEmoji}>{scoreEmoji}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scorePillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        backgroundColor: Colors.lightBlue,
        margin: Spacers.small,
        paddingVertical: Spacers.small,
        paddingHorizontal: Spacers.large,
        borderRadius: Style.xLargeRadius,
    },
    scoreContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-end",
    },
    score: {
        fontSize: Fonts.xLarge,
        fontWeight: 'bold',
        marginRight: Spacers.small,
    },
    scoreEmoji: {
        fontSize: Fonts.xLarge,
    },
});

export default ScorePill;
