import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem('email');
      try {
        const response = await axios.get(`http://localhost:9999/users?email=${email}`);
        if (response.data.length > 0) {
          setUser(response.data[0]);
          setUpdatedUser(response.data[0]);
        } else {
          setError('User not found');
        }
      } catch (error) {
        setError('Error fetching user details');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const validateProfileForm = () => {
    const validationErrors = {};
    let isValid = true;

    if (!updatedUser.fullName) {
      isValid = false;
      validationErrors.fullName = "Full name required";
    }
    if (!updatedUser.email) {
      isValid = false;
      validationErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(updatedUser.email)) {
      isValid = false;
      validationErrors.email = "Email is not valid";
    }
    if (!updatedUser.address) {
      isValid = false;
      validationErrors.address = "Address required";
    }
    if (!updatedUser.phoneNumber) {
      isValid = false;
      validationErrors.phoneNumber = "Phone number required";
    } else if (!/^\d{10}$/.test(updatedUser.phoneNumber)) {
      isValid = false;
      validationErrors.phoneNumber = "Phone number must be 10 digits";
    }

    setErrors(validationErrors);
    return isValid;
  };

  const validatePasswordForm = () => {
    const validationErrors = {};
    let isValid = true;

    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword) {
      isValid = false;
      validationErrors.oldPassword = "Old password required";
    }
    if (!newPassword) {
      isValid = false;
      validationErrors.newPassword = "New password required";
    } else if (newPassword.length < 6) {
      isValid = false;
      validationErrors.newPassword = "Password must be at least 6 characters";
    }
    if (newPassword !== confirmPassword) {
      isValid = false;
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateProfileForm()) return;

    try {
      await axios.patch(`http://localhost:9999/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      setError(null);
      alert('Profile updated successfully');
    } catch (error) {
      setError('Error updating profile');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswordForm()) return;

    const { oldPassword, newPassword } = passwords;

    if (oldPassword !== user.password) {
      alert('Old password is incorrect');
      return;
    }

    if (newPassword === oldPassword) {
      alert('New password must be different from the old password');
      return;
    }

    try {
      await axios.patch(`http://localhost:9999/users/${user.id}`, { password: newPassword });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setError(null);
      alert('Password updated successfully');
    } catch (error) {
      setError('Error updating password');
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'profile') {
      return (
        <div className="tab-content">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={updatedUser.fullName || ''}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error-message">{errors.fullName}</p>}
          
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={updatedUser.email || ''}
            onChange={handleChange}
            readOnly
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={updatedUser.address || ''}
            onChange={handleChange}
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
          
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={updatedUser.phoneNumber || ''}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
          
          <button className="button" onClick={handleSave}>Save Changes</button>
        </div>
      );
    } else if (activeTab === 'password') {
      return (
        <div className="tab-content">
          <h2>Change Password</h2>
          
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
          />
          {errors.oldPassword && <p className="error-message">{errors.oldPassword}</p>}
          
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
          />
          {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
          
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          
          <button className="button" onClick={handlePasswordUpdate}>Change Password</button>
        </div>
      );
    }
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <h1>User Profile</h1>
        </div>
        <div className="tabs">
          <div className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Edit Profile</div>
          <div className={`tab ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>Change Password</div>
        </div>
        {renderTabContent()}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;