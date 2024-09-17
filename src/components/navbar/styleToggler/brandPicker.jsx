import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';

function BrandPicker() {
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    
    // Navigate to different routes based on selected value
    if (selectedValue === "1") {
      navigate('/comparator');
    } else if (selectedValue === "2") {
      navigate('/comparator/nutrition');
    } else if (selectedValue === "3") {
      navigate('/comparator/professional');
    }
  };

  return (
    <Form.Select aria-label="Select the project" onChange={handleSelectChange}>
      <option>Select the project</option>
      <option value="1">Purina</option>
      <option value="2">Baby and me</option>
      <option value="3">Nestlé Professional</option>
    </Form.Select>
  );
}

export default BrandPicker;
