import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";
import type { WalletState, DiplomaData, TxState } from "../types/diploma";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

interface UseContractReturn {
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  verifyDiploma: (id: string) => Promise<DiplomaData | null>;
  issueDiploma: (
    name: string,
    program: string,
    institution: string,
  ) => Promise<string | null>;
  revokeDiploma: (id: string) => Promise<boolean>;
}

export function useContract(): UseContractReturn {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    networkId: null,
    networkName: null,
  });

  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const getContract = useCallback(
    (signerOrProvider: ethers.Signer | ethers.providers.Provider) =>
      new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider),
    [],
  );

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask no detectado.");

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []);

    const web3Signer = web3Provider.getSigner();
    const address = await web3Signer.getAddress();
    const network = await web3Provider.getNetwork();

    setProvider(web3Provider);
    setSigner(web3Signer);
    setWallet({
      connected: true,
      address,
      networkId: network.chainId,
      networkName:
        network.name === "unknown" ? `Chain ${network.chainId}` : network.name,
    });
  }, []);

  const verifyDiploma = useCallback(
    async (id: string): Promise<DiplomaData | null> => {
      if (!provider && !window.ethereum) throw new Error("Sin conexión.");

      const readProvider =
        provider ?? new ethers.providers.Web3Provider(window.ethereum!);

      const contract = getContract(readProvider);

      const [
        exists,
        valid,
        studentName,
        program,
        institution,
        issuedAt,
        issuedBy,
      ] = await contract.verifyDiploma(id);

      return {
        exists,
        valid,
        studentName,
        program,
        institution,
        issuedAt: Number(issuedAt),
        issuedBy,
      };
    },
    [provider, getContract],
  );

  const issueDiploma = useCallback(
    async (
      name: string,
      program: string,
      institution: string,
    ): Promise<string | null> => {
      if (!signer) throw new Error("Wallet no conectada.");

      const contract = getContract(signer);
      const tx = await contract.issueDiploma(name, program, institution);
      const receipt: ethers.ContractReceipt = await tx.wait();

      const iface = new ethers.utils.Interface(CONTRACT_ABI as string[]);
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === "DiplomaIssued")
            return parsed.args.diplomaId as string;
        } catch {}
      }

      return null;
    },
    [signer, getContract],
  );

  const revokeDiploma = useCallback(
    async (id: string): Promise<boolean> => {
      if (!signer) throw new Error("Wallet no conectada.");

      const contract = getContract(signer);
      const tx = await contract.revokeDiploma(id);
      await tx.wait();
      return true;
    },
    [signer, getContract],
  );

  return { wallet, connectWallet, verifyDiploma, issueDiploma, revokeDiploma };
}

export function idleTx(): TxState {
  return { status: "idle", message: "" };
}
export function pendingTx(): TxState {
  return { status: "pending", message: "Esperando aprobación en MetaMask…" };
}
export function confirmTx(): TxState {
  return { status: "confirming", message: "Confirmando bloque…" };
}
export function successTx(msg: string): TxState {
  return { status: "success", message: msg };
}
export function errorTx(e: unknown): TxState {
  const msg =
    e instanceof Error
      ? ((e as { reason?: string }).reason ?? e.message)
      : "Error desconocido";
  return { status: "error", message: msg };
}
