// src/hooks/useFormState.js
export function useFormState(initialState = {}) {
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (error) setError('');
    };
  
    return {
      formData,
      setFormData,
      error,
      setError,
      isLoading,
      setIsLoading,
      handleChange
    };
  }