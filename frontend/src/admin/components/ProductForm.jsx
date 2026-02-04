import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import ImageUploader from '../components/ImageUploader';

const ProductForm = ({ product, isEdit = false }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        compareAtPrice: product?.compareAtPrice || '',
        category: product?.category?._id || '',
        stock: product?.stock || '',
        sku: product?.sku || '',
        isActive: product?.isActive ?? true,
        isFeatured: product?.isFeatured ?? false,
        metaTitle: product?.metaTitle || '',
        metaDescription: product?.metaDescription || '',
        specifications: product?.specifications || {},
        features: product?.features || [],
        images: product?.images || [],
    });

    const [featureInput, setFeatureInput] = useState('');
    const [specKey, setSpecKey] = useState('');
    const [specValue, setSpecValue] = useState('');

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.post('/products', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            alert('Product created successfully!');
            navigate('/admin/products');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Failed to create product');
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.put(`/products/${product._id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            alert('Product updated successfully!');
            navigate('/admin/products');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Failed to update product');
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()],
            });
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (index) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    const handleAddSpecification = () => {
        if (specKey.trim() && specValue.trim()) {
            setFormData({
                ...formData,
                specifications: {
                    ...formData.specifications,
                    [specKey.trim()]: specValue.trim(),
                },
            });
            setSpecKey('');
            setSpecValue('');
        }
    };

    const handleRemoveSpecification = (key) => {
        const { [key]: removed, ...rest } = formData.specifications;
        setFormData({
            ...formData,
            specifications: rest,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <div>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="btn btn-outline btn-sm"
                        style={{ marginBottom: 'var(--spacing-sm)' }}
                    >
                        ← Back to Products
                    </button>
                    <h1 style={styles.title}>{isEdit ? 'Edit Product' : 'Create Product'}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Product Images */}
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h2 style={styles.sectionTitle}>Product Images</h2>
                    <ImageUploader
                        images={formData.images}
                        onImagesChange={(images) => setFormData({ ...formData, images })}
                    />
                </div>

                <div className="grid grid-2" style={{ gap: 'var(--spacing-xl)' }}>
                    {/* Basic Information */}
                    <div className="card">
                        <h2 style={styles.sectionTitle}>Basic Information</h2>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="input"
                                rows="4"
                            />
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>SKU *</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories?.data?.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="card">
                        <h2 style={styles.sectionTitle}>Pricing & Inventory</h2>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Price (DA) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    min="0"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Compare At Price (DA)</label>
                                <input
                                    type="number"
                                    name="compareAtPrice"
                                    value={formData.compareAtPrice}
                                    onChange={handleChange}
                                    className="input"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Stock *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    min="0"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Status</label>
                                <div style={styles.checkboxGroup}>
                                    <label style={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                        />
                                        Active
                                    </label>
                                    <label style={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleChange}
                                        />
                                        Featured
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h2 style={styles.sectionTitle}>Features</h2>

                    <div style={styles.formRow}>
                        <input
                            type="text"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            className="input"
                            placeholder="Enter a feature"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="btn btn-primary"
                        >
                            Add Feature
                        </button>
                    </div>

                    {formData.features.length > 0 && (
                        <div style={styles.featureList}>
                            {formData.features.map((feature, index) => (
                                <div key={index} style={styles.featureItem}>
                                    <span>✓ {feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        style={styles.removeBtn}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Specifications */}
                <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h2 style={styles.sectionTitle}>Specifications</h2>

                    <div style={styles.formRow}>
                        <input
                            type="text"
                            value={specKey}
                            onChange={(e) => setSpecKey(e.target.value)}
                            className="input"
                            placeholder="Key (e.g., voltage)"
                        />
                        <input
                            type="text"
                            value={specValue}
                            onChange={(e) => setSpecValue(e.target.value)}
                            className="input"
                            placeholder="Value (e.g., 5V)"
                        />
                        <button
                            type="button"
                            onClick={handleAddSpecification}
                            className="btn btn-primary"
                        >
                            Add Spec
                        </button>
                    </div>

                    {Object.keys(formData.specifications).length > 0 && (
                        <div style={styles.specList}>
                            {Object.entries(formData.specifications).map(([key, value]) => (
                                <div key={key} style={styles.specItem}>
                                    <div>
                                        <strong>{key}:</strong> {value}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSpecification(key)}
                                        style={styles.removeBtn}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SEO */}
                <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h2 style={styles.sectionTitle}>SEO (Optional)</h2>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Meta Title</label>
                        <input
                            type="text"
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Meta Description</label>
                        <textarea
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleChange}
                            className="input"
                            rows="3"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div style={styles.submitSection}>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={createMutation.isLoading || updateMutation.isLoading}
                    >
                        {createMutation.isLoading || updateMutation.isLoading
                            ? 'Saving...'
                            : isEdit
                                ? 'Update Product'
                                : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    header: {
        marginBottom: 'var(--spacing-2xl)',
    },
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        margin: 0,
    },
    sectionTitle: {
        fontSize: 'var(--font-size-xl)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-lg)',
    },
    formGroup: {
        marginBottom: 'var(--spacing-lg)',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
    },
    label: {
        display: 'block',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-xs)',
        color: 'var(--text-primary)',
    },
    checkboxGroup: {
        display: 'flex',
        gap: 'var(--spacing-lg)',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        fontSize: 'var(--font-size-sm)',
    },
    featureList: {
        marginTop: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
    },
    featureItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
    },
    specList: {
        marginTop: 'var(--spacing-lg)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 'var(--spacing-sm)',
    },
    specItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
    },
    removeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-error)',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0 var(--spacing-sm)',
    },
    submitSection: {
        marginTop: 'var(--spacing-2xl)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--spacing-md)',
    },
};

export default ProductForm;
