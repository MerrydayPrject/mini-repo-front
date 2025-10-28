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
 * 배경 제거 API 호출
 * @param {File} dressImage - 드레스 이미지
 * @returns {Promise} 배경이 제거된 이미지 결과
 */
export const removeBackground = async (dressImage) => {
    try {
        const formData = new FormData()
        formData.append('dress_image', dressImage)

        const response = await api.post('/api/remove-background', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        // response.data 형식:
        // {
        //   success: true,
        //   image: "data:image/png;base64,..." (Base64 문자열)
        //   message: "배경 제거 완료"
        // }
        return response.data
    } catch (error) {
        console.error('배경 제거 오류:', error)
        throw error
    }
}

/**
 * 커스텀 매칭 API 호출 (전신사진 + 드레스 이미지)
 * @param {File} fullBodyImage - 전신 사진
 * @param {File} dressImage - 드레스 이미지
 * @returns {Promise} 매칭된 결과 이미지
 */
export const customMatchImage = async (fullBodyImage, dressImage) => {
    try {
        const formData = new FormData()
        formData.append('full_body_image', fullBodyImage)
        formData.append('dress_image', dressImage)

        const response = await api.post('/api/custom-match', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        // response.data 형식:
        // {
        //   success: true,
        //   result_image: "data:image/png;base64,..." (Base64 문자열)
        //   message: "매칭 완료"
        // }
        return response.data
    } catch (error) {
        console.error('커스텀 매칭 오류:', error)
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

