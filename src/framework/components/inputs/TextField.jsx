import React from "react";
import { TextField as MuiTextField } from "@mui/material";

const TextField = React.forwardRef((props, ref) => {
  return <MuiTextField {...props} inputRef={ref} />;
});

export default TextField;