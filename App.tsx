import React, { useEffect, useState } from "react";
import { StyleSheet, Image, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FAB, Modal, Portal, Provider } from "react-native-paper";
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
  
  const [mapFocus, setMapFocus] = useState({
    latitude: -1.4450688,
    longitude: -48.4605952,
    latitudeDelta:  0.09,
    longitudeDelta: 0.0401,
  });

  const [user, SetUser] = useState<User>();
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!openMenu)
  }

  const CESUPA = [
    {
      title: "Cesupa ARGO",
      description: "Escritório de Tecnologia",
      coord: {
        latitude: -1.4501912,
        longitude: -48.4796603,
        latitudeDelta:  0.09,
        longitudeDelta: 0.0401,
      },
      imagem: CesupaARGO,
    },
    {
      title: "Cesupa SHOPPING",
      description: "Escritório de Direito",
      coord: {
        latitude: -1.4453173,
        longitude: -48.4806399,
        latitudeDelta:  0.09,
        longitudeDelta: 0.0401,
      },
      imagem: CesupaDireito,
    },
    {
      title: "Cesupa Petro",
      description: "Escritório de Engenharia",
      coord: {
        latitude: -1.4482234,
        longitude: -48.478396,
        latitudeDelta:  0.09,
        longitudeDelta: 0.0401,
      },
      imagem: CesupaEng,
    },
    {
      title: "Cesupa Campestre",
      description: "Medicina",
      coord: {
        latitude: -1.4190961,
        longitude: -48.4499243,
        latitudeDelta:  0.09,
        longitudeDelta: 0.0401,
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

    const user: User = {
      title: "Você",
      description: "Sua localização",
      coord:  {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta:  0.09,
        longitudeDelta: 0.0401,
      }
    };

    setMapFocus(user.coord);
    SetUser(user);
  };

  useEffect(() => {
    getLocation();
  }, []);

  
  return (
    <Provider>
      <MapView style={styles.container} region={mapFocus} mapType={"standard"}>
        { user ?
        <Marker
          key={user.description}
          coordinate={user.coord}
          title={user.title}
          description={user.description}
          pinColor="#ff0000"
        /> :
        null}
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
        <Modal visible={openMenu} onDismiss={toggleMenu} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
          <View style={{display: "flex", justifyContent: "space-between"}}>
          <FAB style={styles.fabItem} icon="crosshairs" label= "CESUPA ARGO"
              color= '#053F66'
                onPress ={ () => {setMapFocus(CESUPA[0].coord); toggleMenu()}}/>
          <FAB style={styles.fabItem} icon="crosshairs" label= "CESUPA DIREITO"
              color= '#e75005'
              onPress ={ () => {setMapFocus(CESUPA[1].coord), toggleMenu()}}/>
          <FAB style={styles.fabItem} icon="crosshairs" label= "CESUPA MALCHER"
              color= '#f4d805'
              onPress ={ () => {setMapFocus(CESUPA[2].coord); toggleMenu()}}/>
          <FAB style={styles.fabItem} icon="crosshairs" label= "CESUPA MEDICINA"
              color= '#0bd719'
              onPress ={ () => {setMapFocus(CESUPA[3].coord), toggleMenu()}}/>
          <FAB style={styles.fabItem} icon="pin" label= "USUÁRIO"
              color= '#af1804'
              onPress ={ () => {setMapFocus(user?.coord ? user.coord : mapFocus); toggleMenu()}}/>
          </View>
        </Modal>
        <FAB icon="map-search"
              style={styles.fab}
              color= '#053F66'
              onPress ={toggleMenu}/>
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
  fabItem: {
    margin: 16,
  },
});
