import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import './Admin.css';

const Admin = () => {
  const [activePage, setActivePage] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    status: true,
    images: [],
    sizes: [],
    cid: ''
  });
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    role: 'user'
  });
  const [productError, setProductError] = useState('');
  const [userError, setUserError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:9999/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  };

  const fetchUsers = () => {
    axios.get('http://localhost:9999/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  };

  const fetchCategories = () => {
    axios.get('http://localhost:9999/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  };

  const handleCreateProduct = () => {
    setProductError('');

    if (!newProduct.name || newProduct.price === '' || newProduct.cid === '') {
      setProductError('Please fill out all required fields.');
      return;
    }

    if (newProduct.price < 0) {
      setProductError('Price cannot be less than 0.');
      return;
    }

    if (editingProduct) {
      axios.put(`http://localhost:9999/products/${editingProduct.id}`, newProduct)
        .then(response => {
          setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
          setEditingProduct(null);
          setShowProductModal(false);
          resetNewProduct();
        })
        .catch(error => console.error('Error updating product:', error));
    } else {
      const maxId = Math.max(...products.map(p => parseInt(p.id)), 0);
      const newId = (maxId + 1).toString();
      const productWithId = { ...newProduct, id: newId };
      
      axios.post('http://localhost:9999/products', productWithId)
        .then(response => {
          setProducts([...products, response.data]);
          setShowProductModal(false);
          resetNewProduct();
        })
        .catch(error => console.error('Error creating product:', error));
    }
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: '',
      price: 0,
      status: true,
      images: [],
      sizes: [],
      cid: ''
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
    setShowUserModal(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`http://localhost:9999/products/${id}`)
        .then(() => {
          setProducts(products.filter(p => p.id !== id));
        })
        .catch(error => console.error('Error deleting product:', error));
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`http://localhost:9999/users/${id}`)
        .then(() => {
          setUsers(users.filter(u => u.id !== id));
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowProductModal(true);
  };

  const handleAddImage = () => {
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, { id: newProduct.images.length + 1, name: '' }]
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...newProduct.images];
    updatedImages.splice(index, 1);
    setNewProduct({ ...newProduct, images: updatedImages });
  };

  const handleAddSize = () => {
    setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, ''] });
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = [...newProduct.sizes];
    updatedSizes.splice(index, 1);
    setNewProduct({ ...newProduct, sizes: updatedSizes });
  };

  const handleImageUrlChange = (index, value) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index].name = value;
    setNewProduct({ ...newProduct, images: updatedImages });
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...newProduct.sizes];
    updatedSizes[index] = value;
    setNewProduct({ ...newProduct, sizes: updatedSizes });
  };

  return (
    <div>
      <Container className="my-5 dashboard-container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Dashboard</h3>
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => setActivePage('products')}>
              <a href="#">Manage Products</a>
            </li>
            <li onClick={() => setActivePage('users')}>
              <a href="#">Manage Users</a>
            </li>
          </ul>
        </div>

        <div className="main-content">
          {activePage === 'products' && (
            <div id="products">
              <h2>Manage Products</h2>
              <Button className="btn-custom" onClick={() => {
                setEditingProduct(null);
                resetNewProduct();
                setShowProductModal(true);
              }}>
                Create Product
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.cid}</td>
                      <td>{product.status ? 'Active' : 'Inactive'}</td>
                      <td>
                        <Button className="btn-custom" onClick={() => handleEditProduct(product)}>
                          Edit
                        </Button>
                        <Button className="btn-custom btn-danger" onClick={() => handleDeleteProduct(product.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {activePage === 'users' && (
            <div id="users">
              <h2>Manage Users</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.address}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.role}</td>
                      <td className="table-actions">
                        <Button className="btn-custom" onClick={() => handleEditUser(user)}>
                          Edit
                        </Button>
                        <Button className="btn-custom btn-danger" onClick={() => handleDeleteUser(user.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Container>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Create Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productError && <Alert variant="danger">{productError}</Alert>}
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formProductPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formProductCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={newProduct.cid}
                onChange={(e) => setNewProduct({ ...newProduct, cid: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProductStatus">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={newProduct.status}
                onChange={(e) => setNewProduct({ ...newProduct, status: e.target.checked })}
              />
            </Form.Group>
            <Form.Group controlId="formProductImages">
              <Form.Label>Images</Form.Label>
              {newProduct.images.map((image, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Image URL"
                    value={image.name}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  />
                  <Button variant="danger" className="ml-2" onClick={() => handleRemoveImage(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddImage}>Add Image</Button>
            </Form.Group>
            <Form.Group controlId="formProductSizes">
              <Form.Label>Sizes</Form.Label>
              {newProduct.sizes.map((size, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Size"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                  />
                  <Button variant="danger" className="ml-2" onClick={() => handleRemoveSize(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddSize}>Add Size</Button>
              
            </Form.Group>
            <Button variant="primary" onClick={handleCreateProduct}>
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* User Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Create User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userError && <Alert variant="danger">{userError}</Alert>}
          <Form>
            <Form.Group controlId="formUserFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUserPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUserAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUserPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={newUser.phoneNumber}
                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUserRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="shipper">Shipper</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={() => {
              // Add your create/update logic here
              if (editingUser) {
                // Update user logic
              } else {
                // Create user logic
              }
            }}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Admin;
