import { useState, useRef, useEffect, useCallback } from 'react'
import '../styles/DressSelection.css'

const DressSelection = ({ onDressSelect, selectedDress }) => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [scrollPosition, setScrollPosition] = useState(0)
    const [displayCount, setDisplayCount] = useState(5)
    const [categoryStartIndex, setCategoryStartIndex] = useState(0)
    const isDraggingRef = useRef(false)
    const isScrollingFromSlider = useRef(false)
    const containerRef = useRef(null)
    const contentRef = useRef(null)

    // 카테고리 정의
    const categories = [
        { id: 'all', name: '전체' },
        { id: 'ballgown', name: '벨라인' },
        { id: 'empire', name: '엠파이어' },
        { id: 'mermaid', name: '머메이드' },
        { id: 'mini', name: '미니드레스' },
        { id: 'aline', name: 'A라인' },
        { id: 'princess', name: '프린세스' }
    ]

    // 한 번에 보여질 카테고리 수
    const categoriesPerView = 4
    const maxStartIndex = Math.max(0, categories.length - categoriesPerView)
    const visibleCategories = categories.slice(
        categoryStartIndex,
        categoryStartIndex + categoriesPerView
    )

    // 드레스 데이터 (실제로는 백엔드에서 가져와야 함)
    const dresses = [
        {
            id: 1,
            name: '클래식 벨라인',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
            description: '우아하고 클래식한 벨라인',
            category: 'ballgown'
        },
        {
            id: 2,
            name: '로맨틱 엠파이어',
            image: 'https://images.unsplash.com/photo-1594552072238-6d1e1a92f5e9?w=400&h=600&fit=crop',
            description: '우아한 엠파이어 라인',
            category: 'empire'
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
            name: '큐트 미니드레스',
            image: 'https://images.unsplash.com/photo-1600285225588-7bb71e68e5fb?w=400&h=600&fit=crop',
            description: '발랄하고 경쾌한 미니',
            category: 'mini'
        },
        {
            id: 5,
            name: '심플 A라인',
            image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=600&fit=crop',
            description: '깔끔하고 세련된 A라인',
            category: 'aline'
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
            name: '엘레강스 벨라인',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
            description: '우아한 벨라인 실루엣',
            category: 'ballgown'
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
            category: 'ballgown'
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
        setDisplayCount(5) // 카테고리 변경 시 표시 개수 리셋
    }

    // 드레스 카드 드래그 시작
    const handleDragStart = (e, dress) => {
        e.dataTransfer.effectAllowed = 'copy'
        e.dataTransfer.setData('application/json', JSON.stringify(dress))
    }

    // 슬라이더 위치 업데이트 (슬라이더를 드래그할 때만)
    useEffect(() => {
        if (isDraggingRef.current && containerRef.current && contentRef.current) {
            isScrollingFromSlider.current = true
            const maxScroll = contentRef.current.scrollHeight - containerRef.current.clientHeight
            if (maxScroll > 0) {
                contentRef.current.scrollTop = (scrollPosition / 100) * maxScroll
            }
            // 스크롤이 완료된 후 플래그 해제
            setTimeout(() => {
                isScrollingFromSlider.current = false
            }, 50)
        }
    }, [scrollPosition])

    // 스크롤 이벤트로 슬라이더 위치 동기화 (마우스 휠 사용 시)
    useEffect(() => {
        const container = contentRef.current
        if (!container) return

        const handleScroll = () => {
            // 슬라이더로 인한 스크롤인 경우 무시
            if (isScrollingFromSlider.current) return

            const maxScroll = container.scrollHeight - container.clientHeight
            if (maxScroll > 0) {
                const currentScroll = container.scrollTop
                const percentage = (currentScroll / maxScroll) * 100
                setScrollPosition(percentage)

                // 스크롤이 하단 근처에 도달하면 추가 로딩 (80% 지점)
                if (percentage > 80 && displayCount < filteredDresses.length) {
                    setDisplayCount(prev => Math.min(prev + 5, filteredDresses.length))
                }
            }
        }

        container.addEventListener('scroll', handleScroll)
        return () => {
            container.removeEventListener('scroll', handleScroll)
        }
    }, [displayCount, filteredDresses.length])

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
        isDraggingRef.current = true
        const step = 10
        if (direction === 'up') {
            setScrollPosition(Math.max(0, scrollPosition - step))
        } else {
            setScrollPosition(Math.min(100, scrollPosition + step))
        }
        setTimeout(() => {
            isDraggingRef.current = false
        }, 100)
    }

    // 카테고리 슬라이드 이동 (1개씩)
    const handleCategoryNavigation = (direction) => {
        if (direction === 'prev' && categoryStartIndex > 0) {
            setCategoryStartIndex(categoryStartIndex - 1)
        } else if (direction === 'next' && categoryStartIndex < maxStartIndex) {
            setCategoryStartIndex(categoryStartIndex + 1)
        }
    }

    return (
        <div className="dress-selection">
            {/* 카테고리 버튼 */}
            <div className="category-buttons-wrapper">
                <button
                    className="category-nav-button prev"
                    onClick={() => handleCategoryNavigation('prev')}
                    disabled={categoryStartIndex === 0}
                >
                    ‹
                </button>
                <div className="category-buttons">
                    {visibleCategories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                <button
                    className="category-nav-button next"
                    onClick={() => handleCategoryNavigation('next')}
                    disabled={categoryStartIndex === maxStartIndex}
                >
                    ›
                </button>
            </div>

            {/* 드레스 그리드와 세로 슬라이더 */}
            <div className="dress-content-wrapper" ref={containerRef}>
                <div className="dress-grid-container" ref={contentRef}>
                    <div className="dress-grid">
                        {filteredDresses.slice(0, displayCount).map((dress) => (
                            <div
                                key={dress.id}
                                data-dress-id={dress.id}
                                className={`dress-card ${selectedDress?.id === dress.id ? 'selected' : ''}`}
                                onClick={() => handleDressClick(dress)}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, dress)}
                            >
                                <img src={dress.image} alt={dress.name} className="dress-image" />
                                {selectedDress?.id === dress.id && (
                                    <div className="selected-badge">✓</div>
                                )}
                                <div className="drag-hint">드래그 가능</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 세로 슬라이더 */}
                {filteredDresses.length > 0 && (
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

