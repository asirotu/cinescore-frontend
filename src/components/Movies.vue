<template>
  <div class="bg-black min-h-screen flex">
    <main class="flex-1 p-6">
      <header class="flex justify-between items-center mb-8">
        <img
          @click.stop="$router.push('/')"
          class="w-32 object-contain"
          src="../assets/cinescore.jpeg"
          alt="Logo"
        />
        <div class="flex space-x-4">
          <button @click.stop="$router.push(`/movies`)" class="text-white font-semibold">
            Filmes
          </button>
          <button @click.stop="$router.push(`/directors`)" class="text-white font-semibold">
            Diretores
          </button>
          <button @click.stop="$router.push(`/users`)" class="text-white font-semibold">
            Conta
          </button>
        </div>
      </header>

      <div class="grid gap-6 grid-cols-3">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="bg-black rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl"
          @click="goToMovieDetails(movie.id)"
        >
          <img
            :src="movie.image"
            alt="Capa do Filme"
            class="w-full object-cover transition-transform duration-300"
          />
          <div class="p-4 py-2 bg-white flex justify-between">
            <div class="flex flex-col">
              <h3 class="text-gray-900 text-xl font-semibold">{{ movie.title }}</h3>
              <h5 class="text-gray-500 text-sm">{{ movie.director.name }}</h5>
            </div>
            <div class="flex items-center">
              <div class="flex">
                <svg
                  v-for="index in 5"
                  :key="index"
                  class="w-6 h-6"
                  :class="index <= Math.floor(movie.rating) ? 'text-yellow-500' : 'text-gray-400'"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 15l-3.294 2.276a1 1 0 0 1-1.473-1.073l.629-3.69-2.676-2.613a1 1 0 0 1 .557-1.707l3.709-.53L7.853 4.66a1 1 0 0 1 1.894-.855l1.315 3.634 3.72.532a1 1 0 0 1 .557 1.707l-2.676 2.613.63 3.69a1 1 0 0 1-1.473 1.073L10 15z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="ml-2 text-yellow-500 font-semibold">{{ movie.rating }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center space-x-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 0"
          class="bg-red-600 text-white px-4 py-2 rounded-full shadow hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          Anterior
        </button>
        <span class="text-lg text-white">{{ currentPage + 1 }} de {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages - 1"
          class="bg-red-600 text-white px-4 py-2 rounded-full shadow hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          Próxima
        </button>
      </div>
    </main>
  </div>
</template>
<script>
import api from '../api';

export default {
  name: 'MoviesList',
  data() {
    return {
      movies: [],
      currentPage: 0,
      pageSize: 12,
      totalPages: 0,
      newMovie: {
        title: '',
        image: '',
      },
      isMenuOpen: false,
    };
  },
  created() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await api.get(`/movies?page=${this.currentPage}&size=${this.pageSize}`);
        this.movies = response.data?._embedded?.movieDtoList || [];
        this.totalPages = response.data?.page?.totalPages;
      } catch (error) {
        console.error(error);
      }
    },
    goToMovieDetails(movieId) {
      this.$router.push(`/movies/${movieId}`);
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.fetchMovies();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.fetchMovies();
      }
    },
    logout() {
      console.log("Usuário deslogado");
      this.$router.push('/login');
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>
<style scoped>
body {
  font-family: 'Inter', sans-serif;
}

svg {
  transition: fill 0.2s ease;
}

.text-yellow-500 {
  fill: #f59e0b;
}

.text-gray-400 {
  fill: #d1d5db;
}
</style>
