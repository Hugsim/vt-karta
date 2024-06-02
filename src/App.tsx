import "./App.css";
import { MapContainer, TileLayer, Marker, GeoJSON, Popup } from "react-leaflet";
import Wkt from "wicket";

import gbgMuniWkt from "./assets/gbg_polygon?raw";
import stopAreasImport from "./assets/allStopAreas_gbg.json";
const stopAreas: StopAreas = stopAreasImport;
import { latLng } from "leaflet";
import { PropsWithKey, StopArea, StopAreas } from "./types";
import TypedLocalStore from "typed-local-store";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";

const wkt = new Wkt.Wkt();
wkt.read(gbgMuniWkt);
const municipality = wkt.toJson();

export type StopCompletion = { name: string; stopId: number; at: Date };
type Storage = { visited: Array<StopCompletion> };
const typedStorage = new TypedLocalStore<Storage>();

type CustomMarkerProps = PropsWithKey<{
    stop: StopArea;
    visited: Array<StopCompletion>;
    setVisited: (newVisited: Array<StopCompletion>) => void;
}>;
const CustomMarker = ({ stop, visited, setVisited }: CustomMarkerProps) => {
    const alreadyVisited = visited.some((s) => s.stopId === stop.number);
    const onClick = () => {
        if (alreadyVisited) {
            visited.splice(
                visited.findIndex((s) => s.stopId === stop.number),
                1
            );
        } else {
            visited.push({
                stopId: stop.number,
                at: new Date(),
                name: stop.name,
            });
        }
        setVisited(visited);
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
                <div className="popup-contents">
                    {stop.name}
                    <button onClick={onClick}>
                        {alreadyVisited ? "❌" : "✅"}
                    </button>
                </div>
            </Popup>
        </Marker>
    );
};

const App = () => {
    if (typedStorage.getItem("visited", "safe") === null) {
        typedStorage.setItem("visited", []);
    }

    const [visited, setVisited] = useState<Array<StopCompletion>>(
        (typedStorage.getItem("visited", "safe") as Array<StopCompletion>).map(
            (stop) => {
                return { ...stop, at: new Date(stop.at) };
            }
        )
    );

    const updateVisited = (newVisited: Array<StopCompletion>) => {
        setVisited([...newVisited]);
    };

    useEffect(() => {
        typedStorage.setItem("visited", visited);
    }, [visited]);

    return (
        <>
            <MapContainer
                center={latLng(57.69174, 11.976385)}
                zoom={13}
                className="map"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON
                    data={municipality}
                    style={{ color: "#0000ff", opacity: 0.0, fillOpacity: 0.1 }}
                />

                {stopAreas.stopAreas.map((stop: StopArea) => {
                    if (stop.abbreviation === null) return null;
                    return (
                        <CustomMarker
                            key={stop.number}
                            stop={stop}
                            visited={visited}
                            setVisited={updateVisited}
                        ></CustomMarker>
                    );
                })}
            </MapContainer>
            <Sidebar visited={visited}></Sidebar>
        </>
    );
};

export default App;
