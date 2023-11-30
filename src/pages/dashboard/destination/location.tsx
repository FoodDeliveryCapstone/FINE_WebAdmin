import Autocomplete from '@mui/material/Autocomplete';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, useState } from 'react';
import { TGoongType } from 'src/@types/fine/location';

interface AutoCompleteResult {
  place_id: string;
  description: string;
}

const PlaceAutoComplete: React.FC = () => {
  const [location, setLocation] = useState<string>('21.013715429594125,105.79829597455202');
  const [input, setInput] = useState<string>('');
  const [autoCompleteResults, setAutoCompleteResults] = useState<AutoCompleteResult[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [placeDetails, setPlaceDetails] = useState<TGoongType | null>(null);
  const [error, setError] = useState<string | null>(null);
  // console.log('placeDetails', placeDetails?.result.geometry.location.lat);
  // console.log('placeDetails', placeDetails?.result.geometry.location.lng);

  const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInput(inputValue);

    try {
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=VNoJiA5HwuefS5ItRwKV2Ig5ub27OGgXl6aQBxkC&location=${encodeURIComponent(
          location
        )}&input=${encodeURIComponent(inputValue)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.predictions)) {
          setAutoCompleteResults(data.predictions);
          setError(null);
        } else {
          setError('Invalid data format received from Goong Place Autocomplete API');
        }
      } else {
        const errorData = await response.json();
        setError(
          `Failed to fetch data from Goong Place Autocomplete API. Status: ${response.status}, Message: ${errorData.error.message}`
        );
      }
    } catch (error) {
      setError(`Error occurred during the fetch: ${error.message}`);
    }
  };

  const handleSelectPlace = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setAutoCompleteResults([]);
  };

  const handlePlaceDetails = async () => {
    if (selectedPlaceId) {
      try {
        const response = await fetch(
          `https://rsapi.goong.io/Place/Detail?place_id=${selectedPlaceId}&api_key=VNoJiA5HwuefS5ItRwKV2Ig5ub27OGgXl6aQBxkC`
        );

        if (response.ok) {
          const data = await response.json();
          setPlaceDetails(data);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(
            `Failed to fetch place details. Status: ${response.status}, Message: ${errorData.error.message}`
          );
        }
      } catch (error) {
        setError(`Error occurred during the fetch: ${error.message}`);
      }
    }
  };

  const handleAutoCompleteItemClick = (result: AutoCompleteResult) => {
    handleSelectPlace(result.place_id);
  };

  return (
    <div>
      <div>
        <Autocomplete
          options={autoCompleteResults}
          getOptionLabel={(option) => option.description}
          onChange={(event, value) => value && handleSelectPlace(value.place_id)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter Input"
              margin="normal"
              variant="outlined"
              fullWidth
              onChange={handleInputChange}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <ListItemButton onClick={() => handleAutoCompleteItemClick(option)}>
                <ListItemText primary={option.description} />
              </ListItemButton>
            </li>
          )}
        />
      </div>
      <div>
        {/* <Button variant="contained" onClick={handlePlaceDetails}>
          Chọn điểm điểm
        </Button> */}
        {/* {placeDetails && <pre>{JSON.stringify(placeDetails, null, 2)}</pre>} */}
      </div>
    </div>
  );
};

export default PlaceAutoComplete;
