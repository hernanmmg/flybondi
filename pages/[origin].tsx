import {ParsedUrlQuery} from "node:querystring";

import {GetStaticPaths, GetStaticProps} from "next";
import React from "react";
import Head from "next/head";

import api from "../api";

import {Trip} from "./api/types";

type Props = {
  trips: Trip[];
};

type Params = ParsedUrlQuery & {
  origin: string;
};
export const getStaticProps: GetStaticProps<Props, Params> = async ({params}) => {
  const trips = await api.trips.list(params?.origin!);

  trips.sort((a, b) => a.ratio - b.ratio);

  return {
    props: {
      trips: trips.slice(0, 100),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const OriginPage: React.FC<Props> = ({trips}) => {
  return (
    <table>
      <thead>
        <tr>
          <td>Destino</td>
          <td>Días</td>
          <td>Precio</td>
        </tr>
      </thead>
      <tbody>
        {trips.map((trip) => (
          <tr key={trip.id}>
            <td>{trip.origin.destination}</td>
            <td>{trip.days}</td>
            <td>
              {Math.ceil(trip.price).toLocaleString("en-US", {currency: "USD", style: "currency"})}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OriginPage;
