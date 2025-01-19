'use client'
import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Image
        className={styles.svg}
        src="/imagens/logoAtosRosi2.svg"
        alt=""
        width={120}
        height={80}
      />
      <p>Atos e Rosi. Todos os direitos reservados.</p>
      <h6>Desenvolvido por Fabiano Brito</h6>
      
    </footer>
  );
}
