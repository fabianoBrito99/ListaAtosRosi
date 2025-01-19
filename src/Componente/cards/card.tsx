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
import { FaGift, FaInfoCircle, FaCheck, FaTimes } from "react-icons/fa";
import { Satisfy } from "next/font/google";

// Importar as configurações do Firebase
import firebaseConfig from "../../../firebaseConfig";
import Image from "next/image";
import PresenteAnimado from "../caixapresente/presenteAnimado";

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//fonte
const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

interface Presente {
  id: string;
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

const ListaPresente: React.FC = () => {
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPresente, setSelectedPresente] = useState<Presente | null>(
    null
  );
  const [showAnimation, setShowAnimation] = useState(false);
  // Função para buscar os presentes no Firestore
  const fetchPresentes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Presentes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Presente[];
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
      const presenteRef = doc(db, "Presentes", id);
      await updateDoc(presenteRef, { quantidade: novaQuantidade });
      setPresentes((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantidade: novaQuantidade } : item
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar a quantidade no Firestore:", error);
    }
  };

  const handleEscolherPresente = (presente: Presente) => {
    console.log("Selecionado:", presente);
    setSelectedPresente(presente);
    setModalVisible(true);
  };

  const confirmPresentear = async () => {
    if (selectedPresente) {
      const novaQuantidade = selectedPresente.quantidade - 1;
      await updatePresenteQuantidade(selectedPresente.id, novaQuantidade);
      setShowAnimation(true);
      setModalVisible(false);
      setTimeout(() => {
        setSelectedPresente(null);
        window.location.reload(); // Recarrega a página
      }, 3000);
    }
  };

  const cancelPresentear = () => {
    setModalVisible(false);
    setSelectedPresente(null);
  };

  useEffect(() => {
    fetchPresentes();
  }, []);

  const images = [
    "/Imagens/1.png",
    "/Imagens/2.png",
    "/Imagens/3.png",
    "/Imagens/4.png",
    "/Imagens/5.png",
    "/Imagens/6.png",
    "/Imagens/7.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Troca a imagem a cada 3 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [images.length]);

  return (
    <div className={`${styles.listaContainer}`}>
      <div className={`${styles.carrossel} ${styles.animeLeft}`}>
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          width={1200}
          height={500}
          className={styles.image}
        />
      </div>

      <div className={`${styles.container2}`}>
        <div className={styles.animeLeft1}>
          <h3 className={styles.titulo}>
            <Image
              className={styles.svg}
              src="/Imagens/logoAtosRosi.svg"
              alt=""
              width={120}
              height={80}
            />
            <span className={`${satisfy.className} ${styles.texto}`}>Lista de Presentes</span>
          </h3>
        </div>
        <div className={`${styles.observacao} ${styles.animeLeft2}`}>
          <FaInfoCircle
            className={styles.icone}
            style={{ width: "120px", height: "90px" }}
          />
          <p>
            Observação: Todos os itens e preços apresentados são aproximados
            baseados em valores e modelos obtidos em lojas como Havan, Mercado
            Livre e outros sites de comércio eletrônico. Assim, o preço e
            modelo, marca exata do produto pode variar, podendo ser encontrado
            por valores mais altos ou mais baixos, e marcas diferentes
            dependendo do local de compra. <br /> <br />
            A foto abaixo são ideias e inspirações da paleta de cores dos
            presentes, sabemos que podem ter alterações, então sinta-se à
            vontade... <br /> <br />
            <Image
              className={styles.fotoPaleta}
              src="/Imagens/paleta3.png"
              alt=""
              width={1100}
              height={500}
            />
          </p>
        </div>

        <div className={styles.listaCard}>
          {presentes.map((presente) => (
            <div key={presente.id} className={styles.card}>
              <div className={styles.cardPresente}>
                <Image
                  src={presente.imagem}
                  alt={presente.nome}
                  className={styles.imagemPresente}
                  width={250}
                  height={150}
                />
                <h2 className={styles.nomePresente}>{presente.nome}</h2>
                <p className={styles.descricao}>R$ {presente.preco}</p>
                <button
                  className={styles.botaoEscolher}
                  onClick={() => handleEscolherPresente(presente)}
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

        <div>
          {/* Outros elementos */}
          {showAnimation && selectedPresente && (
            <PresenteAnimado
              imagem={selectedPresente.imagem}
              nome={selectedPresente.nome}
              onComplete={() => setShowAnimation(false)} // Fecha a animação após terminar
            />
          )}
          {/* Modal de confirmação */}

          {modalVisible && selectedPresente && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Confirmar Presente</h2>
                <p>
                  Você tem certeza que deseja presentear{" "}
                  <strong>{selectedPresente.nome}</strong>? <br /> <br />
                  Este item desaparecerá da lista de presentes, de forma que
                  outra pessoa não poderá vê-lo ou presenteá-lo. Por favor, só
                  clique em confirmar se você realmente for dar este presente.
                </p>
                <div className={styles.modalButtons}>
                  <button
                    className={styles.confirmar}
                    onClick={confirmPresentear}
                  >
                    Confirmar{" "}
                    <FaCheck
                      className={styles.iconConCan}
                      size={20}
                      color="#fdf8e2"
                    />
                  </button>
                  <button
                    className={styles.Cancelar}
                    onClick={cancelPresentear}
                  >
                    Cancelar{" "}
                    <FaTimes
                      className={styles.iconConCan}
                      size={20}
                      color="#fdf8e2"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.AjudaFinal} >
           
            <p>
              <Image
                className={styles.fotoPaleta}
                src="/Imagens/Ajuda.png"
                alt=""
                width={1100}
                height={500}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaPresente;
