import { useEffect } from "react";
import styles from "./presenteAnimado.module.css";

interface PresenteAnimadoProps {
  imagem: string;
  nome: string;
  onComplete: () => void;
}

const PresenteAnimado: React.FC<PresenteAnimadoProps> = ({
  imagem,
  nome,
  onComplete,
}) => {
  useEffect(() => {
    const timeout = setTimeout(onComplete, 3000); // Fecha o componente após 4 segundos
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.mensagem}>
        <h2>Obrigado por nos presentear com: </h2>
        <p>{nome}</p>
      </div>
      <div className={styles.presente}>
        <div className={`${styles.laco} ${styles.lacoVertical}`}></div>
        <div className={`${styles.laco} ${styles.lacoHorizontal}`}></div>
        <div className={styles.topo}></div>
        <div className={styles.corpo}></div>
        <div>
          <img src={imagem} alt={nome} className={styles.imagemPresente} />
        </div>
      </div>
    </div>
  );
};

export default PresenteAnimado;
