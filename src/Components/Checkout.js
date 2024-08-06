import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Checkout.css';

const CheckOut = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setFormData({
                fullName: user.fullName,
                email: user.email,
                phone: user.phoneNumber,
                address: user.address || '',
            });
        } else {
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                address: '',
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        // Create order object
        const order = {
            customerId: user.id,
            status: "false",
            total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            orderItems: cartItems.map(item => ({
                pid: item.id,
                size: item.size,
                quantity: item.quantity
            }))
        };

        try {
            await axios.post('http://localhost:9999/orders', order);
            localStorage.removeItem('cart');
            localStorage.removeItem('cartCount');
            navigate('/order-success'); 
        } catch (error) {
            console.error('There was an error submitting the order:', error);
        }
    };

    return (
        <Container>
            <h2>Thông tin giao hàng</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="fullName">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập Họ và tên"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="phone">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập Số điện thoại"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-muted">
                                Số điện thoại không hợp lệ (độ dài từ 10 - 11 ký tự, không chứa ký tự đặc biệt và khoảng trắng)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="address">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Địa chỉ"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <div className="order-summary">
                            <h3>Tóm tắt đơn hàng</h3>
                            {cartItems.map((item) => (
                                <div className="order-item" key={`${item.id}-${item.size}`}>
                                    <div className="item-image">
                                        <img src={item.images[0]?.name} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p>Size: {item.size}</p>
                                        <p>Giá: ${item.price.toFixed(2)}</p>
                                        <p>Số lượng: {item.quantity}</p>
                                        <p>Tổng: ${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="order-total">
                                <h4>Tổng cộng</h4>
                                <p>{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} USD</p>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="order-actions">
                    <Button variant="secondary" type="button" onClick={() => navigate('/cart')}>Quay lại giỏ hàng</Button>
                    <Button variant="primary" type="submit">Hoàn tất đơn hàng</Button>
                </div>
            </Form>
        </Container>
    );
};

export default CheckOut;
