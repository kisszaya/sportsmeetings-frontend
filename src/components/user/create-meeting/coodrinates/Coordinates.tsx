import { FC, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { FieldProps } from "formik";
import classNames from "classnames";

import styles from "./Coordinates.module.scss";

export const Coordinates: FC<FieldProps> = ({
  field,
  form: { touched, errors, setFieldValue },
  ...props
}) => {
  const [address, setAddress] = useState("");

  const handleSelect = async (value: any) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    console.log('inCoord', latLng)
    setAddress(value);
    setFieldValue(field.name, { lat: latLng.lat, lng: latLng.lng });
  };

  return (
    <>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classNames(styles.dropdownBox)}>
            <input
              className={styles.dropdownInput}
              {...getInputProps({ placeholder: "Адрес встречи" })}
            />
            {suggestions.length > 0 && (
              <div className={styles.dropdownList}>
                {loading ? <div>...loading</div> : null}
                {suggestions &&
                  suggestions.map((suggestion) => {
                    return (
                      <div
                        className={styles.dropdownItem}
                        {...getSuggestionItemProps(suggestion)}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </PlacesAutocomplete>
    </>
  );
};