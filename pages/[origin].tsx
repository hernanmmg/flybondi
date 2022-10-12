import {ParsedUrlQuery} from "node:querystring";

import {GetStaticPaths, GetStaticProps} from "next";
import React, {useEffect, useMemo, useRef, useState} from "react";

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
      trips: trips,
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
  const [sort, setSort] = useState<"days" | "price">("price");
  const [limit, setLimit] = useState<number>(10);

  const matches = useMemo(
    () => [...trips].sort((a, b) => a[sort] - b[sort]).slice(0, limit),
    [sort, trips, limit],
  );

  const checkpoint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLimit((limit) => limit + 10);
      }
    });

    if (checkpoint.current) {
      observer.observe(checkpoint.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <table>
        <thead>
          <tr>
            <td>Destino</td>
            <td
              style={{color: sort === "days" ? "yellow" : "inherit"}}
              onClick={() => setSort("days")}
            >
              Días
            </td>
            <td
              style={{color: sort === "price" ? "yellow" : "inherit"}}
              onClick={() => setSort("price")}
            >
              Precio
            </td>
          </tr>
        </thead>
        <tbody>
          {matches.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.origin.destination}</td>
              <td>{trip.days}</td>
              <td>
                {Math.ceil(trip.price).toLocaleString("en-US", {
                  currency: "USD",
                  style: "currency",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={checkpoint} />
    </>
  );
};

export default OriginPage;
