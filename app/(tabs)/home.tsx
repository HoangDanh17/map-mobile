import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import ImageViewing from "react-native-image-viewing";

const ImageModal = () => {
  const [visible, setVisible] = useState(false);
  const images = [
    { uri: "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" },
    { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR__zJOFi3ef7eGRIlVWo2DKdUXKrCq8dBwtQ&s" },
    { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf6zoRR_FPG7f2knECoYTgOuETejMYPg71vg&s" },
  ];

  return (
    <View style={styles.container}>
      {images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => setVisible(true)}>
          <Image source={{ uri: image.uri }} style={styles.thumbnail} />
        </TouchableOpacity>
      ))}
      <ImageViewing
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        backgroundColor="#00000092"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 8,
  },
});

export default ImageModal;
