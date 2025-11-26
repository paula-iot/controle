import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Coffee, Package, Bus, GraduationCap, PiggyBank, Calendar } from 'lucide-react';

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState({
    reserva: 0,
    investimento: 0,
    entretenimento: 0,
    outras: 0,
    transporte: 0,
    faculdade: 0
  });

  const [reservaTotal, setReservaTotal] = useState(0);
  const [diaAtual, setDiaAtual] = useState(new Date().getDate());
  const [editingBudget, setEditingBudget] = useState(false);

  const [budget, setBudget] = useState({
    total: 3000,
    reserva: 600,
    investimento: 500,
    entretenimento: 600,
    outras: 470,
    transporte: 330,
    faculdade: 500
  });

  const addExpense = (category, amount) => {
    const value = parseFloat(amount);
    if (value > 0) {
      setExpenses(prev => ({
        ...prev,
        [category]: prev[category] + value
      }));
    }
  };

  const resetMonth = () => {
    setExpenses({
      reserva: 0,
      investimento: 0,
      entretenimento: 0,
      outras: 0,
      transporte: 0,
      faculdade: 0
    });
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
    return (expenses[category] / budget[category]) * 100;
  };

  const categories = [
    { key: 'faculdade', name: 'Faculdade', icon: GraduationCap, color: 'bg-purple-500' },
    { key: 'transporte', name: 'Transporte', icon: Bus, color: 'bg-blue-500' },
    { key: 'investimento', name: 'Investimento Empresa', icon: TrendingUp, color: 'bg-green-500' },
    { key: 'entretenimento', name: 'Entretenimento', icon: Coffee, color: 'bg-pink-500' },
    { key: 'outras', name: 'Outras Despesas', icon: Package, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Meu OrÃ§amento Mensal</h1>
          <div className="flex items-center justify-center gap-4">
            {editingBudget ? (
              <>
                <input
                  type="number"
                  value={budget.total}
                  onChange={(e) => updateBudgetValue('total', e.target.value)}
                  className="bg-slate-700 text-white text-xl px-4 py-2 rounded-lg w-40 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setEditingBudget(false)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Salvar
                </button>
              </>
            ) : (
              <>
                <p className="text-slate-300 text-xl">R$ {budget.total.toFixed(2)}/mÃªs</p>
                <button
                  onClick={() => setEditingBudget(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-sm transition"
                >
                  Editar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Cards Principais */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100">DisponÃ­vel</span>
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">R$ {getRestante().toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100">Reserva Acumulada</span>
              <PiggyBank className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">R$ {reservaTotal.toFixed(2)}</p>
            {expenses.reserva === 0 && (
              <button 
                onClick={confirmarReserva}
                className="mt-3 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
              >
                Guardar R$ 600 deste mÃªs
              </button>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100">Dias atÃ© receber</span>
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{diaAtual <= 5 ? 5 - diaAtual : 35 - diaAtual} dias</p>
            <p className="text-sm text-purple-100 mt-1">PrÃ³ximo: dia 5</p>
          </div>
        </div>

        {/* Categorias */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Controle por Categoria</h2>
          
          <div className="space-y-6">
            {categories.map(cat => {
              const Icon = cat.icon;
              const remaining = getRemaining(cat.key);
              const progress = getProgress(cat.key);
              
              return (
                <div key={cat.key} className="bg-slate-700 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`${cat.color} p-2 rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{cat.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-400 text-sm">OrÃ§amento:</p>
                          <input
                            type="number"
                            value={budget[cat.key]}
                            onChange={(e) => updateBudgetValue(cat.key, e.target.value)}
                            className="bg-slate-600 text-white text-sm px-2 py-1 rounded w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        R$ {remaining.toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-sm">Restante</p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                    <div 
                      className={`${cat.color} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Valor gasto"
                      className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id={`input-${cat.key}`}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`input-${cat.key}`);
                        addExpense(cat.key, input.value);
                        input.value = '';
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Adicionar
                    </button>
                  </div>

                  <p className="text-slate-400 text-sm mt-2">
                    Gasto atÃ© agora: R$ {expenses[cat.key].toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumo e AÃ§Ãµes */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Resumo do MÃªs</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 mb-1">Total Gasto</p>
              <p className="text-2xl font-bold text-white">R$ {getTotalGasto().toFixed(2)}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 mb-1">Percentual Usado</p>
              <p className="text-2xl font-bold text-white">{((getTotalGasto() / budget.total) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <button
            onClick={resetMonth}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Resetar MÃªs (Novo Ciclo)
          </button>

          <div className="mt-6 bg-blue-900 bg-opacity-50 rounded-lg p-4 border border-blue-700">
            <h3 className="text-blue-300 font-semibold mb-2">ðŸ’¡ Dicas:</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>â€¢ Guarde os R$ 600 da reserva assim que receber</li>
              <li>â€¢ Separe R$ 400 para os dias 1-5 do prÃ³ximo mÃªs</li>
              <li>â€¢ Use em mÃ©dia R$ 60/dia do restante</li>
              <li>â€¢ Sua reserva nÃ£o pode ser tocada!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
