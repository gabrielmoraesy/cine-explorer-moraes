import styles from "@/styles/DetailsMovie.module.css";
import { api } from "../../services/api";

import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";

import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Star, CaretLeft } from "phosphor-react";
import imgNull from "../../assets/img-null.jpg";

import { useTheme, ThemeToggle } from "../../components/Contexts/ThemeContext";

interface DetailsMovie {
  original_title: string;
  overview: string;
  runtime: number;
  popularity: number;
  vote_average: number;
  vote_count: number;
  genres: {
    id: number;
    name: string;
  }[];
  poster_path: string;
  release_date: string;
}

export default function DetailsMovie() {
  const { isDarkMode } = useTheme();
  const api_url_image = "https://image.tmdb.org/t/p/w500/";

  const cssProperties = {
    width: "100px",
    height: "50px",
  };

  const [movie, setMovie] = useState<DetailsMovie | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const MovieId = router.query.MovieId;

  useEffect(() => {
    const getMovie = async () => {
      try {
        const { data } = await api.get(`/movie/${MovieId}`);

        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Erro ao buscar filme");
      }
    };
    getMovie();
  }, [MovieId]);

  return (
    <>
      <Head>
        <title>Filme | Cine Explorer Moraes</title>
      </Head>

      {loading ? (
        <div className={styles.SpinnerContainer}>
          <BeatLoader cssOverride={cssProperties} className="spinner" />
        </div>
      ) : (
        <div
          className={isDarkMode ? styles.darkContainer : styles.lightContainer}
        >
          <main className={styles.DetailsMovieMain}>
            <header className={styles.DetailsMovieHeader}>
              <Link href="/">
                <h1>
                  <CaretLeft size={25} /> Voltar
                </h1>
              </Link>
              <ThemeToggle />
              <h1>Detalhes</h1>
            </header>
            <div className={styles.DetailsMovieTitle}>
              <section className={styles.DetailsMovieSection}>
                <div className={styles.SectionTitle}>
                  <header>
                    <h1>{movie?.original_title}</h1>
                    <h1>
                      {movie?.release_date &&
                        format(new Date(movie?.release_date), " YYY ", {
                          locale: ptBR,
                        })}
                    </h1>
                  </header>

                  <div className={styles.DetailsMovieSinopseGenres}>
                    <div>
                      <h3>Sinopse</h3>
                      <p>{movie?.overview}</p>
                    </div>

                    <div className={styles.DetailsGenres}>
                      {movie?.genres?.map((genre, index) => {
                        return (
                          <span
                            key={index}
                            className={styles.DetailsSpanGenres}
                          >
                            {genre.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  {
                    <Image
                      className={styles.DetailsMovieImage}
                      src={
                        movie?.poster_path
                          ? api_url_image + movie.poster_path
                          : imgNull
                      }
                      alt="Imagem do filme"
                      width={300}
                      height={420}
                    />
                  }
                </div>
              </section>

              <div className={styles.DetailsMovieCards}>
                <header className={styles.DetailsMovieCardsTitle}>
                  <h1>Informações</h1>
                </header>
                <div className={styles.DetailsMovieCard}>
                  <div className={styles.Cards}>
                    <h3>Duração</h3>
                    <h2>{movie?.runtime} min</h2>
                  </div>
                  <div className={styles.Cards}>
                    <h3>Data de Lançamento</h3>
                    <h2>
                      {movie?.release_date &&
                        format(
                          new Date(movie?.release_date),
                          " dd ' de ' MMMM ' de ' YYY ",
                          {
                            locale: ptBR,
                          }
                        )}
                    </h2>
                  </div>
                  <div className={styles.Cards}>
                    <h3>Popularidade</h3>
                    <h2>{movie?.popularity.toFixed()}</h2>
                  </div>
                  <div className={styles.Cards}>
                    <h3>
                      Classificação{" "}
                      <Star size={15} color="#F7C325" weight="fill" />
                    </h3>
                    <h2>{movie?.vote_average.toFixed(2)}</h2>
                  </div>
                  <div className={styles.Cards}>
                    <h3>Contagem de Votos</h3>
                    <h2>{movie?.vote_count}</h2>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
