import styles from "./animation.module.css";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export default function ({ show, onBoot }: { show: string; onBoot: boolean }) {
  return (
    <>
      <div className={styles.container}>
        <div
          className={`${styles.semicircle} ${
            onBoot
              ? show == "sun"
                ? ""
                : styles.hide
              : show == "moon"
              ? styles.sunset
              : styles.rise
          }`}
        >
          <SunIcon onBoot={onBoot} />
        </div>
        <div
          className={`${styles.semicircle} ${
            onBoot
              ? show == "moon"
                ? ""
                : styles.hide
              : show == "sun"
              ? styles.sunset
              : styles.rise
          }`}
        >
          <MoonIcon onBoot={onBoot} />
        </div>
      </div>
    </>
  );
}
