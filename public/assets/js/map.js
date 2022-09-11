mapboxgl.accessToken =
    'pk.eyJ1IjoibGVoaWV1IiwiYSI6ImNsN3dmanhvbTBsNTIzb3I5M3d3dGJuMzcifQ.SYPd3n3mUWWTlT0K8UvEyg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 9,
    center: [106.660172, 10.762622]
});

// Fetch stores from API
async function getStores() {
    const res = await fetch('/api/timekeep//positionMap');
    const data = await res.json();

    const stores = data.data.map(store => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    store.location.coordinates[0],
                    store.location.coordinates[1]
                ]
            },
            properties: {
                name: store.name,
                icon: 'shop'
            }
        };
    });

    loadMap(stores);
}

// Load map with stores
function loadMap(stores) {
    map.on('load', function () {
        map.addLayer({
            id: 'points',
            type: 'symbol',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: stores
                }
            },
            layout: {
                'icon-image': '{icon}-15',
                'icon-size': 1.5,
                'text-field': '{name}',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.9],
                'text-anchor': 'top'
            }
        });
    });
}

getStores();