import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Contacts.css';

const Contacts = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await contactsAPI.getAll();
            setMessages(response.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await contactsAPI.delete(id);
                fetchMessages();
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null);
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return !msg.is_read;
        if (filter === 'read') return msg.is_read;
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffHours < 24) {
            return 'Today';
        } else if (diffHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <header className="content-header">
                    <h1>Contact Messages</h1>
                </header>

                <div className="messages-container">
                    <div className="messages-sidebar">
                        <div className="filter-tabs">
                            <button 
                                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All ({messages.length})
                            </button>
                            <button 
                                className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                                onClick={() => setFilter('unread')}
                            >
                                Unread ({messages.filter(m => !m.is_read).length})
                            </button>
                            <button 
                                className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
                                onClick={() => setFilter('read')}
                            >
                                Read ({messages.filter(m => m.is_read).length})
                            </button>
                        </div>

                        <div className="messages-list">
                            {filteredMessages.length === 0 ? (
                                <div className="empty-state">
                                    No messages found
                                </div>
                            ) : (
                                filteredMessages.map(msg => (
                                    <div 
                                        key={msg.id}
                                        className={`message-item ${!msg.is_read ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedMessage(msg)}
                                    >
                                        <div className="message-sender">
                                            <strong>{msg.name}</strong>
                                            <span className="message-date">{formatDate(msg.created_at)}</span>
                                        </div>
                                        <div className="message-subject">{msg.subject}</div>
                                        <div className="message-preview">{msg.preview || msg.message?.substring(0, 60)}...</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="message-detail">
                        {selectedMessage ? (
                            <>
                                <div className="detail-header">
                                    <h2>{selectedMessage.subject}</h2>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(selectedMessage.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                
                                <div className="detail-meta">
                                    <div className="meta-row">
                                        <span className="meta-label">From:</span>
                                        <span className="meta-value">{selectedMessage.name}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">Email:</span>
                                        <span className="meta-value">
                                            <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                                        </span>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div className="meta-row">
                                            <span className="meta-label">Phone:</span>
                                            <span className="meta-value">
                                                <a href={`https://wa.me/${selectedMessage.phone}`} target="_blank" rel="noopener">
                                                    {selectedMessage.phone}
                                                </a>
                                            </span>
                                        </div>
                                    )}
                                    <div className="meta-row">
                                        <span className="meta-label">Date:</span>
                                        <span className="meta-value">
                                            {new Date(selectedMessage.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-message">
                                    <p>{selectedMessage.message}</p>
                                </div>

                                {selectedMessage.phone && (
                                    <div className="detail-actions">
                                        <a 
                                            href={`https://wa.me/${selectedMessage.phone}`}
                                            target="_blank"
                                            rel="noopener"
                                            className="btn-wa"
                                        >
                                            Reply via WhatsApp
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-selection">
                                Select a message to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacts;