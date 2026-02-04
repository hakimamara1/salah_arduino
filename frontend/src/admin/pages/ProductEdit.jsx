import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import ProductForm from '../components/ProductForm';

const ProductEdit = () => {
    const { id } = useParams();

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/${id}`);
            return res.data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
                <h2>Product not found</h2>
            </div>
        );
    }

    return <ProductForm product={product} isEdit={true} />;
};

export default ProductEdit;
