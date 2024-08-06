import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext"; // Import AuthContext
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Wishlist.css";

const Wishlist = () => {
  const { email } = useAuth(); // Get logged-in user's email from context
  const [wishlist, setWishlist] = useState({ email, productIds: [] });
  const [products, setProducts] = useState([]);
  

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:9999/wishlists?email=${email}`)
        .then((response) => {
          if (response.data.length > 0) {
            const userWishlist = response.data[0];
            setWishlist(userWishlist);

            const productIds = userWishlist.productIds;
            if (productIds.length > 0) {
              axios
                .get(`http://localhost:9999/products`)
                .then((productResponse) => {
                  const wishlistProducts = productResponse.data.filter(
                    (product) => productIds.includes(product.id)
                  );
                  setProducts(wishlistProducts);
                });
            }
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the wishlist!", error);
        });
    }
  }, [email]);

  

  const addToWishlist = (productId) => {
    if (email) {
      const updatedWishlist = {
        ...wishlist,
        productIds: [...wishlist.productIds, productId],
      };

      axios
        .put(`http://localhost:9999/wishlists/${wishlist.id}`, updatedWishlist)
        .then((response) => {
          setWishlist(updatedWishlist);
        })
        .catch((error) => {
          console.error(
            "There was an error adding the product to the wishlist!",
            error
          );
        });
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
      .then((response) => {
        setWishlist(updatedWishlist);
        setProducts(products.filter((product) => product.id !== productId));
      })
      .catch((error) => {
        console.error(
          "There was an error removing the product from the wishlist!",
          error
        );
      });
  };

  const isProductInWishlist = (productId) => {
    return wishlist && wishlist.productIds.includes(productId);
  };

  return (
    <Container style={{ marginBottom: "30px" }}>
      <h2>Your Wishlist</h2>
      <Row className="mt-3">
        {products.map((p) => (
          <Col style={{ marginBottom: "20px" }} key={p.id} sm={6} md={4} lg={3}>
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
                    variant={isProductInWishlist(p.id) ? "danger" : "secondary"}
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
                      : "Yêu thích"}
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Wishlist;
