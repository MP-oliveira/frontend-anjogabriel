import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importando ícones para mostrar/ocultar
import PropTypes from 'prop-types'; // Importando PropTypes

const InputPassword = ({ value, onChange, placeholder = "Digite sua senha" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
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