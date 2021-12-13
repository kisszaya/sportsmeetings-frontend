import { UserWrapper } from "elements/ui";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { NavLink } from "react-router-dom";
import { ReactChild, useContext } from "react";
import { PopupContext } from "elements/service";
import { EditProfile } from "./edit-profile/EditProfile";
import { GetPhotoByUserId } from "utils/MeetingsFunctions";
import { TelegramBot } from "./telegram-bot/TelegramBot";
import { Loading } from "components/general";

import styles from "./ProfileContainer.module.scss";

import { ReactComponent as TelegramSVG } from "./media/telegram.svg";

const ProfileContainer = (props: { children: ReactChild | ReactChild[] }) => {
  // Popup
  const setPopup = useContext(PopupContext);

  // Redux
  const { data } = useSelector((state: RootState) => state.profile.myInfo);
  if (!data) return <Loading />;

  return (
    <UserWrapper>
      <div className={styles.container}>
        <section className={styles.left_section}>
          <div className={styles.info_container}>
            <div className={styles.photo}>
              <GetPhotoByUserId userId={data.id} />
            </div>
            <p className={styles.username}>{data.username}</p>
            <p
              className={styles.text}
            >{`${data.firstName} ${data.lastName}`}</p>
            <p className={styles.text}>{data.email}</p>
          </div>
          <div className={styles.buttons_container}>
            <button
              onClick={() => setPopup(<TelegramBot />)}
              className={styles.telegram_button}
            >
              <div className={styles.telegramSVG}>
                <TelegramSVG />
              </div>
              Подключить телеграм бота
            </button>
            <button
              onClick={() => setPopup(<EditProfile />)}
              className={styles.edit_profile_button}
            >
              Настройки
            </button>
          </div>
        </section>
        <section className={styles.right_section}>
          <nav className={styles.nav}>
            <NavLink
              to="/profile/reviews"
              className={({ isActive }) =>
                isActive ? styles.active_link : styles.link
              }
            >
              Отзывы
            </NavLink>
            <NavLink
              to="/profile/events"
              className={({ isActive }) =>
                isActive ? styles.active_link : styles.link
              }
            >
              Встречи
            </NavLink>
          </nav>
          <div className={styles.child}>{props.children}</div>
        </section>
      </div>
    </UserWrapper>
  );
};

export default ProfileContainer;
