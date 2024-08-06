import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Table, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState({});

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderResponse = await axios.get(`http://localhost:9999/orders/${id}`);
                setOrder(orderResponse.data);

                // Fetch product details for each product in the order
                const productIds = orderResponse.data.orderItems.map(item => item.pid);
                const productResponses = await Promise.all(productIds.map(pid => axios.get(`http://localhost:9999/products/${pid}`)));

                const productData = productResponses.reduce((acc, response) => {
                    acc[response.data.id] = response.data;
                    return acc;
                }, {});

                setProducts(productData);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [id]);

    return (
        <Container className="order-details">
            <h1>Chi tiết đơn hàng</h1>
            {order ? (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Size</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item, index) => {
                                const product = products[item.pid];
                                return (
                                    <tr key={index}>
                                        <td>{item.pid}</td>
                                        <td>
                                            {product && <Image src={product.images[0]?.name} alt={product.name} thumbnail style={{ width: '50px' }} />}
                                        </td>
                                        <td>{product?.name}</td>
                                        <td>{item.size}</td>
                                        <td>{item.quantity}</td>
                                        <td>{product?.price.toFixed(2)} USD</td>
                                        <td>{(product?.price * item.quantity).toFixed(2)} USD</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <h3>Tổng cộng: {order.total.toFixed(2)} USD</h3>
                </>
            ) : (
                <p>Đang tải chi tiết đơn hàng...</p>
            )}
        </Container>
    );
};

export default OrderDetails;
