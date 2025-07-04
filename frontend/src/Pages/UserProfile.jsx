import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom'; 
import "./CSS/UserProfile.css";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      if (response.data.profileImage) {
        setImagePreview(response.data.profileImage);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load profile data.");
      if (error.response && error.response.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        navigate('/login');
      }
    }
  };

  const handleBackButtonClick = () => {
    navigate("/");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      if (uploadedImage) {
        formData.append("profileImage", uploadedImage);
      }
      formData.append("name", userData.name);
      formData.append("email", userData.email);

      const token = localStorage.getItem("auth-token");
      await axios.put("/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, 
        },
      });
      toast.success("Profile updated successfully!");
      fetchUserProfile();
      setIsEditing(false);
      setUploadedImage(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
      if (error.response && error.response.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        navigate('/login');
      }
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOpenChangePasswordModal = () => {
    setShowChangePasswordModal(true);
    setChangePasswordError(""); // Clear any previous error messages
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setChangePasswordError("");
  };

  const handleSavePassword = async () => {
    setChangePasswordError("");
    if (!currentPassword) {
      setChangePasswordError("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      setChangePasswordError("Please enter new password.");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 8) {
      setChangePasswordError("New password must be between 6 and 8 characters.");
      return;
    }

    try {
      const token = localStorage.getItem("auth-token");
      await axios.put("/api/profile/password", {
          currentPassword,
          newPassword,
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password updated successfully! Please login again.");
      handleCloseChangePasswordModal();
      localStorage.removeItem('auth-token');
      navigate('/login');
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update password. Please check your current password."
      );
      if (error.response?.data?.message === "Incorrect current password.") {
        setChangePasswordError("Incorrect current password.");
      }
      if (error.response && error.response.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        navigate('/login');
      }
    }
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>
      <div className="profile-grid">
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            <img
              src={imagePreview || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <label htmlFor="image-upload" className="upload-button">Upload New Image</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{display: "none"}}
          />
        </div>

        <div className="profile-info-section">
          <div className="info-item">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={isEditing ? "" : "readonly"}
            />
          </div>
          <div className="info-item">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={isEditing ? "" : "readonly"}
            />
          </div>
        </div>

        <div className="profile-actions">
          <button className="back-button" onClick={handleBackButtonClick}>Back</button>
          {!isEditing ? (
            <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
            ) : (
            <button className="save-button" onClick={handleSaveClick}>Save Changes</button>
          )}
          <button
            className="change-password-button"
            onClick={handleOpenChangePasswordModal}>
            Update Password
          </button>
        </div>
      </div>

      {showChangePasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Password</h2>
            <div className="modal-content">
              <div className="modal-row">
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="modal-row">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button
                  className="modal-back-button"
                  onClick={handleCloseChangePasswordModal}>
                  Back
                </button>
                <button
                  className="modal-save-button"
                  onClick={handleSavePassword}>
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

