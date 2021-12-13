import { NavLink } from "react-router-dom";

import styles from "./Navbar.module.scss";

import { ReactComponent as PlusSVG } from "./media/plus.svg";

export const Navbar = () => {
  return (
    <div className={styles.container}>
      <NavLink
        to="/meetings"
        className={({ isActive }) =>
          isActive ? styles.active_link : styles.link
        }
      >
        Найти встречу
      </NavLink>
      <NavLink
        to="/profile/events"
        className={({ isActive }) =>
          isActive ? styles.active_link : styles.link
        }
      >
        Мой профиль
      </NavLink>
      <NavLink
        to="/create_meeting"
        className={({ isActive }) =>
          isActive ? styles.active_link : styles.link
        }
      >
        Создать встречу
        <div className={styles.plusSVG}>
          <PlusSVG />
        </div>
      </NavLink>
    </div>
  );
};
