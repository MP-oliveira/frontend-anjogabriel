import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Criar o contexto
export const UserContext = createContext();

// Provedor do contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};
