import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Contact = () => {
    const { language } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const t = {
        en: {
            title: 'Get In Touch',
            subtitle: 'Have a question or want to work together?',
            name: 'Your Name',
            email: 'Email Address',
            phone: 'Phone Number (Optional)',
            subject: 'Subject',
            message: 'Message',
            send: 'Send Message',
            sending: 'Sending...',
            success: 'Message sent successfully! You will be redirected to WhatsApp.',
            error: 'Something went wrong. Please try again.'
        },
        id: {
            title: 'Hubungi Saya',
            subtitle: 'Punya pertanyaan atau ingin bekerja sama?',
            name: 'Nama Anda',
            email: 'Alamat Email',
            phone: 'Nomor Telepon (Opsional)',
            subject: 'Subjek',
            message: 'Pesan',
            send: 'Kirim Pesan',
            sending: 'Mengirim...',
            success: 'Pesan berhasil dikirim! Anda akan diarahkan ke WhatsApp.',
            error: 'Terjadi kesalahan. Silakan coba lagi.'
        }
    };

    const text = t[language] || t.en;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await contactsAPI.submit(formData);
            setSuccess(true);
            
            // Redirect to WhatsApp if link is provided
            if (response.data?.whatsapp_link) {
                window.open(response.data.whatsapp_link, '_blank');
            }
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (err) {
            setError(text.error);
            console.error('Error submitting contact:', err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="contact-success">
                <h2>✅ {text.success}</h2>
                <button onClick={() => setSuccess(false)} className="btn-primary">
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <div className="contact-page">
            <div className="page-header">
                <h1>{text.title}</h1>
                <p>{text.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label>{text.name} *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>{text.email} *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>{text.phone}</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>{text.subject} *</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>{text.message} *</label>
                    <textarea
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? text.sending : text.send}
                </button>
            </form>
        </div>
    );
};

export default Contact;