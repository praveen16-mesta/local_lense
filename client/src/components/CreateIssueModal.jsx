import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const CATEGORIES = ['Potholes', 'Water Supply', 'Electricity', 'Waste Management', 'Safety', 'Roads', 'Other'];

export default function CreateIssueModal({ isOpen, onClose, onIssueCreated, currentUser }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Potholes');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      alert('Please fill out title, description, and location.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('urgency', urgency);
      formData.append('reporterName', currentUser ? currentUser.name : 'Anonymous Citizen');
      formData.append('reporterEmail', currentUser ? currentUser.email : 'citizen@locallens.org');
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await axios.post('/api/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onIssueCreated(res.data);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      console.error('Create issue error:', err);
      alert('Error creating issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>Report a Community Issue</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Issue Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Deep Pothole on Main Street"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Urgency Level</label>
              <select
                className="form-control"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location / Address *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Corner of 5th Ave and Elm St"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Detailed Description *</label>
            <textarea
              className="form-control"
              placeholder="Provide clear details to help city maintenance locate and resolve the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Attach Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
