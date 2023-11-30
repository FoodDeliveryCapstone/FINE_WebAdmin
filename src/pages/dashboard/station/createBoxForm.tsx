import { FormControl, InputLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { TBoxStation } from 'src/@types/fine/station';
import stationApi from 'src/apis/station';
import { dispatch } from 'src/redux/store';

interface BoxFormProps {
  onBoxCreated: (box: TBoxStation) => void;
}

const BoxForm: React.FC<BoxFormProps> = ({ onBoxCreated }) => {
  const [stationLists, setStationList] = useState<Record<string, any>[]>([]);
  const [boxData, setBoxData] = React.useState({
    stationId: '',
    code: '',
    isHeat: false,
  });
  const getStation = async () => {
    const res = await stationApi.getStationList();
    setStationList(res.data);
  };
  function fetchApis() {
    dispatch(getStation);
  }
  useEffect(() => {
    fetchApis();
  }, [dispatch]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setBoxData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setBoxData((prevData) => ({
      ...prevData,
      stationId: event.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      const updateRes = await stationApi.createBox(boxData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Địa điểm</InputLabel>
        <Select
          label="Địa điểm"
          variant="outlined"
          name="stationId"
          value={boxData.stationId}
          onChange={handleSelectChange} // Use the new handler for Select
          fullWidth
        >
          {stationLists.map((station) => (
            <MenuItem key={station.id} value={station.id}>
              {station.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Code"
        variant="outlined"
        name="code"
        value={boxData.code}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <div>
        <Checkbox checked={boxData.isHeat} onChange={handleInputChange} name="isHeat" />
        <span>Có nhiệt</span>
      </div>
      <Button onClick={onSubmit} variant="contained" color="primary">
        Tạo mới
      </Button>
    </form>
  );
};

export default BoxForm;
