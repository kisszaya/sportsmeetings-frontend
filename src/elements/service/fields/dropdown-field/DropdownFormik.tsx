import { FC, HTMLProps, useState } from "react";
import classNames from "classnames";
import { FieldProps } from "formik";

import styles from "./DropdownFormik.module.scss";

import { ReactComponent as DropdownArrowSVG } from "./dropdownArrow.svg";

type DropdownItem = {
  id: string | null;
  displayText: string | null;
};

interface DropdownFormik {
  listItems: (DropdownItem | null)[];
  placeholder: string;
  divProps?: HTMLProps<HTMLDivElement>;
}

export const DropdownFormik: FC<DropdownFormik & FieldProps> = ({
  field,
  form: { touched, errors, setFieldValue },
  listItems,
  placeholder,
  divProps,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState<string | null>(placeholder);
  return (
    <div
      className={classNames(
        styles.dropdownBox,
        divProps?.className,
        {
          [styles.visible]: visible,
        },
        { [styles.placeholder]: placeholder === text }
      )}
    >
      {text}
      <DropdownArrowSVG />
      <div className={styles.toggle} onClick={() => setVisible(!visible)} />
      <div className={styles.dropdownList}>
        {listItems?.map(
          (item, index) =>
            item && (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={() => {
                  setFieldValue(field.name, item.id);
                  setVisible(false);
                  setText(item.displayText);
                }}
              >
                {item.displayText}
              </div>
            )
        )}
      </div>
    </div>
  );
};
