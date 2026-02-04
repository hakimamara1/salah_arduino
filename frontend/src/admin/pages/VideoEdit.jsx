import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import VideoForm from '../components/VideoForm';

const VideoEdit = () => {
    const { id } = useParams();

    const { data: video, isLoading } = useQuery({
        queryKey: ['video', id],
        queryFn: async () => {
            const res = await api.get(`/videos/${id}`);
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

    if (!video) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
                <h2>Video not found</h2>
            </div>
        );
    }

    return <VideoForm videoData={video} isEdit={true} />;
};

export default VideoEdit;
