import Accordion from 'react-bootstrap/Accordion';

function Desplegables() {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Links</Accordion.Header>
        <Accordion.Body>
          resultado del test
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Marcas</Accordion.Header>
        <Accordion.Body>
resultado del otro test
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Desplegables;