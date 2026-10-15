import { createContext, useEffect, useState } from 'react';
import api from '../api/axios.js';

export const CategoriesContext = createContext({ categories: [] });

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => setCategories(data.map((c) => c.name)))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};