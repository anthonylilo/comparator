import React from "react";
import { Form } from "react-bootstrap";

function SelectField({ options, onChange, value }) {
  return (
    <Form.Select onChange={onChange} value={value}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
}

export default SelectField;
