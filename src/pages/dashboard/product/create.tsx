import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
  Dialog,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { fData } from '../../../utils/formatNumber';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FineFormConfig, Validation } from 'src/@types/fine/table';
import { UploadAvatar } from 'src/components/upload';
import { firebaseStorage } from 'src/firebase';
import * as yup from 'yup';
import { FormProvider } from '../../../components/hook-form';
// ----------------------------------------------------------------------

const validationConfigs: FineFormConfig[] = [
  {
    id: 'image',
    validationType: 'string',
    label: 'Image',
    validations: [{ type: 'required', params: ['Image is required'] }],
  },
  {
    id: 'storeId',
    validationType: 'string',
    label: 'Cửa hàng',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'categoryId',
    validationType: 'string',
    label: 'Category',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'productCode',
    validationType: 'string',
    label: 'Mã sản phẩm',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'productName',
    validationType: 'string',
    label: 'Tên sản phẩm',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'productType',
    validationType: 'string',
    label: 'Loại sản phẩm',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  {
    id: 'isStackable',
    validationType: 'boolean',
    label: 'Có thể xếp chồng',
    validations: [{ type: 'required', params: ['Is Active is required'] }],
  },
  {
    id: 'productAttribute',
    validationType: 'string',
    label: 'Thuộc tính',
    validations: [{ type: 'required', params: ['Store Name is required'] }],
  },
  // Add more validation configs as needed
];

type FormProps = {
  editObject?: Record<string, any>;
  title?: string;
  open: boolean;
  handleClose: () => void;
  isEdit?: boolean;
  validationConfigs: FineFormConfig[];
  handleSubmitForm: (data: any) => void;
};

// Define a mapping between validation types and their respective validation methods
const validationMethods: Record<string, (params: any[]) => yup.AnySchema> = {
  string: yup.string,
  number: yup.number,
  boolean: yup.boolean,
  // Add more mapping as needed
};

function createYupSchema(schema: any, config: FineFormConfig): any {
  const { id, validationType, validations = [] } = config;

  const validationMethod = validationMethods[validationType];

  if (!validationMethod) {
    return schema;
  }

  let validator = validationMethod([]);

  validations.forEach((validation: Validation) => {
    const { params, type } = validation;
    const validationFunction = validator[type as keyof yup.AnySchema];
    if (typeof validationFunction === 'function') {
      validator = validationFunction.call(validator, ...params);
    }
  });

  schema[id] = validator;
  return schema;
}

// const validationSchema = yup.object().shape({
//   // Define the initial schema without any fields
//   storeName: Yup.string().required('storeName is required'),
//   contacPerson: Yup.string().required('contactPerson is required'),
// });

export default function FineTableForm({
  editObject,
  title,
  open,
  handleClose,
  isEdit = false,
  validationConfigs,
  handleSubmitForm,
}: FormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const yepSchema = validationConfigs.reduce(createYupSchema, {});
  const validateSchema = yup.object().shape(yepSchema);
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    resolver: yupResolver(validateSchema),
  });

  const {
    register,
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const generateField = (formConfig: FineFormConfig) => {
    const { id, label, defaultValue, validationType } = formConfig;
    switch (validationType) {
      case 'string':
        if (id.match('img') || id.match('image')) {
          return (
            <Grid key={id} item xs={12} md={16}>
              <Card sx={{ p: 3 }}>
                <Controller
                  name="image"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    const checkError = !!error && !field.value;

                    return (
                      <Stack>
                        <UploadAvatar
                          error={checkError}
                          accept="image/*"
                          maxSize={3145728}
                          onDrop={handleDrop}
                          helperText={
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 2,
                                mx: 'auto',
                                display: 'block',
                                textAlign: 'center',
                                color: 'text.secondary',
                              }}
                            >
                              Allowed *.jpeg, *.jpg, *.png, *.gif
                              <br /> max size of {fData(3145728)}
                            </Typography>
                          }
                          file={field.value}
                        />
                        {checkError && (
                          <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                            {error.message}
                          </FormHelperText>
                        )}
                      </Stack>
                    );
                  }}
                />
                <TextField
                  sx={{ visibility: 'hidden', width: '1px', height: '1px' }}
                  {...register('imageUrl')}
                />
              </Card>
            </Grid>
          );
        } else {
          return (
            <Grid key={id} item xs={12} md={6}>
              <TextField
                id={id}
                label={label}
                type={validationType}
                error={!!methods.formState.errors[id]}
                helperText={methods.formState.errors[id]?.message}
                variant="outlined"
                fullWidth
                defaultValue={defaultValue}
                {...register(id)}
              />
            </Grid>
          );
        }

      case 'boolean':
        return (
          <Grid key={id} item xs={12} md={6}>
            <FormControlLabel
              control={<Switch {...register(id)} />}
              label={label}
              labelPlacement="top"
            />
          </Grid>
        );
      default:
        return (
          <Grid key={id} item xs={12} md={6}>
            <TextField
              id={id}
              label={label}
              type={validationType}
              variant="outlined"
              fullWidth
              defaultValue={defaultValue}
              {...register(id)}
            />
          </Grid>
        );
    }
  };

  //   useEffect(() => {
  //     if (isEdit && currentUser) {
  //       reset(defaultValues);
  //     }
  //     if (!isEdit) {
  //       reset(defaultValues);
  //     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [isEdit, currentUser]);

  const onSubmit = async (data: any) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      handleSubmitForm(data);
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadImageToFirebase = async (file: File) => {
    try {
      if (file) {
        setIsUploading(true);
        const uploadPath = `images/${file.name}`; // geting the image path
        const storageRef = ref(firebaseStorage, uploadPath); // getting the storageRef
        await uploadBytes(storageRef, file)
          .then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then((downloadURL) => {
              setValue('imageUrl', downloadURL);
            });
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error!', { variant: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        handleUploadImageToFirebase(file);
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} maxWidth={'md'} onClose={handleClose} fullWidth>
        <Typography variant="h4" px={3} pt={1}>
          {!isEdit ? 'Create' : 'Edit'} {title ?? ''}
        </Typography>

        <DialogContent>
          <Grid container spacing={3}>
            {validationConfigs.map((config) => generateField(config))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
          <LoadingButton
            disabled={isUploading}
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            loading={isSubmitting}
          >
            {!isEdit ? 'Tạo mới' : 'Save Changes'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
