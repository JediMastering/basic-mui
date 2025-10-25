import React, { useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Button from "../../../framework/components/inputs/Button";
import { PlanForm } from "./PlanForm";
import { usePlan } from "../hooks/usePlan";

export const PlanFormModal = ({ open, onClose, onSuccess, initialValues }) => {
  const { createPlan, updatePlan } = usePlan();
  const isEditMode = !!initialValues;
  const formRef = useRef(null);

  const handleSubmit = async (planData) => {
    try {
      if (isEditMode) {
        await updatePlan(initialValues.id, planData);
      } else {
        await createPlan(planData);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save plan:", error);
    }
  };

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? "Editar Plano" : "Criar Novo Plano"}</DialogTitle>
      <DialogContent>
        <PlanForm ref={formRef} onSubmit={handleSubmit} initialData={initialValues} isEditMode={isEditMode} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleFormSubmit} color="primary" variant="contained">
          {isEditMode ? "Atualizar Plano" : "Criar Plano"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
