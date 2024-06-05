import Dropdown from 'react-bootstrap/Dropdown';

function dropdowns() {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Seleccionar Proyecto
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Purina</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Baby and me</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Nestlé Proffe</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  
  export default dropdowns;