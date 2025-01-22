import React, { createContext, useState, useEffect } from 'react';

// Criar o contexto
export const UserContext = createContext();

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
