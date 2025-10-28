import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})

/**
 * 이미지 처리 API 호출
 * @param {File} personImage - 사용자 사진
 * @param {Object} dressData - 드레스 데이터
 * @returns {Promise} 처리된 이미지 결과
 */
export const processImage = async (personImage, dressData) => {
    try {
        const formData = new FormData()
        formData.append('person_image', personImage)

        // 드레스 이미지가 파일인 경우
        if (dressData instanceof File) {
            formData.append('dress_image', dressData)
        } else {
            // 드레스 정보가 객체인 경우 (예: ID나 URL)
            formData.append('dress_id', dressData.id)
            formData.append('dress_url', dressData.image)
        }

        const response = await api.post('/api/process', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data
    } catch (error) {
        console.error('API 호출 오류:', error)
        throw error
    }
}

/**
 * 드레스 목록 가져오기
 * @returns {Promise} 드레스 목록
 */
export const getDressList = async () => {
    try {
        const response = await api.get('/api/dresses')
        return response.data
    } catch (error) {
        console.error('드레스 목록 가져오기 오류:', error)
        throw error
    }
}

/**
 * 자동 매칭 API 호출
 * @param {File} personImage - 사용자 사진
 * @param {Object} dressData - 드레스 데이터
 * @returns {Promise} 매칭된 이미지 결과
 */
export const autoMatchImage = async (personImage, dressData) => {
    try {
        const formData = new FormData()
        formData.append('person_image', personImage)

        // 드레스 이미지가 파일인 경우
        if (dressData instanceof File) {
            formData.append('dress_image', dressData)
        } else {
            // 드레스 정보가 객체인 경우
            formData.append('dress_id', dressData.id)
            formData.append('dress_url', dressData.image)
        }

        const response = await api.post('/api/auto-match', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data
    } catch (error) {
        console.error('자동 매칭 오류:', error)
        throw error
    }
}

/**
 * 이미지를 Base64로 변환
 * @param {File} file - 변환할 파일
 * @returns {Promise<string>} Base64 문자열
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export default api

