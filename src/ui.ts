import L, { LatLngTuple } from "leaflet";

const toFixed = (num: number, digits: number = 5) => {
  return Math.trunc(num * Math.pow(10, digits)) / Math.pow(10, digits);
};

export const setPozText = (poz: "start" | "end", c: LatLngTuple) => {
  document.getElementById(poz)!.innerHTML = `${toFixed(c[0])},<br>${toFixed(
    c[1]
  )}`;
};

var goldenIcon = L.icon({
  iconUrl: "micon.png",
  iconSize: [48, 50], // size of the icon
  iconAnchor: [24, 60], // point of the icon which will correspond to marker's location
  popupAnchor: [-3, -40], // point from which the popup should open relative to the iconAnchor
});

export const createMarker = (
  place: "start" | "end",
  poz: LatLngTuple // variable that is modified on each dragging event
) => {
  const marker = L.marker(poz, {
    icon: goldenIcon,
    draggable: true,
    autoPan: true,
    title: place,
  });
  setPozText(place, poz);

  marker.on("dragend", ({ target }: { target: L.Marker<any> }) => {
    const { lat, lng } = target.getLatLng();
    setPozText(place, [lat, lng]);
    console.log(`panning ${place} to: `, poz);
  });
  return marker;
};
