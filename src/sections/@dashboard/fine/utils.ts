import moment from 'moment';

export function applySortFilter({
  tableData,
  comparator,
  filterName,
}: {
  tableData: any[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        moment(item.checkInDate).format('DD/MM/YYYY HH:mm:SS').toString().indexOf(filterName.toString()) !== -1
    );
  }

  return tableData;
}
