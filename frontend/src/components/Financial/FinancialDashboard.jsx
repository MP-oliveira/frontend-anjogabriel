import FinancialForm from './FinancialForm';
import AccountForm from './AccountForm';
import BillForm from './BillForm';

const FinancialDashboard = () => {
  return (
    <div>
      <h1>Relatório Financeiro</h1>
      <FinancialForm />
      <AccountForm />
      <BillForm />
      {/* Aqui você pode adicionar o gráfico de evolução financeira */}
    </div>
  );
};

export default FinancialDashboard; 