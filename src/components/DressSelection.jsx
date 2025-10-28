import { useState, useRef, useEffect, useCallback } from 'react'
import '../styles/DressSelection.css'

const DressSelection = ({ onDressSelect, selectedDress, activeTab, onTopDressChange }) => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [scrollPosition, setScrollPosition] = useState(0)
    const [topVisibleDress, setTopVisibleDress] = useState(null)
    const isDraggingRef = useRef(false)
    const containerRef = useRef(null)
    const contentRef = useRef(null)
    const dressCardsRef = useRef([])

    // 카테고리 정의
    const categories = [
        { id: 'all', name: '전체' },
        { id: 'princess', name: '프린세스' },
        { id: 'mermaid', name: '머메이드' },
        { id: 'aline', name: 'A라인' }
    ]

    // 드레스 데이터 (실제로는 백엔드에서 가져와야 함)
    const dresses = [
        {
            id: 1,
            name: '클래식 A라인',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
            description: '우아하고 클래식한 스타일',
            category: 'aline'
        },
        {
            id: 2,
            name: '로맨틱 프린세스',
            image: 'https://images.unsplash.com/photo-1594552072238-6d1e1a92f5e9?w=400&h=600&fit=crop',
            description: '동화 속 공주 같은 분위기',
            category: 'princess'
        },
        {
            id: 3,
            name: '모던 머메이드',
            image: 'https://images.unsplash.com/photo-1591604129853-0f9f1a6b3a07?w=400&h=600&fit=crop',
            description: '섹시하고 현대적인 실루엣',
            category: 'mermaid'
        },
        {
            id: 4,
            name: '빈티지 레이스',
            image: 'https://images.unsplash.com/photo-1600285225588-7bb71e68e5fb?w=400&h=600&fit=crop',
            description: '고급스러운 레이스 디테일',
            category: 'aline'
        },
        {
            id: 5,
            name: '심플 머메이드',
            image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=600&fit=crop',
            description: '깔끔하고 세련된 디자인',
            category: 'mermaid'
        },
        {
            id: 6,
            name: '글래머러스 프린세스',
            image: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=400&h=600&fit=crop',
            description: '화려하고 볼륨감 있는 스타일',
            category: 'princess'
        },
        {
            id: 7,
            name: '엘레강스 A라인',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
            description: '우아한 실루엣',
            category: 'aline'
        },
        {
            id: 8,
            name: '드림 프린세스',
            image: 'https://images.unsplash.com/photo-1594552072238-6d1e1a92f5e9?w=400&h=600&fit=crop',
            description: '꿈같은 프린세스 라인',
            category: 'princess'
        },
        {
            id: 9,
            name: '화이트 레이스 드레스',
            image: '/Image/dress1.jpg',
            description: '우아한 화이트 레이스 드레스',
            category: 'princess'
        }
    ]

    // 선택된 카테고리에 따라 드레스 필터링
    const filteredDresses = selectedCategory === 'all'
        ? dresses
        : dresses.filter(dress => dress.category === selectedCategory)

    const handleDressClick = (dress) => {
        onDressSelect(dress)
    }

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId)
    }

    // 슬라이더 위치 업데이트
    useEffect(() => {
        if (containerRef.current && contentRef.current) {
            const maxScroll = contentRef.current.scrollHeight - containerRef.current.clientHeight
            if (maxScroll > 0) {
                contentRef.current.scrollTop = (scrollPosition / 100) * maxScroll
            }
        }
    }, [scrollPosition])

    const updateSliderPosition = useCallback((clientY) => {
        const track = document.querySelector('.slider-track')
        if (track) {
            const rect = track.getBoundingClientRect()
            const y = clientY - rect.top
            const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100))
            setScrollPosition(percentage)
        }
    }, [])

    const handleSliderMouseMove = useCallback((e) => {
        if (isDraggingRef.current) {
            e.preventDefault()
            updateSliderPosition(e.clientY)
        }
    }, [updateSliderPosition])

    const handleSliderMouseUp = useCallback(() => {
        isDraggingRef.current = false
        document.removeEventListener('mousemove', handleSliderMouseMove)
        document.removeEventListener('mouseup', handleSliderMouseUp)
    }, [handleSliderMouseMove])

    // 슬라이더 핸들 드래그
    const handleSliderMouseDown = (e) => {
        e.preventDefault()
        isDraggingRef.current = true
        updateSliderPosition(e.clientY)
        document.addEventListener('mousemove', handleSliderMouseMove)
        document.addEventListener('mouseup', handleSliderMouseUp)
    }

    // 화살표 클릭
    const handleArrowClick = (direction) => {
        const step = 10
        if (direction === 'up') {
            setScrollPosition(Math.max(0, scrollPosition - step))
        } else {
            setScrollPosition(Math.min(100, scrollPosition + step))
        }
    }

    // 맨 위에 보이는 드레스 찾기
    const findTopVisibleDress = useCallback(() => {
        if (!contentRef.current) return null

        const container = contentRef.current
        const containerRect = container.getBoundingClientRect()
        const cards = container.querySelectorAll('.dress-card')

        let topCard = null
        let minDistance = Infinity

        cards.forEach((card) => {
            const cardRect = card.getBoundingClientRect()
            // 컨테이너 상단으로부터의 거리 계산
            const distance = Math.abs(cardRect.top - containerRect.top)

            // 카드가 화면에 보이고 있고, 가장 위에 있는 카드인 경우
            if (cardRect.top >= containerRect.top - cardRect.height * 0.5 &&
                cardRect.top <= containerRect.bottom &&
                distance < minDistance) {
                minDistance = distance
                topCard = card
            }
        })

        if (topCard) {
            const dressId = parseInt(topCard.getAttribute('data-dress-id'))
            const dress = filteredDresses.find(d => d.id === dressId)
            return dress
        }

        return null
    }, [filteredDresses])

    // 스크롤 이벤트 감지
    useEffect(() => {
        const container = contentRef.current
        if (!container) return

        const handleScroll = () => {
            const topDress = findTopVisibleDress()
            if (topDress && topDress.id !== topVisibleDress?.id) {
                setTopVisibleDress(topDress)
                if (onTopDressChange) {
                    onTopDressChange(topDress)
                }
            }
        }

        container.addEventListener('scroll', handleScroll)
        // 초기 실행
        handleScroll()

        return () => {
            container.removeEventListener('scroll', handleScroll)
        }
    }, [findTopVisibleDress, topVisibleDress, onTopDressChange])

    return (
        <div className="dress-selection">
            {/* 카테고리 버튼 */}
            <div className="category-buttons">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* 드레스 그리드와 세로 슬라이더 */}
            <div className="dress-content-wrapper" ref={containerRef}>
                <div className="dress-grid-container" ref={contentRef}>
                    <div className="dress-grid">
                        {activeTab === 'general' ? (
                            filteredDresses.map((dress) => (
                                <div
                                    key={dress.id}
                                    data-dress-id={dress.id}
                                    className={`dress-card ${selectedDress?.id === dress.id ? 'selected' : ''} ${topVisibleDress?.id === dress.id ? 'top-visible' : ''}`}
                                    onClick={() => handleDressClick(dress)}
                                >
                                    <img src={dress.image} alt={dress.name} className="dress-image" />
                                    {selectedDress?.id === dress.id && (
                                        <div className="selected-badge">✓</div>
                                    )}
                                    {topVisibleDress?.id === dress.id && (
                                        <div className="top-indicator">👆</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="custom-message">
                                <p>커스텀 드레스 업로드 기능은 곧 제공될 예정입니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 세로 슬라이더 */}
                {activeTab === 'general' && filteredDresses.length > 0 && (
                    <div className="vertical-slider">
                        <button
                            className="slider-arrow slider-arrow-up"
                            onClick={() => handleArrowClick('up')}
                        >
                            ▲
                        </button>
                        <div className="slider-track">
                            <div
                                className="slider-handle"
                                style={{ top: `${scrollPosition}%` }}
                                onMouseDown={handleSliderMouseDown}
                            />
                        </div>
                        <button
                            className="slider-arrow slider-arrow-down"
                            onClick={() => handleArrowClick('down')}
                        >
                            ▼
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DressSelection

