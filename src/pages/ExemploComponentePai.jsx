import React, { useState } from "react";
import { Button } from "@mui/material";
import GenericFormModal from "../framework/components/form/GenericFormModal";

const ExemploComponentePai = () => {
  const [modalAberto, setModalAberto] = useState(false);

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
        { value: "F", label: "Feminino" }
      ]
    },
    { name: "observacoes", label: "Observações", type: "textarea" },
    { name: "arquivo", label: "Anexar Arquivo", type: "file", required: false, multiple: true }
  ];

  return (
    <>
      <Button variant="contained" onClick={() => setModalAberto(true)}>
        Abrir Formulário
      </Button>

      <GenericFormModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Cadastro Simples"
        formSchema={schema}
        submitUrl="/api/users"
        method="POST"
        onSuccess={() => {
          alert("Formulário enviado com sucesso!");
        }}
      />
    </>
  );
};

export default ExemploComponentePai;