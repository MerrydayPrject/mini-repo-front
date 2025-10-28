import { useState, useRef } from 'react'
import '../styles/ImageUpload.css'

const ImageUpload = ({ onImageUpload, uploadedImage }) => {
    const [preview, setPreview] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            handleFile(file)
        }
    }

    const handleFile = (file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
            onImageUpload(file)
        }
        reader.readAsDataURL(file)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            handleFile(file)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleRemove = () => {
        setPreview(null)
        onImageUpload(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="image-upload">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {!preview ? (
                <div
                    className={`upload-area ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <div className="upload-icon">📷</div>
                    <p className="upload-text">클릭하거나 이미지를 드래그하세요</p>
                    <p className="upload-subtext">JPG, PNG, JPEG 형식 지원</p>
                </div>
            ) : (
                <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                    <button className="remove-button" onClick={handleRemove}>
                        ✕ 삭제
                    </button>
                </div>
            )}
        </div>
    )
}

export default ImageUpload

