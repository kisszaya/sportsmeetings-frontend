import { HTMLAttributes, ReactChild } from 'react'
import classNames from 'classnames'

import styles from './Wrapper.module.scss'

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactChild | ReactChild[]
}

export const Wrapper = (props: WrapperProps) => {
    return (
        <div {...props} className={classNames(styles.wrapper, props.className)}>
            {props.children}
        </div>
    )
}