import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importando ícones para mostrar/ocultar
import PropTypes from 'prop-types'; // Importando PropTypes

const InputPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [ password, setPassword ] = useState()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              style={{ flex: 1, paddingRight: '3px', minWidth: '190px'}}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '43%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999999b0',
                height: '36px',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
    </>
  );
};

// Adicionando validações de props
InputPassword.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default InputPassword; 