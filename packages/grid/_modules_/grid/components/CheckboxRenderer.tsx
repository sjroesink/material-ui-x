import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { visibleSortedRowsSelector } from '../hooks/features/filter/filterSelector';
import { rowCountSelector } from '../hooks/features/rows/rowsSelector';
import { selectedRowsCountSelector } from '../hooks/features/selection/selectionSelector';
import { ColParams } from '../models/params/colParams';
import { CellParams } from '../models/params/cellParams';
import { ApiContext } from './api-context';

export const HeaderCheckbox: React.FC<ColParams> = () => {
  const apiRef = React.useContext(ApiContext);
  const visibleRows = useGridSelector(apiRef, visibleSortedRowsSelector);

  const totalSelectedRows = useGridSelector(apiRef, selectedRowsCountSelector);
  const totalRows = useGridSelector(apiRef, rowCountSelector);

  const [isIndeterminate, setisIndeterminate] = React.useState(
    totalSelectedRows > 0 && totalSelectedRows !== totalRows,
  );
  const [isChecked, setChecked] = React.useState(
    totalSelectedRows === totalRows || isIndeterminate,
  );

  React.useEffect(() => {
    const isNewIndeterminate = totalSelectedRows > 0 && totalSelectedRows !== totalRows;
    const isNewChecked = totalSelectedRows === totalRows || isIndeterminate;
    setChecked(isNewChecked);
    setisIndeterminate(isNewIndeterminate);
  }, [isIndeterminate, totalRows, totalSelectedRows]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked);
    apiRef!.current.selectRows(
      visibleRows.map((row) => row.id),
      checked,
    );
  };

  return (
    <Checkbox
      indeterminate={isIndeterminate}
      checked={isChecked}
      onChange={handleChange}
      className="MuiDataGrid-checkboxInput"
      color="primary"
      inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
    />
  );
};
HeaderCheckbox.displayName = 'HeaderCheckbox';

export const CellCheckboxRenderer: React.FC<CellParams> = React.memo((props) => {
  const { row, getValue, field } = props;
  const apiRef = React.useContext(ApiContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    apiRef!.current.selectRow(row.id, checked, true);
  };

  return (
    <Checkbox
      checked={!!getValue(field)}
      onChange={handleChange}
      className="MuiDataGrid-checkboxInput"
      color="primary"
      inputProps={{ 'aria-label': 'Select Row checkbox' }}
    />
  );
});
CellCheckboxRenderer.displayName = 'CellCheckboxRenderer';
