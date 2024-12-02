<template>
  <div class="bg-black min-h-screen flex">
    <main class="flex-1 p-6">
      <header class="flex justify-between items-center ">
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

      <h1 class="text-4xl font-bold text-center mb-8 text-white">Lista de Diretores</h1>

      <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <div
          v-for="director in directors"
          :key="director.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col cursor-pointer"
        >
          <div class="p-4 flex-1">
            <h2 class="text-xl font-semibold text-red-600">{{ director.name }}</h2>
            <p class="mt-2 text-gray-700">{{ truncateBio(director.bio) }}</p>
          </div>
          <button
            @click="$router.push(`/director/${director.id}`)"
            class="p-4 bg-red-600 text-white text-center cursor-pointer"
          >
            <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Filmes</label>
          </button>
        </div>
      </div>

      <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center space-x-4">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 0"
          class="bg-red-600 text-white px-4 py-2 rounded-full shadow hover:bg-opacity-90 transition duration-200 disabled:opacity-50"
        >
          Anterior
        </button>
        <span class="text-lg font-semibold text-white">{{ currentPage + 1 }} de {{ totalPages }}</span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages - 1"
          class="bg-red-600 text-white px-4 py-2 rounded-full shadow hover:bg-opacity-90 transition duration-200 disabled:opacity-50"
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
  name: 'DirectorsList',
  data() {
    return {
      directors: [],
      currentPage: 0,
      pageSize: 9,
      totalPages: 0,
    };
  },
  created() {
    this.fetchDirectors();
  },
  methods: {
    async fetchDirectors() {
      try {
        const response = await api.get(`/directors?page=${this.currentPage}&size=${this.pageSize}`);
        this.directors = response.data?._embedded?.directorDtoList || [];
        this.totalPages = response.data?.page?.totalPages || 0;
      } catch (error) {
        console.error(error);
      }
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchDirectors();
    },
    truncateBio(bio, limit = 160) {
      if (bio.length > limit) {
        return bio.slice(0, limit) + '...';
      }
      return bio;
    }
  }
};
</script>

<style scoped>
.bg-primary {
  background-color: #e50914;
}

.bg-secondary {
  background-color: #b81d24;
}

.text-secondary {
  color: #b81d24;
}

.text-white {
  color: white;
}
</style>
