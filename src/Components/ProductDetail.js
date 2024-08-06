import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./ProductDetail.css";

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);

  const addToCart = (product) => {
    if (!localStorage.getItem("user")) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    if (!product.status) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    if (!selectedSize) {
      alert("Vui lòng chọn kích thước!");
      return;
    }

    let cartItem = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cartItem.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingProduct !== -1) {
      cartItem[existingProduct].quantity += 1;
    } else {
      cartItem.push({ ...product, size: selectedSize, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartItem));

    // Update cart count in localStorage
    const cartCount = cartItem.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem("cartCount", cartCount);

    alert("Sản phẩm đã được thêm vào giỏ hàng!");
    window.location.reload();
  };

  useEffect(() => {
    axios.get(`http://localhost:9999/products/${id}`).then((response) => {
      setProduct(response.data);
    });
  }, [id]);

  const handleImageClick = (imageName) => {
    setProduct({ ...product, mainImage: imageName });
  };

  const handleSizeChoose = (size) => {
    if (!product.status) return;
    setSelectedSize(size);
  };

  return (
    <Container className="product-detail">
      <Row>
        <Col xs={12} md={6}>
          <Card style={{ height: "655px", width: "530px" }}>
            <Card.Img
              className="product-image"
              variant="top"
              src={product.mainImage || product?.images?.[0]?.name}
              alt={product?.name}
              style={{ height: "655px", width: "530px" }}
            />
          </Card>
          <Row className="mt-2">
            {product?.images?.map((image, index) => (
              <Col key={index} xs={3}>
                <Card.Img
                  className="product-thumbnail"
                  src={image.name}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => handleImageClick(image.name)}
                />
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={12} md={5}>
          <h3>{product?.name}</h3>
          <h2>Price: {product?.price} USD</h2>
          <div className="sizes mt-3">
            <h4>Select Size:</h4>
            {product?.sizes?.map((size, index) => (
              <div
                key={index}
                className={`size-option ${!product.status ? "disabled" : ""} ${
                  selectedSize === size ? "active" : ""
                }`}
                onClick={() => handleSizeChoose(size)}
              >
                {size}
              </div>
            ))}
          </div>
          <h3>
            Status:{" "}
            {product?.status ? (
              <span style={{ color: "green" }}>In stock</span>
            ) : (
              <span style={{ color: "red" }}>Out of stock</span>
            )}
          </h3>
          <Button variant="success" onClick={() => addToCart(product)}>
            Thêm vào giỏ hàng
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
