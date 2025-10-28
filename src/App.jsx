import { useState, useEffect } from 'react'
import Header from './components/Header'
import ImageUpload from './components/ImageUpload'
import DressSelection from './components/DressSelection'
import ResultDisplay from './components/ResultDisplay'
import IntroAnimation from './components/IntroAnimation'
import VideoBackground from './components/VideoBackground'
import { autoMatchImage } from './utils/api'
import './styles/App.css'

function App() {
    const [showFittingPage, setShowFittingPage] = useState(false)
    const [hasShownIntro, setHasShownIntro] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(null)
    const [selectedDress, setSelectedDress] = useState(null)
    const [resultImage, setResultImage] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [activeTab, setActiveTab] = useState('general')
    const [topVisibleDress, setTopVisibleDress] = useState(null)
    const [isAutoMatching, setIsAutoMatching] = useState(false)

    const handleImageUpload = (image) => {
        setUploadedImage(image)
        setResultImage(null)
    }

    const handleDressSelect = (dress) => {
        setSelectedDress(dress)
    }

    const handleReset = () => {
        setUploadedImage(null)
        setSelectedDress(null)
        setResultImage(null)
        setIsProcessing(false)
    }

    const handleNavigateToFitting = () => {
        setShowFittingPage(true)
    }

    const handleBackToMain = () => {
        setShowFittingPage(false)
        handleReset()
    }

    const handleIntroComplete = () => {
        setHasShownIntro(true)
    }

    // 맨 위 드레스 변경 감지
    const handleTopDressChange = (dress) => {
        setTopVisibleDress(dress)
    }

    // 자동 매칭 실행
    useEffect(() => {
        if (topVisibleDress && uploadedImage && !isAutoMatching) {
            performAutoMatch(topVisibleDress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topVisibleDress, uploadedImage])

    const performAutoMatch = async (dress) => {
        if (!uploadedImage || !dress) return

        setIsAutoMatching(true)

        try {
            // API 호출 (백엔드 연결 시 사용)
            // const result = await autoMatchImage(uploadedImage, dress)
            // setResultImage(result.result_image)

            // 임시: 시뮬레이션
            setTimeout(() => {
                console.log('자동 매칭 실행:', {
                    dress: dress.name,
                    dressId: dress.id,
                    dressImage: dress.image
                })
                // 실제로는 백엔드에서 받은 결과 이미지를 설정
                // setResultImage(result.result_image)
                setIsAutoMatching(false)
            }, 500)
        } catch (error) {
            console.error('자동 매칭 중 오류 발생:', error)
            setIsAutoMatching(false)
        }
    }

    return (
        <div className="app">
            {!showFittingPage && (
                <>
                    {!hasShownIntro && <IntroAnimation onComplete={handleIntroComplete} />}
                    <VideoBackground onNavigateToFitting={handleNavigateToFitting} />
                </>
            )}
            <Header onBackToMain={showFittingPage ? handleBackToMain : null} />

            {showFittingPage && (
                <main className="main-content">
                    {!resultImage ? (
                        <div className="fitting-container">
                            <div className="content-wrapper">
                                <div className="left-container">
                                    {/* 탭 메뉴 */}
                                    <div className="tab-menu">
                                        <button
                                            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('general')}
                                        >
                                            일반
                                        </button>
                                        <button
                                            className={`tab-button ${activeTab === 'custom' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('custom')}
                                        >
                                            커스텀
                                        </button>
                                    </div>

                                    <ImageUpload
                                        onImageUpload={handleImageUpload}
                                        uploadedImage={uploadedImage}
                                    />
                                </div>
                                <div className="right-container">
                                    <DressSelection
                                        onDressSelect={handleDressSelect}
                                        selectedDress={selectedDress}
                                        activeTab={activeTab}
                                        onTopDressChange={handleTopDressChange}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ResultDisplay
                            resultImage={resultImage}
                            onReset={handleReset}
                        />
                    )}
                </main>
            )}

            <footer className="footer">
                <p>© 2025 Wedding Dress AI Matching. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default App

