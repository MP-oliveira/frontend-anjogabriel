import React, { createContext, useState, useContext, useEffect } from 'react';

// Criar o contexto
const UserContext = createContext();

// Provedor do contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('User state:', user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar o contexto
export const useUser = () => {
  return useContext(UserContext);
};
