import styles   from './TabNav.module.css';
import type { TabId } from '../types/diploma';

const TABS: { id: TabId; label: string; hint: string }[] = [
  { id: 'verify', label: 'Verificar',  hint: 'sin gas · lectura pública' },
  { id: 'issue',  label: 'Emitir',     hint: 'requiere wallet autorizada' },
  { id: 'revoke', label: 'Revocar',    hint: 'requiere wallet autorizada' },
];

interface Props {
  active:   TabId;
  onChange: (id: TabId) => void;
}

export function TabNav({ active, onChange }: Props) {
  return (
    <nav className={styles.nav}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className={styles.label}>{tab.label}</span>
          <span className={styles.hint}>{tab.hint}</span>
        </button>
      ))}
    </nav>
  );
}
