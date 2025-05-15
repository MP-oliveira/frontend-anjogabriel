import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import api from '../../services/api';
import PropTypes from 'prop-types';
import './Dashboard.css';

function Dashboard() {
  const [contas, setContas] = useState([]);
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visaoGeral');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filtroData, setFiltroData] = useState({
    dataInicio: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    dataFim: new Date().toISOString().split('T')[0]
  });

  const [stats, setStats] = useState({
    saldoTotal: 0,
    totalReceitas: 0,
    totalDespesas: 0,
    categoriasDespesas: [],
    categoriasReceitas: [],
    transacoesPorDia: [],
    ultimasTransacoes: []
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff6b6b', '#9775fa', '#748ffc'];

  const formatarValor = (valor) => {
    return parseFloat(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    // Se vier no formato yyyy-mm-dd ou yyyy-mm-ddTHH:MM:SS
    const [data] = dataString.split('T');
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar transações
      const url = `http://localhost:3001/api/financeiro?dataInicio=${filtroData.dataInicio}&dataFim=${filtroData.dataFim}`;
      const responseTransacoes = await api.get(url);
      
      // Buscar contas
      const responseContas = await api.get('/financeiro/contas');
      setContas(responseContas.data);
      
      processarDados(responseTransacoes.data, responseContas.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setStats({
        saldoTotal: 0,
        totalReceitas: 0,
        totalDespesas: 0,
        categoriasDespesas: [],
        categoriasReceitas: [],
        transacoesPorDia: [],
        ultimasTransacoes: []
      });
    } finally {
      setLoading(false);
    }
  }, [filtroData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processarDados = (transacoes, contas) => {
    const saldoTotal = contas.reduce((acc, conta) => acc + parseFloat(conta.saldo_atual || 0), 0);
    const totalReceitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);
    const totalDespesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);

    const categoriasDespesas = agruparPorCategoria(transacoes.filter(t => t.tipo === 'despesa'));
    const categoriasReceitas = agruparPorCategoria(transacoes.filter(t => t.tipo === 'receita'));
    const transacoesPorDia = agruparPorData(transacoes);
    const ultimasTransacoes = [...transacoes]
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 5);

    setStats({
      saldoTotal,
      totalReceitas,
      totalDespesas,
      categoriasDespesas,
      categoriasReceitas,
      transacoesPorDia,
      ultimasTransacoes
    });
  };

  const agruparPorCategoria = (transacoes) => {
    const categorias = {};
    transacoes.forEach(t => {
      if (!t.categoria) return;
      categorias[t.categoria] = (categorias[t.categoria] || 0) + parseFloat(t.valor || 0);
    });
    return Object.keys(categorias).map(categoria => ({
      name: categoria,
      value: categorias[categoria]
    }));
  };

  const agruparPorData = (transacoes) => {
    const datas = {};
    transacoes.forEach(t => {
      const dataFormatada = t.data.split('T')[0];
      if (!datas[dataFormatada]) {
        datas[dataFormatada] = {
          data: dataFormatada,
          receitas: 0,
          despesas: 0
        };
      }
      if (t.tipo === 'receita') {
        datas[dataFormatada].receitas += parseFloat(t.valor || 0);
      } else {
        datas[dataFormatada].despesas += parseFloat(t.valor || 0);
      }
    });
    return Object.values(datas).sort((a, b) => new Date(a.data) - new Date(b.data));
  };

  const handlePeriodoChange = (novoPeriodo) => {
    setPeriodo(novoPeriodo);
    
    const hoje = new Date();
    let dataInicio = new Date();
    
    switch (novoPeriodo) {
      case 'semana':
        dataInicio.setDate(hoje.getDate() - 7);
        break;
      case 'mes':
        dataInicio.setMonth(hoje.getMonth() - 1);
        break;
      case 'trimestre':
        dataInicio.setMonth(hoje.getMonth() - 3);
        break;
      case 'ano':
        dataInicio.setFullYear(hoje.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    setFiltroData({
      dataInicio: dataInicio.toISOString().split('T')[0],
      dataFim: hoje.toISOString().split('T')[0]
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="tooltip-label" style={{ margin: '0 0 5px 0' }}>{label}</p>
          {payload.map((entry, index) => (
            <p 
              key={index} 
              style={{ 
                color: entry.stroke || entry.fill || '#000',
                margin: '2px 0'
              }}
            >
              {`${entry.name}: ${formatarValor(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Dashboard Financeiro</h1>
          <p className="subtitle">Visualize e analise suas finanças de forma simplificada</p>
        </div>
        <div className="header-actions">
          <button className="btn-filter" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <span className="icon-filter"></span>
            Filtrar
          </button>
          <Link to="/transacoes" className="btn-voltar">Ver Transações</Link>
        </div>
      </div>
      
      {/* Novos Botões para Adicionar e Visualizar Transações */}
      <div className="action-buttons">
        <Link to="/transacoes" className="btn-action">Visualizar Transações</Link>
        <Link to="/adicionar-conta" className="btn-action">Adicionar Conta</Link>
        <Link to="/adicionar-transacao" className="btn-action">Adicionar Transação</Link>
      </div>
      
      {isFilterOpen && (
        <div className="filter-panel">
          <form onSubmit={handleFilterSubmit}>
            <div className="filter-form">
              <div className="filter-group">
                <label>Data Inicial</label>
                <input
                  type="date"
                  value={filtroData.dataInicio}
                  onChange={(e) => setFiltroData({...filtroData, dataInicio: e.target.value})}
                />
              </div>
              <div className="filter-group">
                <label>Data Final</label>
                <input
                  type="date"
                  value={filtroData.dataFim}
                  onChange={(e) => setFiltroData({...filtroData, dataFim: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-apply">Aplicar Filtro</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="period-selector">
        <button 
          className={`period-btn ${periodo === 'semana' ? 'active' : ''}`}
          onClick={() => handlePeriodoChange('semana')}
        >
          7 dias
        </button>
        <button 
          className={`period-btn ${periodo === 'mes' ? 'active' : ''}`}
          onClick={() => handlePeriodoChange('mes')}
        >
          30 dias
        </button>
        <button 
          className={`period-btn ${periodo === 'trimestre' ? 'active' : ''}`}
          onClick={() => handlePeriodoChange('trimestre')}
        >
          3 meses
        </button>
        <button 
          className={`period-btn ${periodo === 'ano' ? 'active' : ''}`}
          onClick={() => handlePeriodoChange('ano')}
        >
          12 meses
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados financeiros...</p>
        </div>
      ) : (
        <>
          <div className="cards-container">
            <div className="dashboard-card saldo-card">
              <div className="card-icon saldo-icon"></div>
              <div className="card-content">
                <h3>Saldo Atual</h3>
                <p className={`card-value ${stats.saldoTotal >= 0 ? 'positive' : 'negative'}`}>
                  {formatarValor(stats.saldoTotal)}
                </p>
              </div>
            </div>
            
            <div className="dashboard-card receita-card">
              <div className="card-icon receita-icon"></div>
              <div className="card-content">
                <h3>Total de Receitas</h3>
                <p className="card-value positive">{formatarValor(stats.totalReceitas)}</p>
              </div>
              <div className="card-footer">
                <span>+{((stats.totalReceitas / (stats.totalReceitas + stats.totalDespesas || 1)) * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="dashboard-card despesa-card">
              <div className="card-icon despesa-icon"></div>
              <div className="card-content">
                <h3>Total de Despesas</h3>
                <p className="card-value negative">{formatarValor(stats.totalDespesas)}</p>
              </div>
              <div className="card-footer">
                <span>-{((stats.totalDespesas / (stats.totalReceitas + stats.totalDespesas || 1)) * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="dashboard-card saldo-mensal-card">
              <div className="card-icon saldo-mensal-icon"></div>
              <div className="card-content">
                <h3>Saldo no Período</h3>
                <p className={`card-value ${stats.totalReceitas - stats.totalDespesas >= 0 ? 'positive' : 'negative'}`}>
                  {formatarValor(stats.totalReceitas - stats.totalDespesas)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-tabs">
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'visaoGeral' ? 'active' : ''}`}
                onClick={() => setActiveTab('visaoGeral')}
              >
                Visão Geral
              </button>
              <button 
                className={`tab-btn ${activeTab === 'despesas' ? 'active' : ''}`}
                onClick={() => setActiveTab('despesas')}
              >
                Despesas
              </button>
              <button 
                className={`tab-btn ${activeTab === 'receitas' ? 'active' : ''}`}
                onClick={() => setActiveTab('receitas')}
              >
                Receitas
              </button>
              <button 
                className={`tab-btn ${activeTab === 'contas' ? 'active' : ''}`}
                onClick={() => setActiveTab('contas')}
              >
                Contas
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'visaoGeral' && (
                <div className="tab-panel">
                  <div className="chart-container">
                    <h3>Fluxo de Caixa</h3>
                    <ResponsiveContainer width="95%"  height={300}>
                      <AreaChart
                        data={stats.transacoesPorDia}
                        margin={{ top: 0, right: 30, left: 70, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="data" tickFormatter={formatarData} dy={7} />
                        <YAxis  />
                        <Tooltip 
                          formatter={(value) => formatarValor(value)}
                          labelFormatter={formatarData}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="receitas" stackId="1" stroke="#28a745" fill="#28a745" name="Receitas" />
                        <Area type="monotone" dataKey="despesas" stackId="1" stroke="#dc3545" fill="#dc3545" name="Despesas" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="table-container">
                    <h3>Últimas Transações</h3>
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Descrição</th>
                          <th>Categoria</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.ultimasTransacoes.map(transacao => (
                          <tr key={transacao.id}>
                            <td>{formatarData(transacao.data)}</td>
                            <td>{transacao.descricao || '-'}</td>
                            <td>{transacao.categoria || '-'}</td>
                            <td className={transacao.tipo === 'receita' ? 'valor-positivo' : 'valor-negativo'}>
                              {formatarValor(transacao.valor)}
                            </td>
                          </tr>
                        ))}
                        {stats.ultimasTransacoes.length === 0 && (
                          <tr>
                            <td colSpan="4" className="no-data">Nenhuma transação encontrada no período</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'despesas' && (
                <div className="tab-panel">
                  <div className="chart-container">
                    <h3>Despesas por Categoria</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.categoriasDespesas}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.categoriasDespesas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatarValor(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="table-container">
                    <h3>Últimas Despesas</h3>
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Descrição</th>
                          <th>Categoria</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.ultimasTransacoes
                          .filter(t => t.tipo === 'despesa')
                          .map(transacao => (
                            <tr key={transacao.id}>
                              <td>{formatarData(transacao.data)}</td>
                              <td>{transacao.descricao || '-'}</td>
                              <td>{transacao.categoria || '-'}</td>
                              <td className="valor-negativo">{formatarValor(transacao.valor)}</td>
                            </tr>
                          ))}
                        {stats.ultimasTransacoes.filter(t => t.tipo === 'despesa').length === 0 && (
                          <tr>
                            <td colSpan="4" className="no-data">Nenhuma despesa encontrada no período</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'receitas' && (
                <div className="tab-panel">
                  <div className="chart-container">
                    <h3>Receitas por Categoria</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.categoriasReceitas}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.categoriasReceitas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatarValor(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="table-container">
                    <h3>Últimas Receitas</h3>
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Descrição</th>
                          <th>Categoria</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.ultimasTransacoes
                          .filter(t => t.tipo === 'receita')
                          .map(transacao => (
                            <tr key={transacao.id}>
                              <td>{formatarData(transacao.data)}</td>
                              <td>{transacao.descricao || '-'}</td>
                              <td>{transacao.categoria || '-'}</td>
                              <td className="valor-positivo">{formatarValor(transacao.valor)}</td>
                            </tr>
                          ))}
                        {stats.ultimasTransacoes.filter(t => t.tipo === 'receita').length === 0 && (
                          <tr>
                            <td colSpan="4" className="no-data">Nenhuma receita encontrada no período</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'contas' && (
                <div className="tab-panel">
                  <div className="contas-container">
                    <h3>Distribuição de Saldo por Conta</h3>
                    <div className="contas-grid">
                      {contas.length === 0 ? (
                        <p className="no-data">Nenhuma conta encontrada</p>
                      ) : (
                        contas.map(conta => (
                          <div key={conta.id} className="conta-card">
                            <div className="conta-header">
                              <h4>{conta.nome}</h4>
                              <span className="conta-tipo">{conta.tipo}</span>
                            </div>
                            <div className="conta-body">
                              <div className="conta-saldo">
                                <span className="saldo-label">Saldo Atual</span>
                                <span className={`saldo-valor ${parseFloat(conta.saldo_atual) >= 0 ? 'positive' : 'negative'}`}>
                                  {formatarValor(conta.saldo_atual)}
                                </span>
                              </div>
                            </div>
                            <div className="conta-footer">
                              <Link to={`/contas/${conta.id}`} className="btn-detalhes">Ver Detalhes</Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;