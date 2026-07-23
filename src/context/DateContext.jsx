import { createContext, useContext, useEffect, useState } from 'react';
const initial = { selectedDate: null, selectedTime: null, selectedFoods: [], currentStep: 1, hasAnsweredYes: false, isConfirmed: false };
const DateContext = createContext();
export function DateProvider({ children }) {
  const [state, setState] = useState(() => { try { const saved = JSON.parse(localStorage.getItem('best-friend-date')); return saved ? { ...initial, ...saved, selectedDate: saved.selectedDate ? new Date(saved.selectedDate) : null } : initial; } catch { return initial; } });
  useEffect(() => { localStorage.setItem('best-friend-date', JSON.stringify(state)); }, [state]);
  const update = values => setState(s => ({ ...s, ...values }));
  const resetJourney = () => setState(initial);
  return <DateContext.Provider value={{ ...state, update, resetJourney }}>{children}</DateContext.Provider>;
}
export const useDate = () => useContext(DateContext);
