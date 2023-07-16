import { Movie } from "./movieProps";

export type HomePageProps = {
  movies: Movie[];
  getMoreMovies: (value: boolean) => void;
  moviesMetadata: {
    page: number;
    total_pages: number;
    total_results: number;
  };
  inputSearch: string;
};
