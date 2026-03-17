import styles        from './DiplomaResult.module.css';
import type { DiplomaData } from '../types/diploma';

interface Props {
  diploma:  DiplomaData | null;
  queryId:  string;
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function DiplomaResult({ diploma, queryId }: Props) {
  if (!diploma || !diploma.exists) {
    return (
      <div className={`${styles.resultCard} ${styles.notFound}`}>
        <span className={`${styles.badge} ${styles.badgeInvalid}`}>No encontrado</span>
        <p className={styles.notFoundMsg}>
          Este ID no corresponde a ningún diploma registrado en la cadena.
        </p>
      </div>
    );
  }

  const isValid = diploma.valid;

  return (
    <div className={`${styles.resultCard} ${isValid ? styles.valid : styles.revoked}`}>
      <span className={`${styles.badge} ${isValid ? styles.badgeValid : styles.badgeRevoked}`}>
        {isValid ? '✓ Diploma Válido' : '✗ Diploma Revocado'}
      </span>

      <h2 className={styles.studentName}>{diploma.studentName}</h2>
      <p className={styles.program}>{diploma.program}</p>

      <dl className={styles.meta}>
        <dt>Institución</dt>
        <dd>{diploma.institution}</dd>

        <dt>Fecha de emisión</dt>
        <dd>{formatDate(diploma.issuedAt)}</dd>

        <dt>Emitido por</dt>
        <dd className={styles.address}>{diploma.issuedBy}</dd>

        <dt>ID en cadena</dt>
        <dd className={styles.address}>{queryId}</dd>
      </dl>
    </div>
  );
}
