import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Coffee, Package, Bus, GraduationCap, PiggyBank, Calendar, Edit2, Check, Plus, Trash2, Download } from 'lucide-react';

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState({
    reserva: 0,
    investimento: 0,
    entretenimento: 0,
    outras: 0,
    transporte: 0,
    faculdade: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [reservaTotal, setReservaTotal] = useState(0);
  const [editingBudget, setEditingBudget] = useState(null);

  const [budget, setBudget] = useState({
    total: 3000,
    reserva: 600,
    investimento: 500,
    entretenimento: 600,
    outras: 470,
    transporte: 330,
    faculdade: 500
  });

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('budgetData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setExpenses(data.expenses || expenses);
      setTransactions(data.transactions || []);
      setReservaTotal(data.reservaTotal || 0);
      setBudget(data.budget || budget);
    }
  }, []);

  // Salvar automaticamente quando algo mudar
  useEffect(() => {
    const dataToSave = {
      expenses,
      transactions,
      reservaTotal,
      budget
    };
    localStorage.setItem('budgetData', JSON.stringify(dataToSave));
  }, [expenses, transactions, reservaTotal, budget]);

  const addExpense = (category, amount) => {
    const value = parseFloat(amount);
    if (value > 0) {
      setExpenses(prev => ({
        ...prev,
        [category]: prev[category] + value
      }));
      setTransactions(prev => [...prev, {
        id: Date.now(),
        category,
        amount: value,
        date: new Date().toISOString()
      }]);
    }
  };

  const resetMonth = () => {
    if (confirm('Tem certeza que deseja resetar o mês? Todos os dados serão perdidos!')) {
      setExpenses({
        reserva: 0,
        investimento: 0,
        entretenimento: 0,
        outras: 0,
        transporte: 0,
        faculdade: 0
      });
      setTransactions([]);
    }
  };

  const confirmarReserva = () => {
    setReservaTotal(prev => prev + budget.reserva);
    addExpense('reserva', budget.reserva);
  };

  const updateBudgetValue = (category, value) => {
    const newValue = parseFloat(value) || 0;
    setBudget(prev => ({
      ...prev,
      [category]: newValue
    }));
  };

  const getRemaining = (category) => {
    return budget[category] - expenses[category];
  };

  const getTotalGasto = () => {
    return Object.values(expenses).reduce((a, b) => a + b, 0);
  };

  const getRestante = () => {
    return budget.total - getTotalGasto();
  };

  const getProgress = (category) => {
    return Math.min((expenses[category] / budget[category]) * 100, 100);
  };

  const getDaysUntilPayday = () => {
    const today = new Date().getDate();
    return today <= 5 ? 5 - today : 35 - today;
  };

  const exportToExcel = () => {
    // Cabeçalho do CSV com separador ponto e vírgula para Excel brasileiro
    let csv = '\uFEFF'; // BOM para UTF-8
    csv += 'CONTROLE DE ORÇAMENTO MENSAL\n\n';
    
    // Tabela de Categorias
    csv += 'CATEGORIAS\n';
    csv += 'Categoria;Orçamento;Gasto;Restante;Percentual\n';
    
    categories.forEach(cat => {
      const gasto = expenses[cat.key].toFixed(2).replace('.', ',');
      const orcamento = budget[cat.key].toFixed(2).replace('.', ',');
      const restante = (budget[cat.key] - expenses[cat.key]).toFixed(2).replace('.', ',');
      const percentual = ((expenses[cat.key] / budget[cat.key]) * 100).toFixed(1).replace('.', ',');
      
      csv += `${cat.name};R$ ${orcamento};R$ ${gasto};R$ ${restante};${percentual}%\n`;
    });
    
    // Espaço entre tabelas
    csv += '\n\n';
    
    // Tabela de Resumo
    csv += 'RESUMO GERAL\n';
    csv += 'Descrição;Valor\n';
    csv += `Orçamento Total;R$ ${budget.total.toFixed(2).replace('.', ',')}\n`;
    csv += `Total Gasto;R$ ${getTotalGasto().toFixed(2).replace('.', ',')}\n`;
    csv += `Disponível;R$ ${getRestante().toFixed(2).replace('.', ',')}\n`;
    csv += `Reserva Acumulada;R$ ${reservaTotal.toFixed(2).replace('.', ',')}\n`;
    
    // Espaço entre tabelas
    csv += '\n\n';
    
    // Tabela de Transações
    if (transactions.length > 0) {
      csv += 'HISTÓRICO DE TRANSAÇÕES\n';
      csv += 'Data;Categoria;Valor\n';
      transactions.forEach(t => {
        const date = new Date(t.date).toLocaleDateString('pt-BR');
        const catName = categories.find(c => c.key === t.category)?.name || t.category;
        const valor = t.amount.toFixed(2).replace('.', ',');
        csv += `${date};${catName};R$ ${valor}\n`;
      });
    }
    
    // Criar arquivo e download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orcamento_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = [
    { key: 'faculdade', name: 'Faculdade', icon: GraduationCap, gradient: 'from-purple-500 to-purple-600' },
    { key: 'transporte', name: 'Transporte', icon: Bus, gradient: 'from-blue-500 to-blue-600' },
    { key: 'investimento', name: 'Investimento Empresa', icon: TrendingUp, gradient: 'from-green-500 to-green-600' },
    { key: 'entretenimento', name: 'Entretenimento', icon: Coffee, gradient: 'from-pink-500 to-pink-600' },
    { key: 'outras', name: 'Outras Despesas', icon: Package, gradient: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Meu Orçamento Mensal
          </h1>
          <div className="flex items-center justify-center gap-3">
            {editingBudget === 'total' ? (
              <>
                <input
                  type="number"
                  value={budget.total}
                  onChange={(e) => updateBudgetValue('total', e.target.value)}
                  className="bg-slate-800 text-white text-xl px-4 py-2 rounded-xl w-40 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
                  autoFocus
                />
                <button
                  onClick={() => setEditingBudget(null)}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl transition"
                >
                  <Check className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <p className="text-slate-300 text-xl">R$ {budget.total.toFixed(2)}/mês</p>
                <button
                  onClick={() => setEditingBudget('total')}
                  className="text-slate-400 hover:text-white transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          {/* Botão Exportar */}
          <button
            onClick={exportToExcel}
            className="mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold transition shadow-lg flex items-center gap-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            Exportar para Excel
          </button>
        </div>

        {/* Cards Principais */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          
          {/* Disponível */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-2xl border border-emerald-400/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-emerald-50 text-sm font-medium">Disponível</span>
              <div className="bg-white/20 p-2 rounded-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-1">R$ {getRestante().toFixed(2)}</p>
            <div className="h-1 bg-emerald-400/30 rounded-full mt-3">
              <div 
                className="h-1 bg-white rounded-full transition-all"
                style={{ width: `${100 - (getTotalGasto() / budget.total * 100)}%` }}
              />
            </div>
          </div>

          {/* Reserva Acumulada */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-2xl border border-blue-400/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-50 text-sm font-medium">Reserva Acumulada</span>
              <div className="bg-white/20 p-2 rounded-lg">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-3">R$ {reservaTotal.toFixed(2)}</p>
            {expenses.reserva === 0 && (
              <button 
                onClick={confirmarReserva}
                className="w-full bg-white/90 hover:bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg"
              >
                Guardar R$ {budget.reserva.toFixed(0)} deste mês
              </button>
            )}
          </div>

          {/* Dias até receber */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-2xl border border-purple-400/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-50 text-sm font-medium">Dias até receber</span>
              <div className="bg-white/20 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{getDaysUntilPayday()} dias</p>
            <p className="text-purple-100 text-sm mt-2">Próximo: dia 5</p>
          </div>
        </div>

        {/* Controle por Categoria */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Controle por Categoria</h2>
          
          <div className="grid gap-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              const remaining = getRemaining(cat.key);
              const progress = getProgress(cat.key);
              
              return (
                <div key={cat.key} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`bg-gradient-to-br ${cat.gradient} p-3 rounded-xl shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">{cat.name}</h3>
                        <div className="flex items-center gap-2">
                          {editingBudget === cat.key ? (
                            <>
                              <input
                                type="number"
                                value={budget[cat.key]}
                                onChange={(e) => updateBudgetValue(cat.key, e.target.value)}
                                className="bg-slate-700 text-white text-sm px-3 py-1 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                              <button
                                onClick={() => setEditingBudget(null)}
                                className="text-green-400 hover:text-green-300"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-slate-400 text-sm">Orçamento: R$ {budget[cat.key].toFixed(2)}</span>
                              <button
                                onClick={() => setEditingBudget(cat.key)}
                                className="text-slate-500 hover:text-slate-300"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        R$ {remaining.toFixed(2)}
                      </p>
                      <p className="text-slate-500 text-xs">restante</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>R$ {expenses[cat.key].toFixed(2)} gasto</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r ${cat.gradient} h-2 rounded-full transition-all duration-500 shadow-lg`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Add Expense */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Valor gasto"
                      className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                      id={`input-${cat.key}`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = document.getElementById(`input-${cat.key}`);
                          addExpense(cat.key, input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`input-${cat.key}`);
                        addExpense(cat.key, input.value);
                        input.value = '';
                      }}
                      className={`bg-gradient-to-r ${cat.gradient} hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg flex items-center gap-2`}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumo Final */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">Resumo do Mês</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <p className="text-slate-400 text-sm mb-1">Total Gasto</p>
              <p className="text-3xl font-bold text-white">R$ {getTotalGasto().toFixed(2)}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <p className="text-slate-400 text-sm mb-1">Percentual Usado</p>
              <p className="text-3xl font-bold text-white">{((getTotalGasto() / budget.total) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <button
            onClick={resetMonth}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Resetar Mês (Novo Ciclo)
          </button>

          {/* Dicas */}
          <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/20">
            <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Dicas para Organizar seu Orçamento
            </h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Guarde os R$ {budget.reserva.toFixed(0)} da reserva assim que receber</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Separe R$ 400 para os dias 1-5 do próximo mês</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Use em média R$ 60/dia do restante para não ultrapassar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span className="font-semibold">Sua reserva é intocável! Não use em hipótese alguma.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span className="font-semibold">Seus dados são salvos automaticamente no navegador!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
