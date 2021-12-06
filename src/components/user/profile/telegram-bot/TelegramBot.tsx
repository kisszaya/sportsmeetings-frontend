import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getActivationCode } from "store/telegramSlice";
import { RootState } from "store";
import { Loading } from "components/general";

import styles from "./TelegramBot.module.scss";

export const TelegramBot = () => {
  // Redux
  const dispatch = useDispatch();
  const { code, status, error } = useSelector((state: RootState) => state.telegram);
  useEffect(() => {
    dispatch(getActivationCode());
  }, [dispatch]);
  if (!code) return <Loading />;

  return (
    <div className={styles.container}>
      {status === "resolved" && (
        <>
          <h3 className={styles.title}>
            Получай все уведомления в телеграмме!
          </h3>
          <p className={styles.lint_text}>Перейди по ссылке</p>
          <a href="https://t.me/SportsMeetingsBot" target="_blank" className={styles.href}>
            @SportsMeetingsBot
          </a>
          <p className={styles.type_text}>Напиши боту</p>
          <p className={styles.code}>{`/активировать ${code}`}</p>
        </>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};
