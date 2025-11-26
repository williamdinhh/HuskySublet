import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, Listing } from '../utils/api';
import './Auth.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<'buyer' | 'seller' | 'both'>(user?.role || 'buyer');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Form state for new/editing listing
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    neighborhood: 'U-District' as 'U-District' | 'Capitol Hill' | 'Northgate' | 'Other',
    startDate: '',
    endDate: '',
    images: [] as string[],
    vibes: [] as string[],
    promptQuestion: '',
    promptAnswer: '',
    imageUrl: '', // For adding images one at a time
  });

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    loadMyListings();
  }, []);

  const loadMyListings = async () => {
    try {
      setLoading(true);
      const response = await api.getMyListings();
      setMyListings(response.listings);
    } catch (err: any) {
      setError(err.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole: 'buyer' | 'seller' | 'both') => {
    try {
      const response = await api.updateRole(newRole);
      setRole(newRole);
      updateUser(response.user);
      alert('Role updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    try {
      // Use _id if available, otherwise use id
      const listingId = id || (myListings.find(l => l._id === id)?._id) || (myListings.find(l => (l as any).id === id)?.(l as any).id);
      await api.deleteListing(listingId);
      setMyListings(myListings.filter(l => l._id !== id && (l as any).id !== id));
      alert('Listing deleted successfully!');
      loadMyListings(); // Reload to ensure sync
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  const handleAddImage = () => {
    if (formData.imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, formData.imageUrl.trim()],
        imageUrl: '',
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddVibe = (vibe: string) => {
    if (!formData.vibes.includes(vibe)) {
      setFormData({
        ...formData,
        vibes: [...formData.vibes, vibe],
      });
    }
  };

  const handleRemoveVibe = (vibe: string) => {
    setFormData({
      ...formData,
      vibes: formData.vibes.filter(v => v !== vibe),
    });
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const listingData = {
        title: formData.title,
        price: Number(formData.price),
        neighborhood: formData.neighborhood,
        startDate: formData.startDate,
        endDate: formData.endDate,
        images: formData.images,
        vibes: formData.vibes,
        promptQuestion: formData.promptQuestion,
        promptAnswer: formData.promptAnswer,
      };

      if (editingListing) {
        // Update existing listing
        await api.updateListing(editingListing._id, listingData);
        alert('Listing updated successfully!');
      } else {
        // Create new listing
        await api.createListing(listingData);
        alert('Listing created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        price: '',
        neighborhood: 'U-District',
        startDate: '',
        endDate: '',
        images: [],
        vibes: [],
        promptQuestion: '',
        promptAnswer: '',
        imageUrl: '',
      });
      setShowAddForm(false);
      setEditingListing(null);
      loadMyListings();
    } catch (err: any) {
      alert(err.message || 'Failed to save listing');
    }
  };

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title,
      price: listing.price.toString(),
      neighborhood: listing.neighborhood,
      startDate: listing.startDate.split('T')[0],
      endDate: listing.endDate.split('T')[0],
      images: listing.images || [],
      vibes: listing.vibes || [],
      promptQuestion: listing.promptQuestion,
      promptAnswer: listing.promptAnswer,
      imageUrl: '',
    });
    setShowAddForm(true);
  };

  const availableVibes = ['Quiet', 'Social', 'Clean', 'Pet-friendly', 'Modern', 'Chill', 'Spacious', 'Study-friendly', 'Furnished', 'Backyard', 'Gym access', 'Bright', 'Creative', 'Unique'];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem',
        color: 'white',
        textAlign: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Profile</h1>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '1rem' }}>{user?.name || 'User'}</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Role Selection Card */}
        <div style={{
          marginBottom: '2rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600', color: '#1d1d1f' }}>
            Your Role
          </h2>
          <p style={{ margin: '0 0 1.5rem', color: '#666', fontSize: '0.95rem' }}>
            Choose whether you're looking for a place (buyer), offering a place (seller), or both.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleRoleChange('buyer')}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: role === 'buyer' ? '#007AFF' : '#e0e0e0',
                background: role === 'buyer' ? '#007AFF' : 'white',
                color: role === 'buyer' ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: role === 'buyer' ? '600' : '500',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (role !== 'buyer') {
                  e.currentTarget.style.borderColor = '#007AFF';
                  e.currentTarget.style.background = '#f0f8ff';
                }
              }}
              onMouseLeave={(e) => {
                if (role !== 'buyer') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              Buyer
            </button>
            <button
              onClick={() => handleRoleChange('seller')}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: role === 'seller' ? '#007AFF' : '#e0e0e0',
                background: role === 'seller' ? '#007AFF' : 'white',
                color: role === 'seller' ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: role === 'seller' ? '600' : '500',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (role !== 'seller') {
                  e.currentTarget.style.borderColor = '#007AFF';
                  e.currentTarget.style.background = '#f0f8ff';
                }
              }}
              onMouseLeave={(e) => {
                if (role !== 'seller') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              Seller
            </button>
            <button
              onClick={() => handleRoleChange('both')}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: role === 'both' ? '#007AFF' : '#e0e0e0',
                background: role === 'both' ? '#007AFF' : 'white',
                color: role === 'both' ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: role === 'both' ? '600' : '500',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (role !== 'both') {
                  e.currentTarget.style.borderColor = '#007AFF';
                  e.currentTarget.style.background = '#f0f8ff';
                }
              }}
              onMouseLeave={(e) => {
                if (role !== 'both') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              Both
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666', textAlign: 'center' }}>
            Current role: <strong style={{ color: '#007AFF' }}>{role}</strong>
          </p>
        </div>

        {/* My Listings Section */}
        {(role === 'seller' || role === 'both') && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1d1d1f' }}>
                My Listings
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditingListing(null);
                  if (!showAddForm) {
                    setFormData({
                      title: '',
                      price: '',
                      neighborhood: 'U-District',
                      startDate: '',
                      endDate: '',
                      images: [],
                      vibes: [],
                      promptQuestion: '',
                      promptAnswer: '',
                      imageUrl: '',
                    });
                  }
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#007AFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0051D5';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,122,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#007AFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,122,255,0.3)';
                }}
              >
                {showAddForm ? 'Cancel' : '+ Add Listing'}
              </button>
            </div>

            {showAddForm && (
              <div style={{
                marginBottom: '2rem',
                padding: '2rem',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              }}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: '600', color: '#1d1d1f' }}>
                  {editingListing ? 'Edit Listing' : 'New Listing'}
                </h3>
                
                <form onSubmit={handleSubmitListing}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g., Cozy 2-bedroom near campus"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Price ($/month)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        min="0"
                        placeholder="1200"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Neighborhood</label>
                      <select
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value as any })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          fontSize: '1rem',
                          outline: 'none',
                          background: 'white',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      >
                        <option value="U-District">U-District</option>
                        <option value="Capitol Hill">Capitol Hill</option>
                        <option value="Northgate">Northgate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Images (URLs)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="Enter image URL"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: '#34C759',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        Add
                      </button>
                    </div>
                    {formData.images.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {formData.images.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={img} alt={`Preview ${idx + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#FF3B30',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Vibes</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {availableVibes.map(vibe => (
                        <button
                          key={vibe}
                          type="button"
                          onClick={() => formData.vibes.includes(vibe) ? handleRemoveVibe(vibe) : handleAddVibe(vibe)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid',
                            borderColor: formData.vibes.includes(vibe) ? '#007AFF' : '#e0e0e0',
                            background: formData.vibes.includes(vibe) ? '#007AFF' : 'white',
                            color: formData.vibes.includes(vibe) ? 'white' : '#333',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                          }}
                        >
                          {vibe} {formData.vibes.includes(vibe) ? '✓' : '+'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Prompt Question</label>
                    <input
                      type="text"
                      value={formData.promptQuestion}
                      onChange={(e) => setFormData({ ...formData, promptQuestion: e.target.value })}
                      required
                      placeholder="e.g., What makes this place special?"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Prompt Answer</label>
                    <textarea
                      value={formData.promptAnswer}
                      onChange={(e) => setFormData({ ...formData, promptAnswer: e.target.value })}
                      required
                      rows={4}
                      placeholder="Describe your place..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#007AFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0051D5';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#007AFF';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {editingListing ? 'Update Listing' : 'Create Listing'}
                  </button>
                </form>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <p>Loading listings...</p>
              </div>
            ) : myListings.length === 0 ? (
              <div style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#666',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              }}>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>You don't have any listings yet.</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem', opacity: 0.8 }}>Click "Add Listing" to create one!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {myListings.map((listing) => (
                  <div key={listing._id} style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '600', color: '#1d1d1f' }}>
                          {listing.title}
                        </h3>
                        <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.95rem' }}>
                          <strong style={{ color: '#007AFF' }}>${listing.price}</strong>/month • {listing.neighborhood}
                        </p>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
                          {new Date(listing.startDate).toLocaleDateString()} - {new Date(listing.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditListing(listing)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#007AFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing._id || (listing as any).id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#FF3B30',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {listing.images && listing.images.length > 0 && (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          marginBottom: '1rem',
                        }}
                      />
                    )}
                    {listing.vibes && listing.vibes.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {listing.vibes.map(vibe => (
                          <span
                            key={vibe}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#f0f0f0',
                              borderRadius: '12px',
                              fontSize: '0.875rem',
                              color: '#666',
                            }}
                          >
                            {vibe}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#FFEBEE',
            color: '#C62828',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        zIndex: 1000,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Home</span>
        </button>
        <button
          onClick={() => navigate('/chat')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/chat' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Chat</span>
        </button>
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/profile' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Profile</span>
        </button>
      </nav>
    </div>
  );
}
