import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Image,
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import Spacers from '../constants/Spacers';
import * as ImagePicker from 'expo-image-picker';
import ImagePickerView from './common/ImagePickerView';
import Icon from './common/Icon';
import Colors from '../constants/Colors';
import Style from '../constants/Style';
import Fonts from '../constants/Fonts';

export default function ImagePickerButton() {
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImageSelected = (uri: string) => {
    setImage(uri);
    setModalVisible(false); // Close modal after selection
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ ...styles.topRow, marginBottom: Spacers.xLarge }}>
                <Text style={styles.title}>Add Image</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon
                    name="close-outline"
                    size={Fonts.large}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </View>

              <ImagePickerView onImageSelected={handleImageSelected} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {image ? (
        <>
          <View style={{ position: 'relative' }}>
            <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 0,
                right: 0
              }}
              onPress={() => setImage(null)}>
              <Icon
                name="close-outline"
                size={Fonts.large}
                color={Colors.black}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="attach" color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: Spacers.medium
  },
  modalView: {
    margin: Spacers.medium,
    backgroundColor: Colors.white,
    borderRadius: Style.largeRadius,
    padding: Spacers.large,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginRight: Spacers.medium
  },
  title: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    marginBottom: Spacers.small
  }
});
