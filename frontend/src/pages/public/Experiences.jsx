import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const Experiences = () => {
    const { language } = useApp();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    const t = {
        en: {
            title: 'Work Experiences',
            subtitle: 'My professional journey',
            present: 'Present',
            achievements: 'Key Achievements'
        },
        id: {
            title: 'Pengalaman Kerja',
            subtitle: 'Perjalanan profesional saya',
            present: 'Sekarang',
            achievements: 'Pencapaian Utama'
        }
    };

    const text = t[language] || t.en;

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await experiencesAPI.getAll();
            setExperiences(response.experiences || []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
            year: 'numeric',
            month: 'short'
        });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="experiences-page">
            <div className="page-header">
                <h1>{text.title}</h1>
                <p>{text.subtitle}</p>
            </div>

            <div className="experiences-timeline">
                {experiences.map(exp => (
                    <div key={exp.id} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <div className="timeline-header">
                                <h2>{exp.position}</h2>
                                <span className="timeline-company">{exp.company}</span>
                            </div>
                            
                            <p className="timeline-description">{exp.description}</p>
                            
                            <div className="timeline-period">
                                {formatDate(exp.start_date)} - {exp.current ? text.present : formatDate(exp.end_date)}
                                {exp.location && <span className="timeline-location"> • {exp.location}</span>}
                            </div>

                            {exp.achievements && exp.achievements.length > 0 && (
                                <div className="timeline-achievements">
                                    <h3>{text.achievements}</h3>
                                    <ul>
                                        {exp.achievements.map((achievement, i) => (
                                            <li key={i}>{achievement}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experiences;