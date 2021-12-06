import { useDispatch } from "react-redux";
import { setCoordinates } from "../store/meetingsSlice";

// export const GetLocation = (dispatch: any) => {
//   if (!navigator.geolocation) {
//     console.warn("Геолокация не поддерживается вашим браузером");
//   } else {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat: number = position.coords.latitude;
//         const long: number = position.coords.longitude;
//         console.log("cor", { lat: lat, long: long });
//         dispatch(setCoordinates({ lat: lat, long: long }));
//         //return { lat: lat, long: long };
//       },
//       () => {
//         console.warn("Невозможно определить вашу геолокацию");
//       }
//     );
//   }
// };
