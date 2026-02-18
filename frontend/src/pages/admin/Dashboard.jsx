import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { projectsAPI } from '../../api/projects';
import { experiencesAPI } from '../../api/experiences';
import { contactsAPI } from '../../api/contacts';
import Sidebar from '../../components/Sidebar';
import AnalyticsCard from '../../components/AnalyticsCard';
import ViewsChart from '../../components/ViewsChart';
import ThemeToggle from '../../components/ThemeToggle';
import LanguageSelector from '../../components/LanguageSelector';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { language } = useApp();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('week');
    const [summary, setSummary] = useState({
        projects: {
            total: 0,
            featured: 0,
            draft: 0,
            published: 0,
            recent: []
        },
        experiences: {
            total: 0,
            current: 0,
            totalYears: 0,
            recent: []
        },
        contacts: {
            total: 0,
            unread: 0
        },
        analytics: {
            totalViews: 1247,
            uniqueVisitors: 892,
            avgTimeOnSite: '2m 34s',
            bounceRate: 35.2,
            viewsByPeriod: {
                day: {
                    labels: language === 'en' 
                        ? ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
                        : ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                    values: [12, 8, 24, 45, 67, 38]
                },
                week: {
                    labels: language === 'en'
                        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        : ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                    values: [145, 132, 168, 189, 210, 98, 76]
                },
                month: {
                    labels: language === 'en'
                        ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                        : ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
                    values: [589, 645, 712, 498]
                }
            },
            topProjects: [
                { name: 'E-Commerce Platform', views: 345 },
                { name: 'RESTful API Service', views: 234 },
                { name: 'Mobile App UI Kit', views: 156 },
                { name: 'Portfolio Website', views: 98 }
            ]
        }
    });
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Translation function
    const t = (key) => {
        const translations = {
            en: {
                dashboard: 'Dashboard',
                welcome: 'Welcome back',
                subtitle: "Here's what's happening with your portfolio",
                logout: 'Logout',
                totalViews: 'Total Views',
                uniqueVisitors: 'Unique Visitors',
                avgTimeOnSite: 'Avg. Time on Site',
                bounceRate: 'Bounce Rate',
                vsLastMonth: 'vs last month',
                mostViewedProjects: 'Most Viewed Projects',
                views: 'views',
                daily: 'Daily',
                weekly: 'Weekly',
                monthly: 'Monthly',
                line: 'Line',
                bar: 'Bar',
                projects: 'Projects',
                experiences: 'Experiences',
                messages: 'Messages',
                published: 'Published',
                draft: 'Draft',
                featured: 'Featured',
                current: 'Current',
                totalYears: 'Total Years',
                unread: 'Unread',
                recentProjects: 'Recent Projects',
                recentExperiences: 'Recent Experiences',
                viewAll: 'View all',
                quickActions: 'Quick Actions',
                newProject: '+ New Project',
                newExperience: '+ New Experience',
                noProjects: 'No projects yet',
                noExperiences: 'No experiences yet',
                createFirst: 'Create your first project',
                addFirst: 'Add your first experience',
                present: 'Present'
            },
            id: {
                dashboard: 'Dasbor',
                welcome: 'Selamat datang',
                subtitle: 'Berikut ringkasan aktivitas portofolio Anda',
                logout: 'Keluar',
                totalViews: 'Total Kunjungan',
                uniqueVisitors: 'Pengunjung Unik',
                avgTimeOnSite: 'Rata-rata Waktu',
                bounceRate: 'Persentase Bounce',
                vsLastMonth: 'vs bulan lalu',
                mostViewedProjects: 'Proyek Terpopuler',
                views: 'kunjungan',
                daily: 'Harian',
                weekly: 'Mingguan',
                monthly: 'Bulanan',
                line: 'Garis',
                bar: 'Batang',
                projects: 'Proyek',
                experiences: 'Pengalaman',
                messages: 'Pesan',
                published: 'Terbit',
                draft: 'Konsep',
                featured: 'Unggulan',
                current: 'Saat Ini',
                totalYears: 'Total Tahun',
                unread: 'Belum Dibaca',
                recentProjects: 'Proyek Terbaru',
                recentExperiences: 'Pengalaman Terbaru',
                viewAll: 'Lihat semua',
                quickActions: 'Aksi Cepat',
                newProject: '+ Proyek Baru',
                newExperience: '+ Pengalaman Baru',
                noProjects: 'Belum ada proyek',
                noExperiences: 'Belum ada pengalaman',
                createFirst: 'Buat proyek pertama Anda',
                addFirst: 'Tambah pengalaman pertama Anda',
                present: 'Sekarang'
            }
        };
        return translations[language][key] || key;
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch all data in parallel
            const [projectsRes, experiencesRes, contactsRes] = await Promise.all([
                projectsAPI.getAll().catch(() => ({ projects: [] })),
                experiencesAPI.getAll().catch(() => ({ experiences: [] })),
                contactsAPI.getAll().catch(() => ({ messages: [] }))
            ]);

            // Process projects data
            const projects = projectsRes.projects || [];
            const featuredProjects = projects.filter(p => p.featured);
            const draftProjects = projects.filter(p => p.status === 'draft');
            const publishedProjects = projects.filter(p => p.status === 'published');
            
            const recentProjects = [...projects]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5);

            // Process experiences data
            const experiences = experiencesRes.experiences || [];
            const currentExperiences = experiences.filter(e => e.current);
            
            let totalYears = 0;
            experiences.forEach(exp => {
                if (exp.current) {
                    const years = (new Date() - new Date(exp.start_date)) / (1000 * 60 * 60 * 24 * 365);
                    totalYears += years;
                } else if (exp.start_date && exp.end_date) {
                    const years = (new Date(exp.end_date) - new Date(exp.start_date)) / (1000 * 60 * 60 * 24 * 365);
                    totalYears += years;
                }
            });

            const recentExperiences = [...experiences]
                .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                .slice(0, 5);

            // Process contacts data
            const messages = contactsRes.messages || [];
            const unreadMessages = messages.filter(m => !m.is_read);

            setSummary(prev => ({
                ...prev,
                projects: {
                    total: projects.length,
                    featured: featuredProjects.length,
                    draft: draftProjects.length,
                    published: publishedProjects.length,
                    recent: recentProjects
                },
                experiences: {
                    total: experiences.length,
                    current: currentExperiences.length,
                    totalYears: Math.round(totalYears * 10) / 10,
                    recent: recentExperiences
                },
                contacts: {
                    total: messages.length,
                    unread: unreadMessages.length
                }
            }));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { 
            year: 'numeric', 
            month: 'short' 
        });
    };

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <header className="content-header">
                    <h1>{t('dashboard')}</h1>
                    <div className="header-right">
                        <div className="header-controls">
                            <ThemeToggle />
                            <LanguageSelector />
                        </div>
                        <button onClick={handleLogout} className="btn-logout">
                            {t('logout')}
                        </button>
                    </div>
                </header>

                <div className="welcome-section">
                    <h2>{t('welcome')}, {user.username || 'Admin'}</h2>
                    <p>{t('subtitle')}</p>
                </div>

                {/* Analytics Cards */}
                <div className="analytics-grid">
                    <AnalyticsCard 
                        title={t('totalViews')}
                        value={summary.analytics.totalViews}
                        change={12.5}
                        period={t('vsLastMonth')}
                    />
                    <AnalyticsCard 
                        title={t('uniqueVisitors')}
                        value={summary.analytics.uniqueVisitors}
                        change={8.3}
                        period={t('vsLastMonth')}
                    />
                    <AnalyticsCard 
                        title={t('avgTimeOnSite')}
                        value={summary.analytics.avgTimeOnSite}
                        change={-2.1}
                        period={t('vsLastMonth')}
                    />
                    <AnalyticsCard 
                        title={t('bounceRate')}
                        value={summary.analytics.bounceRate + '%'}
                        change={-5.2}
                        period={t('vsLastMonth')}
                    />
                </div>

                {/* Views Chart */}
                <ViewsChart 
                    data={summary.analytics.viewsByPeriod[period]}
                    period={period}
                    onPeriodChange={handlePeriodChange}
                    translations={{
                        daily: t('daily'),
                        weekly: t('weekly'),
                        monthly: t('monthly'),
                        line: t('line'),
                        bar: t('bar')
                    }}
                />

                {/* Top Projects */}
                <div className="top-projects">
                    <h3>{t('mostViewedProjects')}</h3>
                    <div className="top-projects-list">
                        {summary.analytics.topProjects.map((project, index) => (
                            <div key={index} className="top-project-item">
                                <div className="project-rank">{index + 1}</div>
                                <div className="project-info">
                                    <span className="project-name">{project.name}</span>
                                    <span className="project-views">{project.views} {t('views')}</span>
                                </div>
                                <div className="project-bar">
                                    <div 
                                        className="project-bar-fill"
                                        style={{ 
                                            width: `${(project.views / summary.analytics.topProjects[0].views) * 100}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card">
                        <div className="stat-content">
                            <h3>{t('projects')}</h3>
                            <p className="stat-number">{summary.projects.total}</p>
                            <div className="stat-details">
                                <span className="stat-badge">{t('published')}: {summary.projects.published}</span>
                                <span className="stat-badge">{t('draft')}: {summary.projects.draft}</span>
                                <span className="stat-badge">{t('featured')}: {summary.projects.featured}</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <h3>{t('experiences')}</h3>
                            <p className="stat-number">{summary.experiences.total}</p>
                            <div className="stat-details">
                                <span className="stat-badge">{t('current')}: {summary.experiences.current}</span>
                                <span className="stat-badge">{t('totalYears')}: {summary.experiences.totalYears}</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <h3>{t('messages')}</h3>
                            <p className="stat-number">{summary.contacts.total}</p>
                            <div className="stat-details">
                                <span className="stat-badge unread">{t('unread')}: {summary.contacts.unread}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Projects Section */}
                <div className="recent-section">
                    <div className="section-header">
                        <h3>{t('recentProjects')}</h3>
                        <a href="/admin/projects" className="section-link">{t('viewAll')} →</a>
                    </div>
                    
                    {summary.projects.recent.length > 0 ? (
                        <div className="recent-list">
                            {summary.projects.recent.map(project => (
                                <div key={project.id} className="recent-item">
                                    <div className="recent-info">
                                        <strong>{project.title}</strong>
                                        <span className="recent-meta">
                                            {project.tech_stack?.slice(0, 3).join(', ')}
                                            {project.tech_stack?.length > 3 ? '...' : ''}
                                        </span>
                                    </div>
                                    <div className="recent-status">
                                        <span className={`status-dot ${project.status}`}></span>
                                        {project.featured && <span className="featured-star">★</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">
                            {t('noProjects')}. <a href="/admin/projects/new">{t('createFirst')}</a>
                        </p>
                    )}
                </div>

                {/* Recent Experiences Section */}
                <div className="recent-section">
                    <div className="section-header">
                        <h3>{t('recentExperiences')}</h3>
                        <a href="/admin/experiences" className="section-link">{t('viewAll')} →</a>
                    </div>
                    
                    {summary.experiences.recent.length > 0 ? (
                        <div className="recent-list">
                            {summary.experiences.recent.map(exp => (
                                <div key={exp.id} className="recent-item">
                                    <div className="recent-info">
                                        <strong>{exp.position}</strong>
                                        <span className="recent-meta">
                                            {exp.company} • {formatDate(exp.start_date)} - {exp.current ? t('present') : formatDate(exp.end_date)}
                                        </span>
                                    </div>
                                    <div className="recent-status">
                                        {exp.current && <span className="current-badge">{t('current')}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">
                            {t('noExperiences')}. <a href="/admin/experiences/new">{t('addFirst')}</a>
                        </p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h3>{t('quickActions')}</h3>
                    <div className="action-buttons">
                        <a href="/admin/projects/new" className="action-btn">
                            {t('newProject')}
                        </a>
                        <a href="/admin/experiences/new" className="action-btn">
                            {t('newExperience')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;