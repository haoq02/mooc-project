import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ShipperOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:9999/orders');
                const ordersData = response.data;

                // Fetch user details for each order
                const updatedOrders = await Promise.all(
                    ordersData.map(async (order) => {
                        try {
                            const userResponse = await axios.get(`http://localhost:9999/users/${order.customerId}`);
                            return {
                                ...order,
                                user: userResponse.data,
                            };
                        } catch (userError) {
                            console.error('Error fetching user details:', userError);
                            return {
                                ...order,
                                user: null,
                            };
                        }
                    })
                );

                setOrders(updatedOrders);
            } catch (fetchError) {
                console.error('Error fetching orders:', fetchError);
                setError('Có lỗi xảy ra khi lấy dữ liệu đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        const confirmationMessage = newStatus === 'accepted'
            ? 'Bạn có chắc muốn nhận đơn hàng này?'
            : 'Bạn có chắc muốn đánh dấu đơn hàng này là hoàn thành?';

        const confirmation = window.confirm(confirmationMessage);

        if (!confirmation) {
            return;
        }

        try {
            await axios.patch(`http://localhost:9999/orders/${orderId}`, { status: newStatus });
            setOrders((prevOrders) =>
                prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            setError('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
        }
    };

    if (loading) {
        return <p>Đang tải...</p>;
    }

    return (
        <Container style={{ minHeight: '40vh' }} className="shipper-orders">
            <h1>Quản lý đơn đặt hàng cho Shipper</h1>
            {error && <p className="text-danger">{error}</p>}
            {orders.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID Đơn hàng</th>
                            <th>Tên người nhận</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th>Tổng cộng</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user?.fullName || 'N/A'}</td>
                                <td>{order.user?.address || 'N/A'}</td>
                                <td>{order.user?.phoneNumber || 'N/A'}</td>
                                <td>${order.total.toFixed(2)}</td>
                                <td>
                                    {order.status === 'false' ? 'Đang xử lý' : 
                                     order.status === 'accepted' ? 'Đã nhận đơn' : 
                                     'Hoàn thành'}
                                </td>
                                <td>
                                    <Button as={Link} to={`/order-details/${order.id}`} variant="info" className="me-2">
                                        Xem chi tiết
                                    </Button>
                                    {order.status === 'false' && (
                                        <Button
                                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                                            variant="primary"
                                            className="me-2"
                                        >
                                            Nhận đơn
                                        </Button>
                                    )}
                                    {order.status === 'accepted' && (
                                        <Button
                                            onClick={() => updateOrderStatus(order.id, 'true')}
                                            variant="success"
                                        >
                                            Đánh dấu hoàn thành
                                        </Button>
                                    )}
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

export default ShipperOrders;
