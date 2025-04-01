import { useState, useEffect } from 'react';
import axiosInstance from '../../../../utils/axiosInstance.js';

const useForumNames = () => {
    const [forums, setForums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchForumNames = async () => {
            try {
                setIsLoading(true);
                const userForumResponse = await axiosInstance.get('http://localhost:8080/forum/my-forums');
                const userPublicForumData = userForumResponse.data.publicForums
                const userPrivateForumData = userForumResponse.data.privateForums

                const subbedForumResponse = await axiosInstance.get('http://localhost:8080/forum/subscribed-forums');

                const subbedForumData=subbedForumResponse.data.data
                setForums([...userPublicForumData,...userPrivateForumData, ...subbedForumData])
                
                setError(null);
            } catch (error) {
                console.error('Error fetching forums:', error);
                setError('Failed to fetch forums. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchForumNames()
    }, []);
    return { forums, isLoading, error }
}

export default useForumNames;