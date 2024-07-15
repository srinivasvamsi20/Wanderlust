mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 13, // starting zoom
});

const markerHeight = 50;
const markerRadius = 10;
const linearOffset = 25;
const popupOffsets = {
  top: [0, 0],
  "top-left": [0, 0],
  "top-right": [0, 0],
  bottom: [0, -markerHeight],
  "bottom-left": [
    linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  "bottom-right": [
    -linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  left: [markerRadius, (markerHeight - markerRadius) * -1],
  right: [-markerRadius, (markerHeight - markerRadius) * -1],
};
const popup = new mapboxgl.Popup({
  offset: popupOffsets,
  className: "my-class",
})
  .setLngLat(coordinates)
  .setHTML("<h3>Exact location will be provide after booking</h3>")
  .setMaxWidth("500px")
  .addTo(map);

const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)

  .addTo(map);
