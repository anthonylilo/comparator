import React from "react";
import { Row, Col, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

function SplitBasicExample() {
    return (
        <Container className='px-5 pt-4 text-left'>
        <Row>
            <Col md={12}>
            <h3 className="tools-header">Tools:</h3>
            </Col>
            <Col md={12}>
                <Dropdown as={ButtonGroup}>
                    <Button className='section-btn left-text' >Matrix Mirror</Button>

                    <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                    <Dropdown.Menu>
                        <Dropdown.Item href="/comparator/purina">Purina</Dropdown.Item>
                        <Dropdown.Item href="/comparator/nutrition">Baby and Me</Dropdown.Item>
                        <Dropdown.Item href="/comparator/professional">Nestlé Professional</Dropdown.Item>
                        <Dropdown.Item href="/comparator/recetas">Recetas Nestlé</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Col md={12}>
                    <Button href='/comparator/seo-checker' className='section-btn'>SEO Checker</Button>
            </Col>
            <Col md={12}>
                    <Button href='/comparator/url-status-checker' className='section-btn' >URL Status Checker</Button>
            </Col>
        </Row>
        </Container>
    );
}

export default SplitBasicExample;