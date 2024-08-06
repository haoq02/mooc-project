import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderSuccess = () => {
    return (
        <Container className="text-center" style={{ minHeight: '40vh', paddingTop: '50px' }}>
            <h1>Đặt hàng thành công!</h1>
            <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
            <p>Đơn hàng của bạn đã được đặt thành công và sẽ sớm được xử lý.</p>
            <div className="order-success-actions">
                <Button as={Link} to="/" variant="primary" className="m-2">
                    Về trang chủ
                </Button>
                <Button as={Link} to="/products" variant="secondary" className="m-2">
                    Tiếp tục mua sắm
                </Button>
            </div>
        </Container>
    );
};

export default OrderSuccess;
