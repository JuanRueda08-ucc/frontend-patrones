import styles from "./QuotaPanel.module.css";

interface PlanBadgeProps {
  plan: string;
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  const normalized = plan.trim().toUpperCase() || "FREE";

  return (
    <span className={styles.planBadge} data-plan={normalized}>
      {normalized}
    </span>
  );
}
