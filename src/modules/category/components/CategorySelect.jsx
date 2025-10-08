import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography } from 'framework/mui';

/**
 * CategorySelect
 * Props:
 *  - value, onChange
 *  - categories: array of {id, name, fg}
 *  - includeInactive: boolean (optional) -> if true, show inactive items
 *  - label: string
 */
export default function CategorySelect({ value, onChange, categories = [], includeInactive = false, label = 'Category', disabled = false }) {
  const items = includeInactive ? categories : categories.filter((c) => c.active === true);

  return (
    <FormControl fullWidth variant="outlined" size="small" disabled={disabled}>
      <InputLabel id="category-select-label">{label}</InputLabel>
      <Select
        labelId="category-select-label"
        value={value ?? ''}
        label={label}
        onChange={(e) => onChange && onChange(e.target.value)}
        renderValue={(val) => {
          const found = items.find((i) => i.id === val);
          return found ? found.name : '';
        }}
      >
        {items.length === 0 ? (
          <MenuItem value="" disabled>
            <Typography variant="body2">No categories</Typography>
          </MenuItem>
        ) : (
          items.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name} {cat.active ? '' : ' (inactive)'}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

CategorySelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  categories: PropTypes.array,
  includeInactive: PropTypes.bool,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};
