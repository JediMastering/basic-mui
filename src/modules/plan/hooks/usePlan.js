import { useState, useCallback } from "react";
import { planApi } from "../api/planApi";
import { useSnackbar } from "../../../framework/hooks/useSnackbar";

export const usePlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSnackbar } = useSnackbar();

  const fetchPlanById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await planApi.getPlanById(id);
      setPlan(data);
    } catch (err) {
      setError(err);
      showSnackbar(`Erro ao carregar plano com ID ${id}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  const createPlan = useCallback(async (planData) => {
    setLoading(true);
    setError(null);
    try {
      const newPlan = await planApi.createPlan(planData);
      showSnackbar("Plano criado com sucesso!", "success");
      return newPlan;
    } catch (err) {
      setError(err);
      showSnackbar("Erro ao criar plano", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  const updatePlan = useCallback(async (id, planData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlan = await planApi.updatePlan(id, planData);
      showSnackbar("Plano atualizado com sucesso!", "success");
      return updatedPlan;
    } catch (err) {
      setError(err);
      showSnackbar(`Erro ao atualizar plano com ID ${id}`, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  const deletePlan = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await planApi.deletePlan(id);
      showSnackbar("Plano excluído com sucesso!", "success");
    } catch (err) {
      setError(err);
      showSnackbar(`Erro ao excluir plano com ID ${id}`, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  return {
    plan,
    loading,
    error,
    fetchPlanById,
    createPlan,
    updatePlan,
    deletePlan,
  };
};