import {
  createContext,
  FC,
  useCallback,
  MouseEvent,
  useState,
  useRef,
} from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

import styles from "./Popup.module.scss";
import { useDispatch } from "react-redux";
import { setStatusRequests } from "store/meetingRequestsSlice";

export const PopupContext = createContext<
  (popupElement: JSX.Element | null) => void
>((_: JSX.Element | null) => {});

export const PopupProvider: FC = ({ children }) => {
  const animationControls = useAnimation();
  const dispatch = useDispatch();

  const content = useRef<HTMLDivElement>(null);
  const closePopup = useCallback(async () => {
    setCurrentPopup(null);
    await animationControls.start("clear");
    setTimeout(() => {
      dispatch(setStatusRequests("idle"))
    }, 200);
  }, [animationControls]);

  const backdropClick = async (e: MouseEvent) => {
    e.stopPropagation();
    await closePopup();
  };

  const [currentPopup, setCurrentPopup] = useState<JSX.Element | null>(null);
  const showPopup = async (popupElement: JSX.Element | null) => {
    if (popupElement) {
      setCurrentPopup(() => popupElement);
      await animationControls.start("blurred");
    } else {
      await closePopup();
    }
  };

  return (
    <AnimatePresence initial={false}>
      <PopupContext.Provider key="context" value={showPopup}>
        <div>
          <motion.div
            ref={content}
            className={styles.contentBlur}
            initial="clear"
            animate={animationControls}
            variants={{
              blurred: {
                filter: "blur(8px)",
                transition: {
                  duration: 0,
                  delay: 0.1,
                },
              },
              clear: {
                filter: "none",
                transition: {
                  duration: 0,
                },
              },
            }}
          >
            {children}
          </motion.div>
        </div>
      </PopupContext.Provider>
      {!!currentPopup && (
        <div
          key="modal"
          className={styles.popupWrapper}
          onClick={backdropClick}
        >
          <motion.div
            className={styles.cardBox}
            onClick={(e) => e.stopPropagation()}
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.5,
                transition: {
                  duration: 0.3,
                },
              },
              visible: {
                opacity: 0.92,
                scale: 1,
                transition: {
                  duration: 0.3,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <p onClick={closePopup}>Close</p>
            {currentPopup}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
