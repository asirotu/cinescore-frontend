<template>
  <confirm-modal
        :isOpen="isModalOpen"
        :onConfirm="deleteMovie"
        :message="'Deseja realmente remover este Filme?'"
        @close="isModalOpen = false"
      />

      <modal
        :isOpen="isErrorModalOpen"
        :title="'Erro ao remover o Filme'"
        :message="errorMessage"
        @close="isErrorModalOpen = false"
      />

  <div class="bg-black min-h-screen flex">
    <aside :class="['bg-gray-900 w-64 p-4 transition-all', isMenuOpen ? 'translate-x-0 block' : '-translate-x-full hidden']">
      <h2 class="text-white text-2xl font-semibold mb-8 text-center">Painel Administrador</h2>
      <ul>
        <li>
          <button
            @click="navigateTo('admin/movies')"
            class="text-white w-full py-2 text-lg hover:bg-gray-700 px-4 rounded border-b-2 border-gray-700"
          >
            Filmes
          </button>
        </li>
        <li>
          <button
            @click="navigateTo('admin/directors')"
            class="text-white w-full py-2 text-lg hover:bg-gray-700 px-4 rounded border-b-2 border-gray-700"
          >
            Diretores
          </button>
        </li>
        <li>
          <button
            @click="navigateTo('admin/users')"
            class="text-white w-full py-2 text-lg hover:bg-gray-700 px-4 rounded border-b-2 border-gray-700"
          >
            Usuários
          </button>
        </li>
        <li>
          <button
            @click="logout()"
            class="text-white w-full py-2 text-lg hover:bg-red-700 px-4 rounded border-b-2 border-gray-700 mt-8"
          >
            Sair
          </button>
        </li>
      </ul>
    </aside>

    <main class="flex-1 p-6">
      <header class="flex justify-between items-center mb-8">
        <img
          @click.stop="$router.push('/')"
          class="w-32 object-contain"
          src="../assets/cinescore.jpeg"
          alt="Logo"
        />
        <button @click="toggleMenu" class="text-white font-semibold">
          Menu
        </button>
      </header>

      <div class="flex justify-between items-center mb-4">
        <h2 class="text-white text-3xl font-semibold">Filmes</h2>
        <button
          @click.stop="$router.push('/admin/add/movie')"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Adicionar Filme
        </button>
      </div>

      <div class="grid gap-6 grid-cols-5">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="bg-black rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl"
          @click="goToMovieDetails(movie.id)"
        >
          <img
            :src="movie.image"
            alt="Capa do Filme"
            class="h-64 object-cover transition-transform duration-300"
          />
          <div class="pl-4 py-2 bg-white">
            <h3 class="text-gray-500 text-xl font-semibold">{{ movie.title }}</h3>
          </div>
          <div class="text-center flex justify-between">
            <button
              @click.stop="editMovie(movie.id)"
              class="bg-yellow-500 text-white font-semibold rounded-ld hover:bg-yellow-600 transition-colors w-full"
            >
              Editar
            </button>
            <button
              @click.stop="confirmRemoveMovie(movie.id)"
              class="bg-red-600 text-white font-semibold px-4 py-2 rounded-rd hover:bg-red-700 transition-colors w-full"
            >
              Deletar
            </button>
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
import ConfirmModal from './Modal.vue';
import Modal from './ModalConfirm.vue';

export default {
  name: 'MoviesList',
  components: {
    ConfirmModal,
    Modal
  },
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
      isModalOpen: false,
      movieToRemove: null,
      isErrorModalOpen: false,
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
    navigateTo(page) {
      this.$router.push(`/${page}`);
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
    async editMovie(movieId) {
      this.$router.push(`/admin/edit/movies/${movieId}`);
    },
    async deleteMovie() {
      try {
        await api.delete(`/movies/${this.movieToRemove}`);
        this.movies = this.movies.filter((movie) => movie.id !== this.movieToRemove);
      } catch (error) {
        console.error('Erro ao excluir filme:', error);
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
    confirmRemoveMovie(movieId) {
      this.movieToRemove = movieId;
      this.isModalOpen = true;
    },
  },
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
