export type TabId = "verify" | "issue" | "revoke";

export interface DiplomaData {
  exists: boolean;
  valid: boolean;
  studentName: string;
  program: string;
  institution: string;
  issuedAt: number;
  issuedBy: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  networkId: number | null;
  networkName: string | null;
}

export type TxStatus = "idle" | "pending" | "confirming" | "success" | "error";

export interface TxState {
  status: TxStatus;
  message: string;
}
