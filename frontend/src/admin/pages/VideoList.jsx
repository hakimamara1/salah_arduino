import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const VideoList = () => {
    const queryClient = useQueryClient();

    const { data: videos, isLoading } = useQuery({
        queryKey: ['videos'],
        queryFn: async () => {
            const res = await api.get('/videos');
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/videos/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['videos']);
            alert('Video deleted successfully!');
        },
    });

    const handleDelete = (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
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
                <h1 style={styles.title}>Videos</h1>
                <Link to="/admin/videos/create" className="btn btn-primary">
                    + Add Video
                </Link>
            </div>

            <div className="card">
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Thumbnail</th>
                                <th style={styles.th}>Title</th>
                                <th style={styles.th}>Category</th>
                                <th style={styles.th}>Views</th>
                                <th style={styles.th}>Likes</th>
                                <th style={styles.th}>Duration</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos?.data?.map((video) => (
                                <tr key={video._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.thumbnailCell}>
                                            {video.thumbnail?.url ? (
                                                <img
                                                    src={video.thumbnail.url}
                                                    alt={video.title}
                                                    style={styles.thumbnail}
                                                />
                                            ) : (
                                                <div style={styles.noThumbnail}>No Thumbnail</div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.videoTitle}>{video.title}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span className="badge badge-primary">{video.category}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.stat}>
                                            👁️ {video.views || 0}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.stat}>
                                            ❤️ {video.likes || 0}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.duration}>{video.duration || 'N/A'}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actions}>
                                            <Link
                                                to={`/admin/videos/edit/${video._id}`}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(video._id, video.title)}
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
    thumbnailCell: {
        width: '120px',
        height: '68px',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 'var(--radius-md)',
    },
    noThumbnail: {
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
    videoTitle: {
        fontWeight: 500,
        color: 'var(--text-primary)',
    },
    stat: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    duration: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        fontFamily: 'monospace',
    },
    actions: {
        display: 'flex',
        gap: 'var(--spacing-sm)',
    },
};

export default VideoList;
