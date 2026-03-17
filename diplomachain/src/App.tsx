import { useState }      from 'react';
import { Header }        from './components/Header';
import { TabNav }        from './components/TabNav';
import { VerifyPanel }   from './components/VerifyPanel';
import { IssuePanel }    from './components/IssuePanel';
import { RevokePanel }   from './components/RevokePanel';
import { useContract }   from './hooks/useContract';
import type { TabId }    from './types/diploma';
import styles            from './App.module.css';

export default function App() {
  const [activeTab,   setActiveTab  ] = useState<TabId>('verify');
  const [connecting,  setConnecting ] = useState(false);
  const [connectErr,  setConnectErr ] = useState('');

  const { wallet, connectWallet, verifyDiploma, issueDiploma, revokeDiploma } = useContract();

  const handleConnect = async () => {
    setConnecting(true);
    setConnectErr('');
    try {
      await connectWallet();
    } catch (e) {
      setConnectErr(e instanceof Error ? e.message : 'Error al conectar.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.container}>

        <Header
          wallet={wallet}
          onConnect={handleConnect}
          connecting={connecting}
        />

        {connectErr && (
          <p className={styles.connectErr}>{connectErr}</p>
        )}

        <TabNav active={activeTab} onChange={setActiveTab} />

        <main className={styles.main}>
          {activeTab === 'verify' && (
            <VerifyPanel onVerify={verifyDiploma} />
          )}
          {activeTab === 'issue' && (
            <IssuePanel
              onIssue={issueDiploma}
              connected={wallet.connected}
            />
          )}
          {activeTab === 'revoke' && (
            <RevokePanel
              onRevoke={revokeDiploma}
              connected={wallet.connected}
            />
          )}
        </main>

        <footer className={styles.footer}>
          <span>DiplomaChain · Universidad Nacional de Colombia</span>
          <span className={styles.footerMono}>
            Solidity 0.8 · Ethers.js 5 · React 18
          </span>
        </footer>

      </div>
    </div>
  );
}
