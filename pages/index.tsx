import type {GetStaticProps, NextPage} from "next";

import Link from "next/link";

import api from "../api";
import styles from "../styles/App.module.css";

import {Flight} from "./api/types";

type Props = {
  origins: Flight["origin"][];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const origins = await api.origin.list();

  return {
    props: {
      origins,
    },
  };
};

const Home: NextPage<Props> = ({origins}) => {
  return (
    <div className={styles.grid}>
      {origins.map((origin) => (
        <Link key={origin} href={`/${origin}`}>
          <a className={styles.card}>
            {origin} {">"}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Home;
