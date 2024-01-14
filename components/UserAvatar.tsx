import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Style from '../constants/Style';
import Spacers from '../constants/Spacers';
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';

export type AvatarSize = "SMALL" | "LARGE";

interface UserAvatarProps {
    avatarUri: string;
    name?: string;
    size?: AvatarSize;
}

const UserAvatar = ({ avatarUri, name, size }: UserAvatarProps) => {
    const avatarSize = size === "SMALL" ? 40 : 60;

    return (
        <View style={styles.avatarContainer}>
            <Image
                source={{ uri: avatarUri }}
                style={{ ...styles.avatar, width: avatarSize, height: avatarSize }}
            />
            {name && <View style={styles.captionContainer}>
                <Text style={styles.caption}>{name}</Text>
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        margin: Spacers.small,
    },
    avatar: {
        borderRadius: Style.xLargeRadius,
        margin: Spacers.small,
        marginBottom: 0,
    },
    caption: {
        fontSize: Fonts.medium,
        fontWeight: 'bold',
    },
    captionContainer: {
        alignItems: "center",
        justifyContent: "center",
        alignContent: 'center',
        borderRadius: Style.largeRadius,
        backgroundColor: Colors.lightGrey
    }
});

export default UserAvatar;
