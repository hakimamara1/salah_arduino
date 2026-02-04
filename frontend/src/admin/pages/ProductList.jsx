import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import api from '../../services/api';

const ProductList = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ['products', { search, category, page }],
        queryFn: () => adminService.getAllProducts({ search, category, page, limit: 20 }),
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: adminService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            alert('Product deleted successfully!');
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
                <h1 style={styles.title}>Products</h1>
                <Link to="/admin/products/create" className="btn btn-primary">
                    + Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={styles.filters}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <select
                        className="input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="">All Categories</option>
                        {categories?.data?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="card">
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Image</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>SKU</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Stock</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.data?.map((product) => (
                                <tr key={product._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.imageCell}>
                                            {product.images?.[0]?.url ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    style={styles.productImage}
                                                />
                                            ) : (
                                                <div style={styles.noImage}>No Image</div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.productName}>{product.name}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.sku}>{product.sku}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.price}>{product.price} DA</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.stock,
                                                color: product.stock === 0 ? 'var(--color-error)' : product.stock < 10 ? 'var(--color-warning)' : 'var(--color-success)',
                                            }}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <span className={`badge ${product.isActive ? 'badge-success' : 'badge-warning'}`}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actions}>
                                            <Link
                                                to={`/admin/products/edit/${product._id}`}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="btn btn-sm"
                                                style={{ backgroundColor: 'var(--color-error)', color: 'white' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products?.pagination && (
                    <div style={styles.pagination}>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span style={styles.pageInfo}>
                            Page {products.pagination.page} of {products.pagination.pages}
                        </span>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page === products.pagination.pages}
                        >
                            Next
                        </button>
                    </div>
                )}
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
    filters: {
        display: 'flex',
        gap: 'var(--spacing-md)',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: 'var(--spacing-md)',
        borderBottom: '2px solid var(--color-gray-lighter)',
        fontWeight: 600,
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    tr: {
        borderBottom: '1px solid var(--color-gray-lighter)',
    },
    td: {
        padding: 'var(--spacing-md)',
    },
    imageCell: {
        width: '60px',
        height: '60px',
    },
    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 'var(--radius-md)',
    },
    noImage: {
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--color-gray-lighter)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-secondary)',
    },
    productName: {
        fontWeight: 500,
        color: 'var(--text-primary)',
    },
    sku: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    price: {
        fontWeight: 600,
        color: 'var(--color-primary)',
    },
    stock: {
        fontWeight: 600,
    },
    actions: {
        display: 'flex',
        gap: 'var(--spacing-sm)',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-xl)',
        paddingTop: 'var(--spacing-lg)',
        borderTop: '1px solid var(--color-gray-lighter)',
    },
    pageInfo: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
};

export default ProductList;
