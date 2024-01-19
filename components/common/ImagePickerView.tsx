import React, { useCallback, useState } from 'react';
import {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Spacers from '../../constants/Spacers';
import Style from '../../constants/Style';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

interface ImagePickerViewProps {
    onImageSelected: (uri: string) => void;
}

export default function ImagePickerView({ onImageSelected }: ImagePickerViewProps) {
    const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);

    const onGalleryPress = useCallback(async () => {
        try {
            // await ImagePicker.requestMediaLibraryPermissionsAsync();
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                selectionLimit: 1,
            });

            if (!result.canceled) {
                const asset = result.assets.at(0);
                setAsset(asset);
                asset && onImageSelected(asset.uri);
            }
        } catch {
            console.log('Error while reading photo');
        }
    }, []);

    const onCameraPress = async () => {
        try {
            // await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (!result.canceled) {
                const asset = result.assets.at(0);
                setAsset(asset);
                asset && onImageSelected(asset.uri);
            }
        } catch (e) {
            console.log('Error while taking photo ', e);
        }
    }

    return (
        <>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onCameraPress}>
                    <Text style={styles.selectButton}>Take image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onGalleryPress}>
                    <Text style={styles.selectButton}>Select image</Text>
                </TouchableOpacity>
            </View>
            {asset &&
                <View style={styles.imageContainer}>
                    <Image
                        resizeMode="cover"
                        resizeMethod="scale"
                        style={styles.image}
                        source={{ uri: asset.uri }}
                    />
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: Spacers.small,
        justifyContent: "space-around"
    },
    button: {
        backgroundColor: Colors.lightGrey,
        borderRadius: Style.largeRadius,
        padding: Spacers.small,
        paddingHorizontal: Spacers.medium,
    },
    imageContainer: {
        marginVertical: Spacers.medium,
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: Style.radius,
    },
    selectButton: {
        fontSize: Fonts.medium
    }
});


