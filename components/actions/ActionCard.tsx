import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Icon, { IconName } from '../common/Icon';
import Spacers from '../../constants/Spacers';
import Style from '../../constants/Style';
import Fonts from '../../constants/Fonts';
import { Link } from 'expo-router';
import { StaticRoutes } from '../../app/routes';
import { Text } from '../Themed';


interface ActionCardProps {
    color: string,
    title: string,
    subtitle: string,
    iconName: IconName,
    iconColor: string,
    navigateTo: StaticRoutes,
}

const ActionCard: React.FC<ActionCardProps> = ({ color, title, subtitle, iconName, iconColor, navigateTo }) => (
    <Link href={navigateTo} style={[styles.button, { backgroundColor: color }]} asChild>
        <Pressable>
            <Icon name={iconName} color={iconColor} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </Pressable>
    </Link>
);

const styles = StyleSheet.create({
    button: {
        width: "45%",
        height: 220,
        padding: Spacers.medium,
        margin: Spacers.medium,
        borderRadius: Style.radius,
    },
    title: {
        fontSize: Fonts.large,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: Fonts.medium,
    },
});

export default ActionCard;
