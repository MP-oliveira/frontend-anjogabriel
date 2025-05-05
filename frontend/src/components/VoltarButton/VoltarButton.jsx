import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const VoltarButton = ({ url }) => {

  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(url)} className="btn-voltar">Voltar</button>
  );
}

VoltarButton.propTypes = {
  url: PropTypes.string.isRequired,
};

export default VoltarButton