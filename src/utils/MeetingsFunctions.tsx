import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { userInfo } from "../store/ProfileSlice";
import { getMeetingByIdType } from "../types/MeetingTypes";
import { NavLink } from "react-router-dom";
import DefaultPhotoPNG from "./media/defaultPhoto.png";

export const GetConvertedTime = (props: { text: string }) => {
  const elements = props.text.split(" / ");
  const date = elements[0].split(".");
  return (
    <>{`${date[0]} ${monthsNames.get(Number(date[1]) - 1)}   ${elements[1]}`}</>
  );
};

export const GetConvertedAddress = (props: { lat: number; lng: number }) => {
  const [address, setAddress] = useState<string>("");
  useEffect(() => {
    getAddressFromLatLng(props.lat, props.lng)
      .then((value: string) => setAddress(value))
      .catch((error) => setAddress(`Нельзя загрузить адрес из за ${error}`));
  }, [props.lat, props.lng]);
  return <>{address}</>;
};

export const getAddressFromLatLng = async (
  lat: number,
  lng: number
): Promise<string> => {
  console.log("addd");
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBB8NX_l1PeFmiGqs8unnV88wjs_MW1J9k&language=ru`
  );
  if (response) {
    const result = await response.json();
    return result.results[0].formatted_address;
  } else {
    return "Нельзя определить геолокацию";
  }
};

export const GetCategoryName = (props: { categoryId: number }) => {
  const { categories } = useSelector((state: RootState) => state.categories);
  console.log("cat", categories);
  return (
    <>
      {
        categories?.find((category) => category.id === props.categoryId)
          ?.name as string
      }
    </>
  );
};

export const GetUsernameById = (props: { userId: number }) => {
  const dispatch = useDispatch();
  const { usersInfo } = useSelector((state: RootState) => state.profile);
  if (!usersInfo.find((user) => user.id === props.userId))
    dispatch(userInfo(props.userId));
  return <> {usersInfo.find((user) => user.id === props.userId)?.username}</>;
};

export const GetCreatorUsername = (props: { meeting: getMeetingByIdType }) => {
  const { data } = useSelector((state: RootState) => state.profile.myInfo);
  if (data && data.id === props.meeting.creatorId) return <>Ваша встреча</>;
  else
    return (
      <NavLink to={`/user/${props.meeting.creatorId}`}>
        <GetUsernameById userId={props.meeting.creatorId} />
      </NavLink>
    );
};

export const GetPhotoByUserId = (props: { userId: number }) => {
  // State
  const [resultSrc, setResultSrc] = useState<null | string>("loading");

  // Redux
  const dispatch = useDispatch();
  const { usersInfo } = useSelector((state: RootState) => state.profile);
  if (!usersInfo.find((user) => user.id === props.userId))
    dispatch(userInfo(props.userId));
  const username = usersInfo.find((user) => user.id === props.userId)?.username;

  // Check image
  const img = new Image();
  img.src = `https://api.sportsmeetings.daniilkaranov.ru/profile-photos/${username}.jpg`;
  img.onload = function () {
    setResultSrc(
      `https://api.sportsmeetings.daniilkaranov.ru/profile-photos/${username}.jpg`
    );
  };
  img.onerror = function () {
    setResultSrc(null);
  };
  if (resultSrc === "loading") return <p>Loading</p>;
  else if (resultSrc === null)
    return <img src={DefaultPhotoPNG} alt="default avatar" />;
  else return <img src={resultSrc} alt="profile avatar" />;
};

let monthsNames = new Map([
  [0, "января"],
  [1, "февраля"],
  [2, "марта"],
  [3, "апреля"],
  [4, "мая"],
  [5, "июня"],
  [6, "июля"],
  [7, "августа"],
  [8, "сентября"],
  [9, "октября"],
  [10, "ноября"],
  [11, "декабря"],
]);
