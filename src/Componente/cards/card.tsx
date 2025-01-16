"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import styles from "./card.module.css";
import { FaGift, FaInfoCircle } from "react-icons/fa";

// Importar as configurações do Firebase
import firebaseConfig from "../../../firebaseConfig";
import Image from "next/image";

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Presente {
  id: string;
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

const ListaPresente: React.FC = () => {
  const [presentes, setPresentes] = useState<Presente[]>([]);

  // Função para buscar os presentes no Firestore
  const fetchPresentes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Presentes"));
      const data = querySnapshot.docs.map((doc) => {
        console.log("Documento obtido:", doc.id, doc.data()); // Verifique o que está vindo do Firestore
        return {
          id: doc.id,
          ...doc.data(),
        };
      }) as Presente[];
      console.log("Dados recebidos do Firestore:", data); // Verifique os dados completos aqui
      setPresentes(data.filter((presente) => presente.quantidade > 0));
    } catch (error) {
      console.error("Erro ao buscar os dados do Firestore:", error);
    }
  };

  // Função para atualizar a quantidade de um presente no Firestore
  const updatePresenteQuantidade = async (
    id: string,
    novaQuantidade: number
  ) => {
    try {
      const presenteRef = doc(db, "Presentes", id); // ID como string
      await updateDoc(presenteRef, { quantidade: novaQuantidade });
      // Atualiza localmente após o sucesso
      setPresentes((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantidade: novaQuantidade } : item
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar a quantidade no Firestore:", error);
    }
  };

  const handleEscolherPresente = async (id: string) => {
    const item = presentes.find((item) => item.id === id);
    if (item && item.quantidade > 0) {
      const novaQuantidade = item.quantidade - 1;
      console.log(
        `Atualizando presente com ID: ${id}, nova quantidade: ${novaQuantidade}`
      );
      await updatePresenteQuantidade(id, novaQuantidade); // Atualiza a quantidade no Firestore
    }
  };

  useEffect(() => {
    fetchPresentes(); // Busca os presentes na inicialização
  }, []);

  return (
    <div className={styles.listaContainer}>
      <div className={styles.fotoAt}>
        <Image src="/Imagens/AtosRosi.png" alt="" width={1200} height={500} />
      </div>
      <div>
        <Image
          className={styles.fotoFlor}
          src="/Imagens/flor2.png"
          alt=""
          width={300}
          height={160}
        />
      </div>
      <div className={styles.container2}>
        <div>
          <h3 className={styles.titulo}>
          <Image
            className={styles.fotoLaco}
            src="/Imagens/laco.png"
            alt=""
            width={570}
            height={160}
          />
            Lista de Presentes</h3>
        </div>
        <div className={styles.observacao}>
          <FaInfoCircle
            style={{ width: "110px", height: "70px", marginRight: "8px" }}
          />
          <p>
            Observação: Todos os preços apresentados são aproximados, baseados
            em valores obtidos em lojas como Havan, Mercado Livre e outros sites
            de comércio eletrônico. Assim, o preço do produto pode variar,
            podendo ser encontrado por valores mais altos ou mais baixos,
            dependendo do local de compra.
          </p>
        </div>

        <div className={styles.listaCard}>
          {presentes.map((presente) => (
            <div key={presente.id} className={styles.card}>
              <div className={styles.cardPresente}>
                <img
                  src={presente.imagem}
                  alt={presente.nome}
                  className={styles.imagemPresente}
                />
                <h2 className={styles.nomePresente}>{presente.nome}</h2>
                <p className={styles.descricao}>R$ {presente.preco}</p>
                <button
                  className={styles.botaoEscolher}
                  onClick={() => handleEscolherPresente(presente.id)}
                  disabled={presente.quantidade <= 0}
                >
                  Presentear{" "}
                  <FaGift
                    className={styles.icon}
                    style={{ marginRight: "8px", height: "20px" }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaPresente;
