import 'mapbox-gl/dist/mapbox-gl.css';
import { createSignal, Show } from 'solid-js';
import MapGL, { Viewport, Source, Layer, Control } from 'solid-map-gl';
import Line from './Line';
import Polygon from './SurveyedArea';
import UI from './UI';

interface MapCProps {
    class?: string;
}

let NationalGridLines = [
    [1.4194, 51.3355],
    [1.1275, 51.3723],
    [0.84, 51.37],
    [1.1339, 51.7794],
    [1.1846, 51.8092],
    [1.419, 51.9856],
    [1.619, 52.216],
    [1.7305, 52.6083],
    [1.5168, 52.8427],
    [1.1447, 52.9412],
    [0.1755, 52.8006],
    [0.3365, 53.1437],
    [0.3314, 53.2748],
    [0.098, 53.463],
    [0.1328, 53.6344],
    [0.0433, 53.7357],
    [0.178, 54.014],
];
let fishing = [
    [-4.4783, 49.9106],
    [0.6594, 50.2957],
    [-6.1288, 51.361],
    [-5.4077, 53.9255],
];

let geojson = {
    type: 'FeatureCollection',
    features: Array.from({ length: NationalGridLines.length - 1 }, (_, i) => ({
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [NationalGridLines[i], NationalGridLines[i + 1]],
        },
        properties: {},
    })),
};

let geojsonf = {
    type: 'FeatureCollection',
    features: Array.from({ length: fishing.length - 1 }, (_, i) => ({
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [fishing[i], fishing[i + 1]],
        },
        properties: {},
    })),
};

function interpolateCurve(start, end, steps = 100) {
    const path = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = start[0] * (1 - t) + end[0] * t;
        const lon = start[1] * (1 - t) + end[1] * t;
        path.push([lat, lon]);
    }
    return path;
}

let MapC = (props: MapCProps) => {
    const [viewport, setViewport] = createSignal({
        center: [54.702354, -3.276575].reverse(),

        zoom: 5,
    } as Viewport);

    let [path, setPath] = createSignal<number[][]>([]);
    let [coastStart, setCoastStart] = createSignal(0);
    let [coastEnd, setCoastEnd] = createSignal(0);
    let [topLeft, setTopLeft] = createSignal(0);
    let [bottomRight, setBottomRight] = createSignal(0);
    let [hidden, setHidden] = createSignal(true);

    let calculatePath = () => {
        setInterval(() => {
            setHidden(false);
        }, 1000);
    };

    return (
        <>
            <MapGL
                options={{
                    style: 'mb:dark',
                    accessToken:
                        'pk.eyJ1IjoiODgxcmQ3d2MiLCJhIjoiY2x1MXB5eDh4MGxlbzJqazFwZWY3NHJvNyJ9.uRMvLV3zPRzZVZo_1A8T7g',
                }}
                viewport={viewport()}
                onViewportChange={(evt: Viewport) => setViewport(evt)}
            >
                {/* <Line /> */}
                <Control type="navigation" position="bottom-left" />
                <Control type="fullscreen" position="bottom-right" />
                <UI
                    setBottomRight={setBottomRight}
                    setCostalEnd={setCoastEnd}
                    costalEnd={coastEnd}
                    costalStart={coastStart}
                    bottomRight={bottomRight}
                    setCostalStart={setCoastStart}
                    setTopLeft={setTopLeft}
                    topLeft={topLeft}
                    calculatePath={() => calculatePath()}
                />
                <Show when={!hidden()}>
                    <Line
                        coords={[
                            [1.4194, 51.3355],
                            [2.99932, 52.409448],
                        ]}
                    />
                    <Line
                        coords={[
                            [2.99932, 52.409448],
                            [0.3314, 53.2748],
                        ]}
                    />
                    <Polygon
                        bottomright={[-5.714722, 50.066111]}
                        topleft={[-5.714722, 50.066111]}
                    />
                </Show>
                <Source
                    source={{
                        type: 'geojson',
                        data: geojson,
                    }}
                >
                    <Layer
                        style={{
                            type: 'circle',
                            paint: {
                                'circle-radius': 8,
                                'circle-color': 'blue',
                            },
                        }}
                    />
                </Source>

                <Source
                    source={{
                        type: 'geojson',
                        data: geojson,
                    }}
                >
                    <Layer
                        style={{
                            type: 'circle',
                            paint: {
                                'circle-radius': 8,
                                'circle-color': 'blue',
                            },
                        }}
                    />
                </Source>
            </MapGL>
        </>
    );
};

export default MapC;
