import '../styles/ResultDisplay.css'

const ResultDisplay = ({ resultImage, onReset }) => {
    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = resultImage
        link.download = `wedding-dress-${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="result-display">
            <div className="result-header">
                <h2>✨ AI 매칭 결과</h2>
                <p className="result-subtitle">완성된 웨딩 드레스 이미지입니다</p>
            </div>

            <div className="result-image-container">
                <img src={resultImage} alt="Result" className="result-image" />
            </div>

            <div className="result-actions">
                <button className="download-button" onClick={handleDownload}>
                    ⬇️ 다운로드
                </button>
                <button className="retry-button" onClick={onReset}>
                    🔄 다시 시도
                </button>
            </div>

            <div className="result-tips">
                <h3>💡 유용한 팁</h3>
                <ul>
                    <li>결과가 마음에 들지 않으면 다른 드레스로 시도해보세요</li>
                    <li>더 나은 결과를 위해 정면 사진을 사용하세요</li>
                    <li>밝고 선명한 이미지일수록 좋은 결과를 얻을 수 있습니다</li>
                </ul>
            </div>
        </div>
    )
}

export default ResultDisplay

