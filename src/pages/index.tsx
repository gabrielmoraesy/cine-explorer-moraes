import styles from "@/styles/HomePage.module.css";
import { api } from "../services/api";

import { HomePageProps } from "@/interfaces/homePageProps";
import { Navbar } from "@/components/Navbar";

import Head from "next/head";

import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

import { Card } from "@/components/Card";
import { Movie } from "@/interfaces/movieProps";
import { useTheme } from "../components/Contexts/ThemeContext";

const BeatLoaderCssProperties = {
  display: "flex",
  width: "50px",
  height: "50px",
};

export default function Home() {
  const { isDarkMode } = useTheme();
  const [movies, setMovies] = useState<HomePageProps["movies"]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [moviesMetadata, setMoviesMetadata] = useState<
    HomePageProps["moviesMetadata"]
  >({
    page: 0,
    total_pages: 0,
    total_results: 0,
  });

  const params = useMemo(() => new URLSearchParams(), []);

  params.set("sort_by", "popularity.desc");
  params.set("page", "1");
  params.set("api_key", process.env.NEXT_PUBLIC_API_KEY || "");

  const query = useMemo(() => new URLSearchParams(), []);
  query.set("query", inputSearch);

  const searchMovies = useCallback(async () => {
    try {
      const { data } = await api.get("/search/movie", {
        params: {
          query: inputSearch,
        },
      });

      setMovies(data.results);
      setMoviesMetadata({
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar filmes");
    }
  }, [inputSearch]);

  const getMovies = useCallback(async () => {
    try {
      const { data } = await api.get(`/discover/movie`, {
        params,
      });

      setMoviesMetadata({
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      });

      return data;
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar filmes");
    }
  }, [params]);

  const getMoreMovies = async () => {
    if (inputSearch.length < 3) {
      params.set("page", `${moviesMetadata.page + 1}`);
      getMovies().then((data) => {
        setMovies([...movies, ...data.results]);
      });
    } else {
      query.set("page", `${moviesMetadata.page + 1}`);
      try {
        const { data } = await api.get("/search/movie", {
          params: {
            query: inputSearch,
            page: moviesMetadata.page + 1,
          },
        });
        setMovies([...movies, ...data.results]);
        setMoviesMetadata({
          page: data.page,
          total_pages: data.total_pages,
          total_results: data.total_results,
        });
      } catch (error) {
        console.log(error);
        toast.error("Erro ao buscar filmes");
      }
    }
  };

  useEffect(() => {
    if (inputSearch.length >= 3) {
      searchMovies();
    } else {
      getMovies().then((data) => {
        setMovies(data.results);
      });
    }
  }, [getMovies, inputSearch.length, searchMovies]);

  return (
    <>
      <div
        className={isDarkMode ? styles.darkContainer : styles.lightContainer}
      >
        <Head>
          <title>Home | Cine Explorer Moraes</title>
        </Head>
        <Navbar inputSearchValue={setInputSearch} />
        <main className={styles.HomePageStyled}>
          <section className={styles.HomePageContainer}>
            <div className={styles.HomePageTitle}>
              {inputSearch.length < 3
                ? "Filmes populares"
                : `Resultados para: ${inputSearch}`}
            </div>
            <InfiniteScroll
              className={styles.InfiniteScroll}
              dataLength={movies.length}
              next={() => getMoreMovies()}
              hasMore={moviesMetadata?.page <= moviesMetadata?.total_pages}
              loader={
                movies.length > 1 && (
                  <div className={styles.HomePageSpinner}>
                    <BeatLoader
                      cssOverride={BeatLoaderCssProperties}
                      className="spinner"
                    />
                  </div>
                )
              }
              endMessage={
                <p
                  style={{
                    textAlign: "center",
                    position: "absolute",
                    bottom: 10,
                  }}
                >
                  <b>{`Não foi encontrado mais nenhum filme com: ${inputSearch}`}</b>
                </p>
              }
            >
              {movies &&
                movies?.map((movie: Movie, index: number) => (
                  <Card
                    key={index}
                    movieId={movie?.id}
                    movieImage={movie?.poster_path}
                    movieName={movie?.title}
                    movieStars={movie?.vote_average}
                    movieGenre={movie?.genre_ids[0]}
                    movieReleaseDate={movie?.release_date}
                  />
                ))}
            </InfiniteScroll>
          </section>
        </main>
      </div>
    </>
  );
}
