import { useState, useEffect } from 'react';
import axios from 'axios';
const useForumNames = () => {
    const [forums, setForums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchForumNames = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:8080/forum/my-forums', {
                    withCredentials: true
                });
                const forumData = response.data.data

                setForums(forumData)

                setError(null);
            } catch (error) {
                console.error('Error fetching countrie:', error);
                setError('Failed to fetch countries. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchForumNames()
    }, []);
    return { forums, isLoading, error }
}

export default useForumNames;