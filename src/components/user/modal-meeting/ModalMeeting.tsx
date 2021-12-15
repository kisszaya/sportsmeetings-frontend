import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime,
  GetCreatorUsername,
} from "utils/MeetingsFunctions";
import { Button } from "./button/Button";
import { useState } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { useDispatch } from "react-redux";
import { createRequestToJoinMeeting } from "store/meetingRequestsSlice";
import { PopupHeader } from "elements/ui";

import styles from "./ModalMeeting.module.scss";

import { ReactComponent as ArrowSVG } from "./media/arrow.svg";
import { ReactComponent as TimeSVG } from "./media/time.svg";
import { ReactComponent as PlaceSVG } from "./media/place.svg";

type Meeting = {
  categoryId: number;
  creatorId: number;
  description: string;
  endDate: string;
  id: number;
  latitude: number;
  longitude: number;
  maxNumbOfParticipants: number;
  participantsIds: number[];
  startDate: string;
};

export const ModalMeeting = (props: { meeting: Meeting }) => {
  const [comment, setComment] = useState<boolean>(false);
  const dispatch = useDispatch();

  // Initial values
  const initialValues = {
    description: "" as string,
  };

  // Validate
  const validate = (values: typeof initialValues) => {
    const { description } = values;
    const errors: { [field: string]: string } = {};

    if (description.length < 1) errors.description = "Не введен комментарий!";
    if (description.length > 256)
      errors.description = "Слишком длинный комментарий";

    return errors;
  };

  const onSubmit = async (values: typeof initialValues) => {
    const { description } = values;
    console.log("inSubmit", values);
    await dispatch(
      createRequestToJoinMeeting({
        meetingId: props.meeting.id,
        description: description,
      })
    );
  };

  return (
    <div className={styles.container}>
      <PopupHeader title="Встреча" />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        validateOnMount={true}
      >
        <FormikForm className={styles.main_container}>
          {!comment && (
            <section className={styles.about_meeting_container}>
              <section className={styles.info_container}>
                <p className={styles.category}>
                  <GetCategoryName categoryId={props.meeting.categoryId} />
                </p>
                <div className={styles.time_place_container}>
                  <div>
                    <TimeSVG />
                  </div>
                  <p className={styles.time}>
                    <GetConvertedTime text={props.meeting.startDate} />
                  </p>
                </div>
                <div className={styles.time_place_container}>
                  <div>
                    <PlaceSVG />
                  </div>
                  <p className={styles.address}>
                    <GetConvertedAddress
                      lat={props.meeting.latitude}
                      lng={props.meeting.longitude}
                    />
                  </p>
                </div>
                <p className={styles.username}>
                  <GetCreatorUsername meeting={props.meeting} />
                </p>
                <p className={styles.description}>
                  {props.meeting.description}
                </p>
              </section>
              <section className={styles.meeting_numbers_container}>
                <object type="owo/uwu" className={styles.img}>
                  <a
                    href={`http://maps.google.com/maps?q=${props.meeting.latitude},${props.meeting.longitude}`}
                    target="_blank"
                  >
                    <img
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${props.meeting.latitude},${props.meeting.longitude}&zoom=12&size=200x200&markers=color:red%7C${props.meeting.latitude},${props.meeting.longitude}&key=AIzaSyBB8NX_l1PeFmiGqs8unnV88wjs_MW1J9k`}
                      alt="Map"
                    />
                  </a>
                </object>
                <div className={styles.participants_container}>
                  <p className={styles.participants_title}>
                    Сейчас участиников:
                  </p>
                  <p className={styles.participants_number}>
                    {props.meeting.participantsIds.length}
                  </p>
                </div>
                <div className={styles.participants_container}>
                  <p className={styles.participants_title}>
                    Максимальное кол-во участнков:
                  </p>
                  <p className={styles.participants_number}>
                    {props.meeting.maxNumbOfParticipants}
                  </p>
                </div>
              </section>
            </section>
          )}
          {comment && (
            <section className={styles.comment_container}>
              <div className={styles.comment_title_container}>
                <div
                  onClick={() => setComment(false)}
                  className={styles.arrowSVG}
                >
                  <ArrowSVG />
                </div>
                <p className={styles.comment_title}>Ваш комментарий к заявке</p>
              </div>
              <Field
                as="textarea"
                type="text"
                placeholder="Начните писать"
                name="description"
              />
            </section>
          )}
          <div className={styles.button_container}>
            <Button
              participants={props.meeting.participantsIds}
              creatorId={props.meeting.creatorId}
              meetingId={props.meeting.id}
              setComment={setComment}
              comment={comment}
            />
          </div>
        </FormikForm>
      </Formik>
    </div>
  );
};
