import { MainButton, UserWrapper } from "elements/ui";
import {
  Formik,
  Form as FormikForm,
  ErrorMessage,
  Field as FormikField,
} from "formik";
import { Coordinates } from "./coodrinates/Coordinates";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { DropdownFormik, MeetingField } from "elements/service";
import {
  ConvertedEndDate,
  Days,
  Hours,
  MeetingDurationMinutes,
  Minutes,
  Months,
  TimeZone,
} from "./date-functions/DateFunctions";
import { CreateMeetingFormikType, CreateMeetingType } from "types/MeetingTypes";
import { createNewMeeting } from "store/meetingsSlice";
import { useNavigate } from "react-router-dom";

import styles from "./CreateMeeting.module.scss";

const initialValues: CreateMeetingFormikType = {
  coordinates: {
    lat: null,
    lng: null,
  },
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
  // Redux
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { error, status } = useSelector(
    (state: RootState) => state.meetings.createMeeting
  );

  // Navigate after submit
  const navigate = useNavigate();

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
      coordinates,
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
    if (!coordinates.lng || !coordinates.lat)
      errors.coordinates = "Пожалуйста введите адрес еще раз";
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
      values.coordinates.lng &&
      values.coordinates.lat &&
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
        latitude: values.coordinates.lat,
        longitude: values.coordinates.lng,
        maxNumbOfParticipants: values.maxNumbOfParticipants,
        startDate: {
          dayOfMonth: values.dayOfMonth,
          hourOfDay: values.hourOfDay,
          minute: values.minute,
          month: Number(values.month) + 1,
          timeZoneOffset: TimeZone(),
        },
      };
      await dispatch(createNewMeeting(result));
      if (status === "resolved") navigate("/profile/events");
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
            <FormikField
              divProps={{ className: styles.category_dropdown }}
              component={DropdownFormik}
              name="categoryId"
              placeholder="Категория"
              listItems={categories?.map((category) => ({
                id: category.id,
                displayText: category.name,
              }))}
            />
            <MeetingField
              component="textarea"
              placeholder="Описание встречи"
              name="description"
              type="text"
            />
            <FormikField component={Coordinates} name="coordinates" />
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
              <FormikField
                divProps={{ className: styles.time_dropdown }}
                component={DropdownFormik}
                name="month"
                placeholder="Месяц"
                listItems={Months().map((month) => ({
                  id: month.id,
                  displayText: month.name,
                }))}
              />
              {values.month && (
                <FormikField
                  divProps={{ className: styles.time_dropdown }}
                  component={DropdownFormik}
                  name="dayOfMonth"
                  placeholder="Число"
                  listItems={Days(Number(values.month)).map((day) => ({
                    id: day,
                    displayText: day,
                  }))}
                />
              )}
              {values.dayOfMonth && (
                <>
                  <FormikField
                    divProps={{ className: styles.time_dropdown }}
                    component={DropdownFormik}
                    name="hourOfDay"
                    placeholder="Часы"
                    listItems={Hours().map((hour) => ({
                      id: hour,
                      displayText: hour,
                    }))}
                  />
                  <FormikField
                    divProps={{ className: styles.time_dropdown }}
                    component={DropdownFormik}
                    name="minute"
                    placeholder="Минуты"
                    listItems={Minutes().map((min) => ({
                      id: min,
                      displayText: min,
                    }))}
                  />
                </>
              )}
            </div>
            {values.minute && values.hourOfDay && (
              <>
                <h3 className={styles.label}>
                  Сколько минут будет длиться встреча
                </h3>
                <FormikField
                  divProps={{ className: styles.time_dropdown }}
                  component={DropdownFormik}
                  name="meetingDurationMinutes"
                  placeholder="Минуты"
                  listItems={MeetingDurationMinutes().map((min) => ({
                    id: min,
                    displayText: min,
                  }))}
                />
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
              <ErrorMessage name="coordinates" component="p" />
              {error && <p>{error}</p>}
            </div>
            <div className={styles.button_container}>
              <MainButton
                buttonProps={{ type: "submit" }}
                type="medium"
                disabled={isSubmitting || !isValid}
                loading={status === "loading"}
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
