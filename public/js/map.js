mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12',
        center: list.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
});

// console.log(coordinates);
// const marker = new mapboxgl.Marker({ color: 'red' })
    // .setLngLat(list.geometry.coordinates)
//     .setPopup(new mapboxgl.Popup({ offset: 25 })
//     .setHTML(`<h3>${list.title}</h3><p>Exact location provided after booking.</p>`))
//     .addTo(map);

        map.on('load', () => {
        // Load an Airbnb icon from a URL (replace with your Airbnb icon URL)
        map.loadImage(
            'https://cdn-icons-png.flaticon.com/512/5977/5977574.png', // Example URL (replace with your own)
            (error, image) => {
                if (error) throw error;
    
                // Add the image to the map style.
                map.addImage('https://cdn-icons-png.flaticon.com/512/5977/5977574.png', image);
    
                // Add a data source containing one point feature.
                map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': list.geometry.coordinates // Set your coordinates
                                }
                            }
                        ]
                    }
                });
    
                // Add a new layer that uses the custom Airbnb icon
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point', 
                    'layout': {
                        'icon-image': 'https://cdn-icons-png.flaticon.com/512/5977/5977574.png', // Use Airbnb icon
                        'icon-size': 0.08
                    }
                });
            }
        );
    });
    