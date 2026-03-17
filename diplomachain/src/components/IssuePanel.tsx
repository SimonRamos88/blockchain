import { useState } from "react";
import {
  Card,
  Field,
  Btn,
  SectionLabel,
  FormGrid,
  TxFeedback,
  HashBox,
} from "./UI";
import {
  idleTx,
  pendingTx,
  confirmTx,
  successTx,
  errorTx,
} from "../hooks/useContract";
import type { TxState } from "../types/diploma";
import styles from "./IssuePanel.module.css";

interface Props {
  onIssue: (
    name: string,
    program: string,
    institution: string,
  ) => Promise<string | null>;
  connected: boolean;
}

export function IssuePanel({ onIssue, connected }: Props) {
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [institution, setInstitution] = useState("");
  const [tx, setTx] = useState<TxState>(idleTx());
  const [newId, setNewId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const busy = tx.status === "pending" || tx.status === "confirming";

  const handleIssue = async () => {
    if (!name.trim() || !program.trim() || !institution.trim()) return;

    setTx(pendingTx());
    setNewId(null);

    try {
      const id = await (async () => {
        const promise = onIssue(
          name.trim(),
          program.trim(),
          institution.trim(),
        );
        setTimeout(() => setTx(confirmTx()), 800);
        return promise;
      })();

      setTx(successTx("Diploma registrado en la cadena exitosamente."));
      setNewId(id);
      setName("");
      setProgram("");
      setInstitution("");
    } catch (e) {
      setTx(errorTx(e));
    }
  };

  const handleCopy = () => {
    if (!newId) return;
    navigator.clipboard.writeText(newId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <SectionLabel>Emitir diploma · escribe en la cadena</SectionLabel>

      {!connected && (
        <div className={styles.warning}>
          Conecta tu wallet para emitir diplomas.
        </div>
      )}

      <Card>
        <FormGrid>
          <Field
            label="Nombre del egresado"
            id="issue-name"
            value={name}
            onChange={setName}
            placeholder="María García López"
            fullWidth
          />
          <Field
            label="Programa académico"
            id="issue-program"
            value={program}
            onChange={setProgram}
            placeholder="Ingeniería de Sistemas"
          />
          <Field
            label="Institución"
            id="issue-institution"
            value={institution}
            onChange={setInstitution}
            placeholder="Universidad Nacional de Colombia"
          />
        </FormGrid>

        <div className={styles.actions}>
          <Btn
            variant="primary"
            onClick={handleIssue}
            disabled={
              busy ||
              !connected ||
              !name.trim() ||
              !program.trim() ||
              !institution.trim()
            }
          >
            {busy ? "Procesando…" : "Emitir Diploma"}
          </Btn>
        </div>

        <TxFeedback tx={tx} />
      </Card>

      {newId && (
        <div className={`${styles.resultBlock} fade-up`}>
          <SectionLabel>Diploma emitido · guarda este ID</SectionLabel>
          <Card>
            <p className={styles.idHint}>
              Este hash es la prueba de autenticidad. Compártelo con el egresado
              para que cualquiera pueda verificarlo sin intermediarios.
            </p>
            <HashBox value={newId} onCopy={handleCopy} />
            {copied && (
              <p className={styles.copied}>¡Copiado al portapapeles!</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
