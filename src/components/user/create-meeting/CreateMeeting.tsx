import { MainButton, UserWrapper } from "elements/ui";
import {
  Formik,
  Form as FormikForm,
  ErrorMessage,
  Field as FormikField,
} from "formik";
import Coordinates from "./coodrinates/Coordinates";
import { useDispatch, useSelector } from "react-redux";
import { allCategories } from "store/categoriesSlice";
import { RootState } from "store";
import { MeetingField, MeetingFieldSelect } from "elements/service";
import {
  ConvertedEndDate,
  Days,
  Hours,
  MeetingDurationMinutes,
  Minutes,
  Months,
  TimeZone,
} from "./date-functions/DateFunctions";
import { useState } from "react";
import {
  CoordinatesType,
  CreateMeetingFormikType,
  CreateMeetingType,
} from "types/MeetingTypes";
import { createNewMeeting } from "store/meetingsSlice";

import styles from "./CreateMeeting.module.scss";

const initialValues: CreateMeetingFormikType = {
  categoryId: null,
  description: null,
  dayOfMonth: null,
  hourOfDay: null,
  minute: null,
  month: null,
  meetingDurationMinutes: null,
  maxNumbOfParticipants: null,
};
export type FormValues = typeof initialValues;

const CreateMeeting = () => {
  const dispatch = useDispatch();

  // Get Categories
  const { categories, status } = useSelector(
    (state: RootState) => state.categories
  );
  if (status === "idle") dispatch(allCategories());

  // Coordinates
  const [coordinates, setCoordinates] = useState<CoordinatesType>({
    lat: null,
    lng: null,
  });

  // Validate
  const validate = (values: FormValues) => {
    const {
      description,
      maxNumbOfParticipants,
      dayOfMonth,
      hourOfDay,
      month,
      meetingDurationMinutes,
      minute,
      categoryId,
    } = values;
    const errors: { [field: string]: string } = {};

    if (!description)
      errors.description = "Необходимо ввести описание к встрече";
    if (description && description.length > 256)
      errors.description = "Слишком длинное описание :(";
    if (!month) errors.month = "Необходимо указать месяц встречи";
    if (!dayOfMonth && month)
      errors.dayOfMonth = "Необходимо указать день встречи";
    if ((!hourOfDay || !minute) && month && dayOfMonth)
      errors.hourOfDay = "Необходимо указать время встречи";
    if (!meetingDurationMinutes)
      errors.meetingDurationMinutes =
        "Необходимо указать сколько минут будет ваша встреча";
    if (!categoryId) errors.categoryId = "Необходимо выбрать категорию";
    if (!maxNumbOfParticipants)
      errors.maxNumbOfParticipants =
        "Укажите сколько максимум человек может прийти на встречу";
    if (maxNumbOfParticipants && maxNumbOfParticipants < 2)
      errors.maxNumbOfParticipants =
        "Минимальное количество человек на встрече 2";
    if (maxNumbOfParticipants && maxNumbOfParticipants > 50)
      errors.maxNumbOfParticipants =
        "Максимальное количество человек на встрече 50";
    return errors;
  };

  // OnSubmit
  const onSubmit = async (values: FormValues) => {
    let result: CreateMeetingType;
    if (
      coordinates.lat &&
      coordinates.lng &&
      values.meetingDurationMinutes &&
      values.month &&
      values.dayOfMonth &&
      values.description &&
      values.maxNumbOfParticipants &&
      values.categoryId &&
      values.hourOfDay &&
      values.minute
    ) {
      result = {
        categoryId: Number(values.categoryId),
        description: values.description,
        endDate: ConvertedEndDate(
          Number(values.dayOfMonth),
          Number(values.month),
          Number(values.hourOfDay),
          Number(values.minute),
          Number(values.meetingDurationMinutes)
        ),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        maxNumbOfParticipants: values.maxNumbOfParticipants,
        startDate: {
          dayOfMonth: values.dayOfMonth,
          hourOfDay: values.hourOfDay,
          minute: values.minute,
          month: Number(values.month) + 1,
          timeZoneOffset: TimeZone(),
        },
      };
      dispatch(createNewMeeting(result));
    }
  };

  return (
    <UserWrapper>
      <h1 className={styles.title}>Создание встречи</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        validateOnMount={true}
      >
        {({ isSubmitting, isValid, values }) => (
          <FormikForm className={styles.form_container}>
            <FormikField as="select" name="categoryId">
              <option value="" disabled selected>
                Категория
              </option>
              {categories?.map((category) => (
                <option value={category.id}>{category.name}</option>
              ))}
            </FormikField>
            <MeetingField
              component="textarea"
              placeholder="Описание встречи"
              name="description"
              type="text"
            />
            <Coordinates
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
            <h3 className={styles.label}>Максимальноe кол-во участников</h3>
            <MeetingField
              placeholder="Кол-во"
              name="maxNumbOfParticipants"
              type="number"
            />
            <h3 className={styles.label}>
              В какой день и время начнется встреча?
            </h3>
            <div className={styles.time_container}>
              <MeetingFieldSelect name="month">
                <>
                  <option value="" disabled selected>
                    Месяц
                  </option>
                  {Months().map((month) => (
                    <option value={month.id}>{month.name}</option>
                  ))}
                </>
              </MeetingFieldSelect>
              {values.month && (
                <MeetingFieldSelect name="dayOfMonth">
                  <>
                    <option value="" disabled selected>
                      Число
                    </option>
                    {Days(Number(values.month)).map((day) => (
                      <option value={day}>{day}</option>
                    ))}
                  </>
                </MeetingFieldSelect>
              )}
              {values.dayOfMonth && (
                <>
                  <MeetingFieldSelect name="hourOfDay">
                    <>
                      <option value="" disabled selected>
                        Часы
                      </option>
                      {Hours().map((hour) => (
                        <option value={hour}>{hour}</option>
                      ))}
                    </>
                  </MeetingFieldSelect>
                  <MeetingFieldSelect name="minute">
                    <>
                      <option value="" disabled selected>
                        Минуты
                      </option>
                      {Minutes().map((minute) => (
                        <option value={minute}>{minute}</option>
                      ))}
                    </>
                  </MeetingFieldSelect>
                </>
              )}
            </div>
            {values.minute && values.hourOfDay && (
              <>
                <h3 className={styles.label}>
                  Сколько минут будет длиться встреча
                </h3>
                <MeetingFieldSelect name="meetingDurationMinutes">
                  <>
                    <option value="" disabled selected>
                      Минуты
                    </option>
                    {MeetingDurationMinutes().map((min) => (
                      <option value={min}>{min}</option>
                    ))}
                  </>
                </MeetingFieldSelect>
              </>
            )}
            <div className={styles.error_messages}>
              <ErrorMessage name="categoryId" component="p" />
              <ErrorMessage name="description" component="p" />
              <ErrorMessage name="dayOfMonth" component="p" />
              <ErrorMessage name="categoryId" component="p" />
              <ErrorMessage name="hourOfDay" component="p" />
              <ErrorMessage name="minute" component="p" />
              <ErrorMessage name="month" component="p" />
              <ErrorMessage name="meetingDurationMinutes" component="p" />
              <ErrorMessage name="maxNumbOfParticipants" component="p" />
            </div>
            <div className={styles.button_container}>
              <MainButton
                  buttonProps={{ type: "submit" }}
                  type="medium"
                  disabled={isSubmitting || !isValid}
              >
                Создать встречу
              </MainButton>
            </div>
          </FormikForm>
        )}
      </Formik>
    </UserWrapper>
  );
};

export default CreateMeeting;
