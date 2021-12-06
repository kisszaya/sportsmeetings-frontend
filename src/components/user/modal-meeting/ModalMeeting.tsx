import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime,
  GetUsernameById,
} from "utils/MeetingsFunctions";
import { Button } from "./button/Button";
import { useState } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { useDispatch } from "react-redux";
import { createRequestToJoinMeeting } from "store/meetingRequestsSlice";
import styles from "../../general/auth/Auth.module.scss";

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
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validateOnMount={true}
    >
      <FormikForm className={styles.formContainer}>
        <section>
          <p>Встреча</p>
        </section>
        {!comment && (
          <section>
            <div>
              <p>
                <GetCategoryName categoryId={props.meeting.categoryId} />
              </p>
              <p>
                <GetConvertedTime text={props.meeting.startDate} />
              </p>
              <p>
                <GetConvertedAddress
                  lat={props.meeting.latitude}
                  lng={props.meeting.longitude}
                />
              </p>
              <p>
                <GetUsernameById userId={props.meeting.id} />
              </p>
              <p>{props.meeting.description}</p>
            </div>
            <div>
              <iframe
                width="300"
                height="170"
                frameBorder="0"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${props.meeting.latitude},${props.meeting.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              />
              <div>
                <p>Сейчас участиников:</p>
                <p>{props.meeting.participantsIds.length}</p>
              </div>
              <div>
                <p>Максимальное кол-во участнков:</p>
                <p>{props.meeting.maxNumbOfParticipants}</p>
              </div>
            </div>
          </section>
        )}

        {comment && (
          <section>
            <button onClick={() => setComment(false)}>Back</button>
            <p>Ваш комментарий к заявке</p>
            <Field
              type="text"
              placeholder="Начните писать"
              name="description"
            />
          </section>
        )}

        <Button
          participants={props.meeting.participantsIds}
          creatorId={props.meeting.creatorId}
          meetingId={props.meeting.id}
          setComment={setComment}
          comment={comment}
        />
      </FormikForm>
    </Formik>
  );
};
