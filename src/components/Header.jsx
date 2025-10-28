import React from 'react'
import '../styles/Header.css'

const Header = ({ onBackToMain }) => {
    return (
        <header className={`header ${onBackToMain ? 'header-fitting' : ''}`}>
            <div className="header-content">
                <div
                    className={`logo ${onBackToMain ? 'logo-clickable' : ''}`}
                    onClick={onBackToMain ? onBackToMain : undefined}
                >
                    <img src="/Image/Marry (1).png" alt="Marry Day" className="logo-image" />
                </div>
                <p className="tagline">AI가 완성하는 나만의 웨딩 드레스</p>
            </div>
        </header>
    )
}

export default Header

