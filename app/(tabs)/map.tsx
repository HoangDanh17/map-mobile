import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

interface UserLocation {
  id: string;
  name: string;
  age: number;
  address: string;
  avatar: string;
  coordinate: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const LocationMapScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dummyUserLocations: UserLocation[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      age: 30,
      address: "123 Đường A, TP. HCM",
      avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      coordinate: {
        latitude: 10.7756,
        longitude: 106.7022,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
    },
    {
      id: "2",
      name: "Trần Thị B",
      age: 25,
      address: "456 Đường B, TP. HCM",
      avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      coordinate: {
        latitude: 10.776,
        longitude: 106.703,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
    },
    {
      id: "3",
      name: "Lê Văn C",
      age: 40,
      address: "789 Đường C, TP. HCM",
      avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      coordinate: {
        latitude: 10.775,
        longitude: 106.7015,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
    },
    {
      id: "4",
      name: "Phạm Thị D",
      age: 28,
      address: "101 Đường D, TP. HCM",
      avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      coordinate: {
        latitude: 10.7765,
        longitude: 106.704,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Quyền truy cập vị trí bị từ chối");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (location) {
        setLocation(location);
      }
    })();
  }, []);

  const defaultRegion = {
    latitude: 10.7769,
    longitude: 106.7009,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => setSelectedUser(null)}
      style={{ marginTop: 40 }}
    >
      <View style={styles.container}>
        {location ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation
            showsMyLocationButton
            mapPadding={{
              top: 50,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            initialRegion={defaultRegion}
          >
            {dummyUserLocations.map((user) => (
              <Marker
                key={user.id}
                coordinate={user.coordinate}
                onPress={() => setSelectedUser(user)}
              >
                <View style={styles.markerContainer}>
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                </View>
                <Callout>
                  <Text>{user.name}</Text>
                </Callout>
              </Marker>
            ))}
          </MapView>
        ) : (
          <Text style={styles.errorText}>Đang tải vị trí của bạn...</Text>
        )}
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        {selectedUser && (
          <View style={styles.userCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedUser(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.cardTitle}>{selectedUser.name}</Text>
            <Text>Tuổi: {selectedUser.age}</Text>
            <Text>Địa chỉ: {selectedUser.address}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  errorText: {
    color: "red",
    position: "absolute",
    top: 50,
    backgroundColor: "white",
    padding: 10,
  },
  userCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default LocationMapScreen;
