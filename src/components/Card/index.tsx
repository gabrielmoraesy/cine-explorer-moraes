import styles from "./Card.module.css";
import { memo } from "react";
import { Button } from "../Button";
import { Star } from "phosphor-react";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import imgNull from "../../assets/img-null.jpg";
import Image from "next/image";
import Link from "next/link";

interface MovieCard {
  movieId: string;
  genresList?: {
    id: number;
    name: string;
  }[];
  movieImage: string;
  movieName: string;
  movieStars: string;
  movieGenre: string;
  movieReleaseDate: string;
}

export function CardComponent({
  movieId,
  genresList,
  movieImage,
  movieName,
  movieStars,
  movieGenre,
  movieReleaseDate,
}: MovieCard) {
  const api_url_image = "https://image.tmdb.org/t/p/w500/";

  return (
    <div className={styles.CardContainer}>
      <header className={styles.CardHeader}>
        {
          <Image
            className={styles.CardImage}
            src={movieImage ? api_url_image + movieImage : imgNull}
            alt="Imagem do filme"
            width={300}
            height={333}
          />
        }
      </header>

      <div className={styles.CardBody}>
        <h4 className={styles.CardBodyTitle}>{movieName}</h4>
        <p className={styles.CardBodyParagraph}>
          {movieReleaseDate &&
            format(new Date(movieReleaseDate), " dd ' de ' MMMM ' de ' YYY ", {
              locale: ptBR,
            })}
          <span className={styles.CardBodySpan}>
            <Star size={15} color="#F7C325" weight="fill" />
            {movieStars}
          </span>
          {genresList?.map((genre, index) => {
            if (movieGenre === genre.name) {
              return (
                <span className={styles.CardBodySpan} key={index}>
                  {genre.name}
                </span>
              );
            }
          })}
        </p>

        <Button>
          <Link href={`/${movieId}`}>
            <h1>Detalhes</h1>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const Card = memo(CardComponent, (prevProps, nextProps) => {
  return prevProps.movieName === nextProps.movieName;
});
