import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-dark text-light">
            <Container>
                <Row>
                    <Col md={3}>
                        <h5>Company</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-dark text-light">About Us</ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">Careers</ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">Contact</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <h5>Help</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-dark text-light">Customer Service</ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">Returns</ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">Shipping</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <h5>Legal</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-dark text-light">Privacy Policy</ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">Terms of Use</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <h5>Follow Us</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-dark text-light">Facebook</ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">Twitter</ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">Instagram</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center mt-3">
                        <p>&copy; 2024 MLB. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
