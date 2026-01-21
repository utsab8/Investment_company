import React, { useState } from 'react';
import AdminLayout from '../AdminLayout';
import { adminRequest } from '../../../services/adminApi';

const SeedProcessData = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [results, setResults] = useState(null);

    const handleSeedData = async () => {
        if (!window.confirm('This will create dummy data for the Process page. Continue?')) {
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        setResults(null);

        try {
            const response = await adminRequest('seed-process-data.php', {
                method: 'POST'
            });

            if (response.success) {
                setMessage({ type: 'success', text: response.message || 'Dummy data created successfully!' });
                setResults(response.data);
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to create dummy data' });
            }
        } catch (error) {
            console.error('Error seeding data:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to create dummy data' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '20px', color: '#0a2540' }}>
                    <i className="fas fa-seedling" style={{ marginRight: '10px' }}></i>
                    Seed Process Page Data
                </h1>

                {message.text && (
                    <div style={{
                        padding: '15px 20px',
                        marginBottom: '25px',
                        borderRadius: '8px',
                        background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    marginBottom: '20px'
                }}>
                    <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.8' }}>
                        This will create dummy/initial data for the Process page, including:
                    </p>
                    <ul style={{ marginLeft: '20px', color: '#666', lineHeight: '2' }}>
                        <li>Page content sections (title, subtitle, intro)</li>
                        <li>4 Process Steps (Initial Consultation, Strategy Development, Implementation, Review)</li>
                        <li>3 Risk Management items (Diversification, Due Diligence, Stop-Loss Mechanisms)</li>
                    </ul>
                    <p style={{ marginTop: '20px', color: '#856404', background: '#fff3cd', padding: '15px', borderRadius: '5px' }}>
                        <strong>Note:</strong> If data already exists, it will not be duplicated. You can safely run this multiple times.
                    </p>
                </div>

                <button
                    onClick={handleSeedData}
                    disabled={loading}
                    style={{
                        padding: '12px 30px',
                        background: loading ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Creating Data...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-seedling"></i>
                            Create Dummy Data
                        </>
                    )}
                </button>

                {results && (
                    <div style={{
                        marginTop: '30px',
                        background: 'white',
                        padding: '25px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, color: '#0a2540' }}>Created Items:</h3>
                        {results.created && results.created.length > 0 && (
                            <ul style={{ color: '#28a745' }}>
                                {results.created.map((item, index) => (
                                    <li key={index} style={{ marginBottom: '5px' }}>✓ {item}</li>
                                ))}
                            </ul>
                        )}
                        {results.errors && results.errors.length > 0 && (
                            <div style={{ marginTop: '15px' }}>
                                <h4 style={{ color: '#dc3545' }}>Errors:</h4>
                                <ul style={{ color: '#dc3545' }}>
                                    {results.errors.map((error, index) => (
                                        <li key={index}>✗ {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    border: '1px solid #90caf9'
                }}>
                    <h4 style={{ marginTop: 0, color: '#0d47a1' }}>Next Steps:</h4>
                    <ol style={{ color: '#1565c0', lineHeight: '2' }}>
                        <li>After creating dummy data, go to <strong>/admin/process</strong> to manage the content</li>
                        <li>Visit <strong>/process</strong> to see the data displayed on the public page</li>
                        <li>Edit, update, or delete any content as needed from the admin panel</li>
                    </ol>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SeedProcessData;




