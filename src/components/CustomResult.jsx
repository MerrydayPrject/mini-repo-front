import { useState } from 'react'
import '../styles/CustomResult.css'

const CustomResult = ({ resultImage, isProcessing, onProcess }) => {
    return (
        <div className="custom-result">
            <h3 className="result-title">매칭 결과</h3>
            <div className="result-container">
                {!resultImage && !isProcessing ? (
                    <div className="result-placeholder">
                        <div className="placeholder-icon">✨</div>
                        <p className="placeholder-text">전신사진과 드레스를 업로드하세요</p>
                        <p className="placeholder-subtext">AI가 자동으로 매칭해드립니다</p>
                    </div>
                ) : isProcessing ? (
                    <div className="processing-container">
                        <div className="spinner"></div>
                        <p className="processing-text">AI 매칭 중...</p>
                        <p className="processing-subtext">잠시만 기다려주세요</p>
                    </div>
                ) : (
                    <div className="result-image-container">
                        <img src={resultImage} alt="Matching Result" className="result-image" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomResult

