import "./App.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    Tooltip,
    useMapEvent,
    Popup,
} from "react-leaflet";
import Wkt from "wicket";

import zoneAWkt from "./assets/zone?raw";
import stopAreasImport from "./assets/allStopAreas_gbg.json";
const stopAreas: StopAreas = stopAreasImport;
import { latLng } from "leaflet";
import { PropsWithKey, StopArea, StopAreas } from "./types";
import TypedLocalStore from "typed-local-store";
import { useEffect, useState } from "react";

const wkt = new Wkt.Wkt();
wkt.read(zoneAWkt);
const x = wkt.toJson();

type Storage = { visited: Array<number> };
const typedStorage = new TypedLocalStore<Storage>();

const App = () => {
    type CustomMarkerProps = PropsWithKey<{ stop: StopArea }>;
    const CustomMarker = ({ stop }: CustomMarkerProps) => {
        const [alreadyVisited, setAlreadyVisited] = useState<boolean>();

        useEffect(() => {
            setAlreadyVisited(
                typedStorage.getItem("visited")?.includes(stop.number) ?? false
            );
        }, [stop]);

        const onClick = () => {
            const visited = typedStorage.getItem("visited") as Array<number>;
            if (alreadyVisited) {
                visited.splice(visited.indexOf(stop.number), 1);
            } else {
                visited.push(stop.number);
            }
            typedStorage.setItem("visited", visited);
            setAlreadyVisited((b) => !b);
        };
        return (
            <Marker
                position={latLng(
                    stop.geometry.northingCoordinate,
                    stop.geometry.eastingCoordinate
                )}
                opacity={alreadyVisited ? 0.4 : 1}
            >
                <Popup>
                    {stop.name}
                    <button onClick={onClick}>✅</button>
                </Popup>
            </Marker>
        );
    };

    if (typedStorage.getItem("visited", "safe") === null) {
        typedStorage.setItem("visited", []);
    }

    return (
        <>
            <MapContainer
                center={latLng(57.69174, 11.976385)}
                zoom={13}
                id="map"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <GeoJSON data={x} style={{ color: '#ff0000', opacity: 0.0, fillOpacity: 0.1 }} /> */}

                {stopAreas.stopAreas.map((stop: StopArea) => {
                    if (stop.abbreviation === null) return null;
                    return (
                        <CustomMarker
                            key={stop.number}
                            stop={stop}
                        ></CustomMarker>
                    );
                })}
            </MapContainer>
        </>
    );
};

export default App;
