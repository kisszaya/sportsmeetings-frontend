import {ReactComponent as SpinSVG} from "./spin.svg";

import styles from './Loading.module.scss'

export const Loading = () => {
  return <div className={styles.container}><div className={styles.icon}><SpinSVG/></div></div>
}