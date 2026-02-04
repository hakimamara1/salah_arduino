import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CategoryList = () => {
    const queryClient = useQueryClient();

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/categories/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            alert('Category deleted successfully!');
        },
    });

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div style={styles.header}>
                <h1 style={styles.title}>Categories</h1>
                <Link to="/admin/categories/create" className="btn btn-primary">
                    + Add Category
                </Link>
            </div>

            <div className="grid grid-3" style={{ gap: 'var(--spacing-lg)' }}>
                {categories?.data?.map((category) => (
                    <div key={category._id} className="card" style={styles.categoryCard}>
                        {category.image?.url && (
                            <div style={styles.imageContainer}>
                                <img
                                    src={category.image.url}
                                    alt={category.name}
                                    style={styles.categoryImage}
                                />
                            </div>
                        )}
                        <div style={styles.categoryContent}>
                            <h3 style={styles.categoryName}>{category.name}</h3>
                            <p style={styles.categoryDescription}>
                                {category.description || 'No description'}
                            </p>
                            <div style={styles.categoryFooter}>
                                <span className={`badge ${category.isActive ? 'badge-success' : 'badge-warning'}`}>
                                    {category.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <div style={styles.actions}>
                                    <Link
                                        to={`/admin/categories/edit/${category._id}`}
                                        className="btn btn-outline btn-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category._id, category.name)}
                                        className="btn btn-sm"
                                        style={{ backgroundColor: 'var(--color-error)', color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-2xl)',
    },
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        margin: 0,
    },
    categoryCard: {
        overflow: 'hidden',
        padding: 0,
    },
    imageContainer: {
        width: '100%',
        height: '150px',
        overflow: 'hidden',
        backgroundColor: 'var(--color-gray-lighter)',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    categoryContent: {
        padding: 'var(--spacing-lg)',
    },
    categoryName: {
        fontSize: 'var(--font-size-xl)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-sm)',
    },
    categoryDescription: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-md)',
        lineHeight: 1.5,
    },
    categoryFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--spacing-md)',
    },
    actions: {
        display: 'flex',
        gap: 'var(--spacing-sm)',
    },
};

export default CategoryList;
