import React from "react";
import { Button } from "@mui/material";
import GenericFormModal from "./GenericFormModal";

const SmartGenericFormModal = ({ submitUrl, initialValues = {}, open, onClose }) => {
  const schema = [
    { name: "name", label: "Nome", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "idade", label: "Idade", type: "number", required: true, min: 0 },
    {
      name: "sexo",
      label: "Sexo",
      type: "select",
      required: true,
      options: [
        { value: "M", label: "Masculino" },
        { value: "F", label: "Feminino" },
      ],
    },
    { name: "observacoes", label: "Observações", type: "textarea" },
    { name: "arquivo", label: "Anexar Arquivo", type: "file", required: false, multiple: true },
  ];

  return (
    <GenericFormModal
      open={open}
      onClose={onClose}
      title={initialValues.id ? "Editar Usuário" : "Cadastro Simples"}
      formSchema={schema}
      submitUrl={submitUrl}
      initialValues={initialValues}
      onSuccess={() => {
        alert("Formulário enviado com sucesso!");
        onClose();
      }}
    />
  );
};

export default SmartGenericFormModal;