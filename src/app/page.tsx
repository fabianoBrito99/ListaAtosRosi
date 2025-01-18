"use client"
import ListaPresente from "@/Componente/cards/card";
import { motion } from "framer-motion";
import styles from "./motion.module.css";

export default function Home() {
  return (
    <motion.div
      className={styles.listaContainer}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <ListaPresente />
    </motion.div>
  );
}
