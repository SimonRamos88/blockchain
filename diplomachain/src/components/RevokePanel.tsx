import { useState }                                          from 'react';
import { Card, Field, Btn, SectionLabel, FormGrid, TxFeedback } from './UI';
import { idleTx, pendingTx, confirmTx, successTx, errorTx }    from '../hooks/useContract';
import type { TxState }                                         from '../types/diploma';
import styles                                                   from './RevokePanel.module.css';

interface Props {
  onRevoke:  (id: string) => Promise<boolean>;
  connected: boolean;
}

export function RevokePanel({ onRevoke, connected }: Props) {
  const [id,       setId      ] = useState('');
  const [tx,       setTx      ] = useState<TxState>(idleTx());
  const [showConfirm, setShowConfirm] = useState(false);

  const busy = tx.status === 'pending' || tx.status === 'confirming';

  const handleRevoke = async () => {
    setShowConfirm(false);
    setTx(pendingTx());

    try {
      setTimeout(() => setTx(confirmTx()), 800);
      await onRevoke(id.trim());
      setTx(successTx('Diploma revocado. El registro permanece en la cadena marcado como inválido.'));
      setId('');
    } catch (e) {
      setTx(errorTx(e));
    }
  };

  return (
    <div>
      <SectionLabel>Revocar diploma · acción permanente</SectionLabel>

      {!connected && (
        <div className={styles.warning}>
          Conecta tu wallet para revocar diplomas.
        </div>
      )}

      <Card>
        <p className={styles.description}>
          La revocación es permanente e irreversible. El diploma no desaparece
          de la cadena — queda marcado como inválido y cualquier verificación
          lo mostrará como revocado. Úsalo solo ante fraude comprobado.
        </p>

        <div className={styles.divider} />

        <FormGrid>
          <Field
            label="ID del diploma a revocar"
            id="revoke-id"
            value={id}
            onChange={v => { setId(v); setTx(idleTx()); setShowConfirm(false); }}
            placeholder="0xabc123…"
            fullWidth
          />
        </FormGrid>

        <div className={styles.actions}>
          {!showConfirm ? (
            <Btn
              variant="ghost"
              onClick={() => setShowConfirm(true)}
              disabled={busy || !connected || !id.trim()}
            >
              Continuar
            </Btn>
          ) : (
            <div className={`${styles.confirmRow} fade-up`}>
              <span className={styles.confirmText}>¿Confirmas la revocación?</span>
              <Btn variant="danger" onClick={handleRevoke} disabled={busy}>
                {busy ? 'Procesando…' : 'Sí, revocar'}
              </Btn>
              <Btn variant="ghost" onClick={() => setShowConfirm(false)}>
                Cancelar
              </Btn>
            </div>
          )}
        </div>

        <TxFeedback tx={tx} />
      </Card>
    </div>
  );
}
