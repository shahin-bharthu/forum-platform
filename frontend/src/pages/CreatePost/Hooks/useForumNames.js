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
                const userForumResponse = await axios.get('http://localhost:8080/forum/my-forums', {
                    withCredentials: true
                });
                const userForumData = userForumResponse.data.data

                const subbedForumResponse = await axios.get('http://localhost:8080/forum/subscribed-forums', {
                    withCredentials: true
                });

                const subbedForumData=subbedForumResponse.data.data
                setForums([...userForumData, ...subbedForumData])

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