import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../store/loaderSlice';
const useCountries=()=>{
    const [countries,setCountries]=useState([]);
    const [error,setError]=useState(null)
    const isLoading = useSelector(state=>state.loading.isLoading)
    const dispatch =useDispatch()

    useEffect(()=>{
        const fetchCountries=async()=>{
            try{
                dispatch(setLoading(true))
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
            }
            finally{
                dispatch(setLoading(false))
            }
        }
        fetchCountries()
    },[dispatch]);
    return {countries,isLoading,error}
}

export default useCountries;