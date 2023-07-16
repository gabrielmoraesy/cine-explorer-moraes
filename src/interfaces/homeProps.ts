import { Movie } from "./movieProps";

export type HomeProps = {
  moviesMetadata: {
    page: number;
    total_pages: number;
    total_results: number;
  };
  getMoreMovies: (value: boolean) => void;
  setInputSearch: () => void;
  movies: Movie[];
};
