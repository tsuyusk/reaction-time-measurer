import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { Inter, Roboto, Roboto_Condensed } from "@next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "700" });

function mixClassNames(...classNames) {
  return classNames.filter(className => !!className).join(" ");
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [delayTime, setDelayTime] = useState(0);
  let initialTime = useRef(0);

  useEffect(() => {
    if (isClickable) {
      initialTime.current = performance.now();
    }
  }, [isClickable]);

  const activateTimeDelay = useCallback(() => {
    const delay = Math.floor(Math.random() * (5 * 1000));

    setTimeout(() => {
      setIsClickable(true);
    }, delay);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (hasClicked) {
      setIsClickable(false);
      setHasClicked(false);
      setHasStarted(true);
      activateTimeDelay();
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      activateTimeDelay();
      return;
    }

    if (isClickable) {
      const currentTime = performance.now();

      setDelayTime(Math.floor(currentTime - initialTime.current));
      setHasClicked(true);
      return;
    }
  }, [hasStarted, isClickable, hasClicked, activateTimeDelay]);

  return (
    <button
      onMouseDown={handleMouseDown}
      className={mixClassNames(
        styles.main,
        styles.button,
        (hasClicked || !hasStarted) && styles.blueBg,
        !isClickable && styles.redBg,
        isClickable && styles.greenBg
      )}
    >
      <h1 className={inter.className}>
        {!hasStarted && "Click anywhere to start"}
        {hasStarted && (
          <>
            {!hasClicked && (
              <>
                {!isClickable && "Wait for the screen to get green..."}
                {isClickable && "Click!"}
              </>
            )}
          </>
        )}
      </h1>
      {hasClicked && (
        <>
          <h1 className={inter.className}>{`${delayTime} ms`}</h1>
          <h2 className={inter.className}>Click again to restart</h2>
        </>
      )}
    </button>
  );
}
