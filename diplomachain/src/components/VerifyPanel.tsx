import { useState }                                 from 'react';
import { Card, Field, Btn, SectionLabel, FormGrid } from './UI';
import { DiplomaResult }                            from './DiplomaResult';
import type { DiplomaData }                         from '../types/diploma';
import styles                                       from './VerifyPanel.module.css';

interface Props {
  onVerify: (id: string) => Promise<DiplomaData | null>;
}

export function VerifyPanel({ onVerify }: Props) {
  const [id,      setId     ] = useState('');
  const [result,  setResult ] = useState<DiplomaData | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState('');

  const handleVerify = async () => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    setResult(undefined);
    try {
      const data = await onVerify(id.trim());
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al consultar la cadena.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div>
      <SectionLabel>Verificación pública · sin costo de gas</SectionLabel>
      <Card>
        <FormGrid>
          <Field
            label="ID del Diploma (hash 0x…)"
            id="verify-id"
            value={id}
            onChange={setId}
            placeholder="0xabc123…"
            fullWidth
          />
        </FormGrid>
        <div className={styles.actions}>
          <Btn
            variant="secondary"
            onClick={handleVerify}
            disabled={loading || !id.trim()}
          >
            {loading ? 'Consultando…' : 'Verificar Diploma'}
          </Btn>
        </div>

        {error && (
          <p className={styles.error}>{error}</p>
        )}
      </Card>

      {result !== undefined && (
        <div className="fade-up" style={{ marginTop: 24 }}>
          <DiplomaResult diploma={result} queryId={id} />
        </div>
      )}
    </div>
  );
}
