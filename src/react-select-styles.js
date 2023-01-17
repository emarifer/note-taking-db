export const reactSelectStyles = {
  option: (defaultStyles, state) => ({
    ...defaultStyles,
    color: state.isSelected ? "#212529" : "whitesmoke",
    backgroundColor: state.isFocused ? "#4ba1ff" : "#212529",
  }),
  control: (defaultStyles) => ({
    ...defaultStyles,
    backgroundColor: "#212529",
  }),
  input: (defaultStyles) => ({
    ...defaultStyles,
    color: "whitesmoke",
    ":focus": {
      color: "whitesmoke",
    },
  }),
  menu: (defaultStyles) => ({
    ...defaultStyles,
    backgroundColor: "#007bff",
  }),
  multiValue: (defaultStyles) => ({
    ...defaultStyles,
    backgroundColor: "#007bff",
  }),
  multiValueLabel: (defaultStyles) => ({
    ...defaultStyles,
    color: "whitesmoke",
  }),
  multiValueRemove: (defaultStyles) => ({
    ...defaultStyles,
    color: "whitesmoke",
    cursor: "pointer",
    ":hover": {
      color: "whitesmoke",
    },
  }),
};
