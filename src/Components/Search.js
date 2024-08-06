import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './ProductList.css';

export function Search() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9999/products");
        setProducts(response.data);
      } catch (error) {
        setError('Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    if (filtered.length === 0) {
      setError('Không tìm thấy sản phẩm nào.');
    } else {
      setError('');
    }
  };

  return (
    <Container style={{ minHeight: '34vh' }}>
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="searchQuery">
          <Form.Label>Tìm kiếm sản phẩm</Form.Label>
          <InputGroup>
            <Form.Control 
              type="text" 
              placeholder="Nhập tên sản phẩm..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
            <Button type="submit" variant="outline-secondary">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Row className="mt-3">
        {filteredProducts.map((p) => (
          <Col style={{ marginBottom: '20px' }} key={p.id} sm={6} md={4} lg={3}>
            <Card>
              <Card.Body>
                <Card.Img
                  className="product-image"
                  variant="top"
                  src={`${p.images[0]?.name}`}
                  alt={p?.name}
                />
                <Card.Title>{p?.name}</Card.Title>
                <Card.Text>
                  <strong>Giá:</strong> {p?.price} USD<br />
                  <strong>Trạng thái:</strong>
                  {p?.status ? (
                    <span style={{ color: 'green' }}>Còn hàng</span>
                  ) : (
                    <span style={{ color: 'red' }}>Hết hàng</span>
                  )}
                </Card.Text>
                <Card.Text>
                  <Link style={{ marginRight: '5px' }} className="btn btn-danger" to={`/product/${p.id}`}>Chi tiết</Link>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
