import React, { useState, useEffect } from "react";

import { Container, Carousel, Row, Col, Card, Form, Button } from "react-bootstrap";

import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext"; // Import AuthContext
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductList.css";

export function ProductList() {
  const { categoryid } = useParams();
  const { email } = useAuth(); // Get logged-in user's email from context
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("none");
  const [wishlist, setWishlist] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9999/categories").then((response) => {
      setCategories(response.data);
    });

    axios.get("http://localhost:9999/products").then((response) => {
      if (categoryid) {
        const filteredProducts = response.data.filter(
          (product) => product.cid.toString() === categoryid
        );
        setProducts(filteredProducts);
      } else {
        setProducts(response.data);
      }
    });

    if (email) {
      axios
        .get(`http://localhost:9999/wishlists?email=${email}`)
        .then((response) => {
          const userWishlist =
            response.data.length > 0
              ? response.data[0]
              : { email, productIds: [] };
          setWishlist(userWishlist);
        });
    }
  }, [categoryid, email]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    if (e.target.value === "lowToHigh") {
      setProducts([...products].sort((a, b) => a.price - b.price));
    } else if (e.target.value === "highToLow") {
      setProducts([...products].sort((a, b) => b.price - a.price));
    }
  };

  const addToWishlist = (productId) => {
    if (email) {
      const updatedWishlist = {
        ...wishlist,
        productIds: [...wishlist.productIds, productId],
      };

      if (wishlist.id) {
        axios
          .put(
            `http://localhost:9999/wishlists/${wishlist.id}`,
            updatedWishlist
          )
          .then(() => {
            setWishlist(updatedWishlist);
            alert("Product added to wishlist!");
          })
          .catch((error) => {
            console.error(
              "There was an error adding the product to the wishlist!",
              error
            );
            alert("Failed to add product to wishlist.");
          });
      } else {
        axios
          .post("http://localhost:9999/wishlists", updatedWishlist)
          .then((response) => {
            setWishlist(response.data);
            alert("Product added to wishlist!");
          })
          .catch((error) => {
            console.error(
              "There was an error adding the product to the wishlist!",
              error
            );
            alert("Failed to add product to wishlist.");
          });
      }
    } else {
      alert("Please log in to add items to your wishlist.");
    }
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = {
      ...wishlist,
      productIds: wishlist.productIds.filter((id) => id !== productId),
    };

    axios
      .put(`http://localhost:9999/wishlists/${wishlist.id}`, updatedWishlist)
      .then(() => {
        setWishlist(updatedWishlist);
        alert("Product removed from wishlist!");
      })
      .catch((error) => {
        console.error(
          "There was an error removing the product from the wishlist!",
          error
        );
        alert("Failed to remove product from wishlist.");
      });
  };

  const isProductInWishlist = (productId) => {
    return wishlist && wishlist.productIds.includes(productId);
  };

  return (
    <div>
      <Carousel controls={true} indicators={false}>
        <Carousel.Item interval={1000}>
          <img
            className="d-block w-100"
            src="https://file.hstatic.net/200000642007/file/vn__2_.jpg"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item interval={500}>
          <img
            className="d-block w-100"
            src="https://file.hstatic.net/200000642007/file/desktop-1920x640_690adfdae05f4db8a2b7ca47d95f236d.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://file.hstatic.net/200000642007/file/1920x640_f3fc87c077684b3782a0a793403bbf65.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>

      <Container style={{ marginBottom: "30px" }}>
        <Form.Group controlId="priceFilter" className="mb-3">
          <Form.Label>Sort by Price</Form.Label>
          <Form.Control
            as="select"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="none">Không</option>
            <option value="lowToHigh">Giá từ thấp đến cao</option>
            <option value="highToLow">Giá từ cao đến thấp</option>
          </Form.Control>
        </Form.Group>
        <Row className="mt-3">
          {products.map((p) => (
            <Col
              style={{ marginBottom: "20px" }}
              key={p.id}
              sm={6}
              md={4}
              lg={3}
            >
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
                    <strong>Giá:</strong> {p?.price} USD
                    <br />
                    <strong>Trạng thái:</strong>
                    {p?.status ? (
                      <span style={{ color: "green" }}>Còn hàng</span>
                    ) : (
                      <span style={{ color: "red" }}>Hết hàng</span>
                    )}
                    <br />
                  </Card.Text>
                  <Card.Text>
                    <Link
                      style={{ marginRight: "5px" }}
                      className="btn btn-danger"
                      to={`/product/${p.id}`}
                    >
                      Chi tiết
                    </Link>
                    <Button
                      variant={
                        isProductInWishlist(p.id) ? "danger" : "secondary"
                      }
                      onClick={() => {
                        if (isProductInWishlist(p.id)) {
                          removeFromWishlist(p.id);
                        } else {
                          addToWishlist(p.id);
                        }
                      }}
                      className="ml-2"
                    >
                      {isProductInWishlist(p.id)
                        ? "Bỏ yêu thích"
                        : "Yêu Thích"}
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
