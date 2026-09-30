console.log("MAP.JS STARTED");

if (!mapToken) {
    console.error("Mapbox token is missing!");
}

if (!coordinates || coordinates.length !== 2) {

    console.error("Listing coordinates are missing!");

} else {

    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates,
        zoom: 11
    });

    map.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
    );


    // ================================
    // AIRBNB MAP MARKER
    // ================================

    const markerElement = document.createElement("div");

    markerElement.className = "airbnb-map-marker";

    markerElement.innerHTML = `
        <i class="fa-brands fa-airbnb"></i>
    `;


    new mapboxgl.Marker({
        element: markerElement
    })
        .setLngLat(coordinates)
        .addTo(map);


    // ================================
    // APPROXIMATE AREA CIRCLE
    // ================================

    map.on("load", () => {

        map.addSource("listing-area", {

            type: "geojson",

            data: {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: coordinates
                }
            }

        });


        map.addLayer({

            id: "listing-area-circle",

            type: "circle",

            source: "listing-area",

            paint: {

                "circle-radius": 80,

                "circle-color": "#ff385c",

                "circle-opacity": 0.15,

                "circle-stroke-width": 2,

                "circle-stroke-color": "#ff385c",

                "circle-stroke-opacity": 0.5

            }

        });

    });


    // ================================
    // MAP ERROR
    // ================================

    map.on("error", (event) => {

        console.error("Mapbox error:", event);

    });

}