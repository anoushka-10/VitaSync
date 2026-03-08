import React from 'react';
import { BASE_URL } from '../api';

const Login = () => {
    const handleGoogleLogin = () => {
        // Redirect to Spring Security's OAuth2 login endpoint
        window.location.href = `${BASE_URL}/oauth2/authorization/google`;
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome to AI Tracker 🌸</h1>
                <p style={styles.subtitle}>Your personalized health & hormonal harmony companion.</p>
                <div style={styles.divider} />
                <button onClick={handleGoogleLogin} style={styles.loginButton}>
                    <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google" 
                        style={styles.googleIcon} 
                    />
                    Continue with Google
                </button>
                <p style={styles.footerText}>Secure, simple, and cutesy login.</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #fff5f7 0%, #ffe4e9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
    },
    card: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '3rem',
        borderRadius: '2rem',
        boxShadow: '0 15px 35px rgba(255, 182, 193, 0.3)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    title: {
        color: '#ff6b8b',
        fontSize: '2rem',
        marginBottom: '0.5rem',
        fontWeight: '700',
    },
    subtitle: {
        color: '#888',
        fontSize: '1rem',
        lineHeight: '1.5',
        marginBottom: '2rem',
    },
    divider: {
        height: '1px',
        background: 'rgba(255, 107, 139, 0.2)',
        width: '100%',
        marginBottom: '2rem',
    },
    loginButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px 24px',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#444',
        background: 'white',
        border: '2px solid #ff6b8b',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    googleIcon: {
        width: '24px',
        height: '24px',
    },
    footerText: {
        marginTop: '2rem',
        fontSize: '0.85rem',
        color: '#aaa',
        fontStyle: 'italic',
    }
};

export default Login;
