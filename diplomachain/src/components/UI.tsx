import styles from "./UI.module.css";
import type { TxState } from "../types/diploma";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}
interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  fullWidth,
}: FieldProps) {
  return (
    <div className={`${styles.field} ${fullWidth ? styles.fullWidth : ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}

type BtnVariant = "primary" | "secondary" | "danger" | "ghost";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  children: React.ReactNode;
}

export function Btn({
  variant = "primary",
  children,
  className = "",
  ...rest
}: BtnProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

export function TxFeedback({ tx }: { tx: TxState }) {
  if (tx.status === "idle") return null;

  const cls = {
    pending: styles.txPending,
    confirming: styles.txPending,
    success: styles.txSuccess,
    error: styles.txError,
    idle: "",
  }[tx.status];

  const icon = {
    pending: "⏳",
    confirming: "⛓",
    success: "✓",
    error: "✗",
    idle: "",
  }[tx.status];

  return (
    <div className={`${styles.txFeedback} ${cls} fade-up`}>
      <span className={styles.txIcon}>{icon}</span>
      <span>{tx.message}</span>
    </div>
  );
}

export function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.formGrid}>{children}</div>;
}

export function HashBox({
  value,
  onCopy,
}: {
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className={styles.hashBox}>
      <code className={styles.hashValue}>{value}</code>
      <button className={styles.copyBtn} onClick={onCopy}>
        Copiar
      </button>
    </div>
  );
}
