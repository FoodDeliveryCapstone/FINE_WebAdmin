export type FineTableHead = {
  id: string;
  label?: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  width?: number;
  
};
export type FineFormConfig = {
  id: string;
  validationType: string;
  label: string;
  defaultValue?: string | null;
  validations?: Validation[];
  fullWidth?: boolean;
};

export type Validation = {
  type: string;
  params: any[];
};

export type FineTableFilter = {
  id: string;
  title: string;
  icon?: string;
  items: {
    title: string;
    value: string | boolean | number;
    color?: TButtonColor;
  }[];
  isDefault: boolean;
};

export type TFilterItem = {
  name: string;
  value: string | boolean | number;
};

type TButtonColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
