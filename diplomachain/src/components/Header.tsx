import styles      from './Header.module.css';
import type { WalletState } from '../types/diploma';

interface Props {
  wallet:        WalletState;
  onConnect:     () => Promise<void>;
  connecting:    boolean;
}

export function Header({ wallet, onConnect, connecting }: Props) {
  const shortAddr = wallet.address
    ? wallet.address.slice(0, 6) + '…' + wallet.address.slice(-4)
    : null;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h1 className={styles.logo}>
          Diploma<span className={styles.logoAccent}>Chain</span>
        </h1>
        <p className={styles.tagline}>Registro inmutable de títulos académicos</p>
      </div>

      <div className={styles.right}>
        {wallet.connected && (
          <div className={styles.networkBadge}>
            <span className={styles.dot} />
            <span>{wallet.networkName}</span>
          </div>
        )}
        <button
          className={`${styles.connectBtn} ${wallet.connected ? styles.connected : ''}`}
          onClick={onConnect}
          disabled={connecting || wallet.connected}
        >
          {connecting
            ? 'Conectando…'
            : wallet.connected
              ? shortAddr
              : 'Conectar Wallet'}
        </button>
      </div>
    </header>
  );
}
