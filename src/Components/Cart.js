import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext"; // Đảm bảo đường dẫn đúng

export default function Cart() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    const handleCheckout = () => {
        if (!isAuthenticated) {
            alert('Phải đăng nhập để thanh toán');
            navigate('/login');
            return;
        }

        if (cartItems.length > 0) {
            navigate('/verify-order', { state: { cartItems } });
        }
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const handleClearCart = () => {
        localStorage.removeItem('cart');
        localStorage.removeItem('cartCount');
        setCartItems([]);
        window.location.reload(); 
    };

    const handleQuantityChange = (productId, size, quantity) => {
        if (quantity < 1) {
            quantity = 1;
        }
        const updatedCartItems = cartItems.map(item => 
            item.id === productId && item.size === size ? { ...item, quantity: Number(quantity) } : item
        );
        setCartItems(updatedCartItems);
    };

    return (
        <Container style={{ minHeight: '40vh' }}>
            <h1 className="text-center">SHOPPING CART</h1>
            <Row className="my-3">
                <Col xs={12} md={8}>
                    {cartItems.length > 0 ? (
                        <>
                            <div className="d-flex justify-content-between mb-3">
                                <Button variant="danger" onClick={handleClearCart}>Xóa</Button>
                            </div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Size</th>
                                        <th>Giá</th>
                                        <th>Ảnh</th>
                                        <th>Số lượng</th>
                                        <th>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={`${item.id}-${item.size}`}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.size}</td>
                                            <td>${item.price}</td>
                                            <td><img src={`${item.images[0]?.name}`} alt={item.name} style={{ width: '50px' }} /></td>
                                            <td>
                                                <Form.Control 
                                                    type="number" 
                                                    value={item.quantity} 
                                                    min="1"
                                                    onChange={(e) => handleQuantityChange(item.id, item.size, e.target.value)}
                                                />
                                            </td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    ) : (
                        <div className="text-center empty-cart">
                            <p>Không có sản phẩm nào trong giỏ hàng</p>
                            <Link to="/" className="btn btn-primary">Tiếp tục mua hàng</Link>
                        </div>
                    )}
                </Col>
                <Col xs={12} md={4}>
                    <div className="order-summary">
                        <h4>THÔNG TIN ĐƠN HÀNG</h4>
                        <div className="order-summary-details">
                            <h4>Tổng đơn hàng: {subTotal.toFixed(2)} USD</h4>
                        </div>
                        <Button className="btn-block" disabled={cartItems.length === 0} onClick={handleCheckout}>THANH TOÁN</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
