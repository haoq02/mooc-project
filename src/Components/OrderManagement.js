import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/orders?customerId=${user.id}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Có lỗi xảy ra khi lấy dữ liệu đơn hàng.');
            }
        };

        fetchOrders();
    }, [user.id]);

    return (
        <Container style={{ minHeight: '40vh' }} className="order-management">
            <h1>Quản lý đơn hàng</h1>
            {error && <p className="text-danger">{error}</p>}
            {orders.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID Đơn hàng</th>
                            <th>Tổng cộng</th>
                            <th>Trạng thái</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>${order.total.toFixed(2)}</td>
                                <td style={{ fontWeight: 'bold' }}>
                                    {order.status === 'false' ? (
                                        <span className="text-danger">Đang xử lý</span>
                                    ) : order.status === 'accepted' ? (
                                        <span className="text-warning">Đã nhận đơn</span>
                                    ) : (
                                        <span className="text-success">Hoàn thành</span>
                                    )}
                                </td>
                                <td>
                                    <Button as={Link} to={`/order-details/${order.id}`} variant="info">
                                        Xem chi tiết
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>Không có đơn hàng nào.</p>
            )}
        </Container>
    );
};

export default OrderManagement;
