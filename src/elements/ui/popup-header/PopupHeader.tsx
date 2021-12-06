import styles from "./PopupHeader.module.scss";

export const PopupHeader = (props: { title: string }) => {
  return <p className={styles.container}> {props.title}</p>;
};
