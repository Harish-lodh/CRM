const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    height: '42px',
    minHeight: '42px',
    borderWidth: '2px',
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // blue-500 or gray-300
    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
    '&:hover': {
      borderColor: '#3b82f6', // hover border color
    },
  }),
  valueContainer: (base) => ({
    ...base,
    height: '42px',
    padding: '0 8px',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: '42px',
  }),
};

export default customSelectStyles;
