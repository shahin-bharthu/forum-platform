import { useState, useEffect } from 'react';
import axios from 'axios';
const useCountries=()=>{
    const [countries,setCountries]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [error,setError]=useState(null)

    useEffect(()=>{
        const fetchCountries=async()=>{
            try{
                setIsLoading(true);
                const response = await axios.get('https://restcountries.com/v3.1/all')
                const sortedCountries=response.data.map(country=>({
                    value:country.cca2,
                    label:country.name.common
                }))
                .sort((a,b)=>a.label.localeCompare(b.label));

                setCountries(sortedCountries)

                setError(null);
            }catch(error){
                console.error('Error fetching countrie:',error);
                setError('Failed to fetch countries. Please try again later.')
            }finally{
                setIsLoading(false)
            }
        }
        fetchCountries()
    },[]);
    return {countries,isLoading,error}
}

export default useCountries;