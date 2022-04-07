import React, { useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FAB, Portal, Provider } from "react-native-paper";
import {CesupaARGO, CesupaDireito, CesupaEng, CesupaMed} from "./Images"

interface User {
  title: string;
  description: string;
  coord: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function App() {
  const zoom = 0.01
  
  const [region, setRegion] = useState({
    latitude: -1.4450688,
    longitude: -48.4605952,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
  });

  const [user, SetUser] = useState<User>();
  const [open, setOpen] = useState(false);

  const CESUPA = [
    {
      title: "Cesupa ARGO",
      description: "Escritório de Tecnologia",
      coord: {
        latitude: -1.4501912,
        longitude: -48.4796603,
        latitudeDelta: zoom,
        longitudeDelta: zoom,
      },
      imagem: CesupaARGO,
    },
    {
      title: "Cesupa SHOPPING",
      description: "Escritório de Direito",
      coord: {
        latitude: -1.4453173,
        longitude: -48.4806399,
        latitudeDelta: zoom,
        longitudeDelta: zoom,
      },
      imagem: CesupaDireito,
    },
    {
      title: "Cesupa Petro",
      description: "Escritório de Engenharia",
      coord: {
        latitude: -1.4482234,
        longitude: -48.478396,
        latitudeDelta: zoom,
        longitudeDelta: zoom,
      },
      imagem: CesupaEng,
    },
    {
      title: "Cesupa Campestre",
      description: "Medicina",
      coord: {
        latitude: -1.4190961,
        longitude: -48.4499243,
        latitudeDelta: zoom,
        longitudeDelta: zoom,
      },
      imagem: CesupaMed,
    },
  ];
  
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const userLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: zoom,
      longitudeDelta: zoom,
    };
    const user: User = {
      title: "Você",
      description: "Sua localização",
      coord: userLocation,
    };

    setRegion(userLocation);
    SetUser(user);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Provider>
      <MapView style={styles.container} region={region} mapType={"standard"}>
        <Marker
          key={user?.description}
          coordinate={user?.coord ? user.coord : region}
          title={user?.title}
          description={user?.description}
          pinColor="#ff0000"
        />
        {CESUPA &&
          CESUPA.map((cesupa) => (
            <Marker
              key={cesupa.title}
              coordinate={cesupa.coord}
              title={cesupa.title}
              description={cesupa.description}
            >
              <Image
                style={{ width: 60, height: 60, borderRadius: 15 }}
                source={cesupa.imagem}
              />
            </Marker>
          ))}
      </MapView>
      <Portal>
        <FAB.Group
          visible={true}
          open={open}
          icon={open ? "crosshairs" : "map-search"}
          actions={[
            {
              icon: "crosshairs",
              label: "CESUPA ARGO",
              color: '#053F66',
              onPress: () => setRegion(CESUPA[0].coord),
            },
            {
              icon: "crosshairs",
              label: "CESUPA DIREITO",
              color: '#e75005',
              onPress: () => setRegion(CESUPA[1].coord),
            },
            {
              icon: "crosshairs",
              label: "CESUPA MALCHER",
              color: '#f4d805',
              onPress: () => setRegion(CESUPA[2].coord),
            },
            {
              icon: "crosshairs",
              label: "CESUPA MEDICINA",
              color: '#0bd719',
              onPress: () => setRegion(CESUPA[3].coord),
            },
            {
              icon: "pin",
              label: "USUÁRIO",
              color: '#af1804',
              onPress: () => setRegion(user?.coord ? user.coord : region),
            },
          ]}
          onStateChange={({ open }) => setOpen(open)}
        />
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
