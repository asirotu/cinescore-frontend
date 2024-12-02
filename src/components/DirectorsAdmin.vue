<template>
  <confirm-modal
        :isOpen="isModalOpen"
        :onConfirm="removeDirector"
        :message="'Deseja realmente remover este Diretor?'"
        @close="isModalOpen = false"
      />
      <modal
        :isOpen="isErrorModalOpen"
        :title="'Erro ao remover o Diretor'"
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
        <button @click="toggleMenu" class="text-white">
          Menu
        </button>
      </header>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-white text-3xl font-semibold">Diretores</h2>
        <button
          @click="goToAddDirector"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Adicionar Diretor
        </button>
      </div>
    <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      <div
        v-for="director in directors"
        :key="director.id"
        @click="goToDirector(director.id)"
        class="bg-white rounded-xl shadow-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer"
      >
        <div class="p-6 flex-1">
          <h2 class="text-2xl font-semibold text-red-600">{{ director.name }}</h2>
          <p class="mt-2 text-gray-600">{{ truncateBio(director.bio) }}</p>
        </div>
        <div class="flex justify-between bg-gray-100 border-t border-gray-200">
          <button class="bg-yellow-600 text-white w-full p-4 text-center font-semibold hover:bg-yellow-700 transition-colors" @click.stop="$router.push(`/admin/edit/directors/${director.id}`)">
            Editar
          </button>
          <button class="bg-red-600 text-white w-full p-4 text-center font-semibold hover:bg-red-700 transition-colors" @click.stop="confirmRemoveDirector(director.id)">
            Remover
          </button>
        </div>
      </div>
    </div>
      <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center space-x-4">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 0"
          class="bg-primary text-white px-4 py-2 rounded-full shadow hover:opacity-90 transition duration-200 disabled:opacity-50"
        >
          Anterior
        </button>
        <span class="text-lg font-semibold text-white">{{ currentPage + 1 }} de {{ totalPages }}</span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages - 1"
          class="bg-primary text-white px-4 py-2 rounded-full shadow hover:opacity-90 transition duration-200 disabled:opacity-50"
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
  name: 'DirectorsAdmin',
  components: {
    ConfirmModal,
    Modal
  },
  data() {
    return {
      directors: [],
      currentPage: 0,
      pageSize: 9,
      totalPages: 0,
      isModalOpen: false,
      directorIdToRemove: null,
      errorMessage: '',
      isErrorModalOpen: false,
      isMenuOpen: false 
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
    goToAddDirector() {
      this.$router.push('/admin/add/director');
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchDirectors();
    },
    goToDirector(directorId) {
      this.$router.push(`/director/${directorId}`);
    },
    async removeDirector() {
      if (this.directorIdToRemove) {
        try {
          await api.delete(`/directors/${this.directorIdToRemove}`);
          this.fetchDirectors();
        } catch (error) {
          this.isErrorModalOpen = true;
          this.errorMessage = error.response?.data?.message || 'Erro ao remover autor.';
        } finally {
          this.isModalOpen = false;
          this.directorIdToRemove = null;
        }
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigateTo(route) {
      this.$router.push(`/${route}`);
    },
    truncateBio(bio, limit = 160) {
      if (bio.length > limit) {
        return bio.slice(0, limit) + '...';
      }
      return bio;
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
    confirmRemoveDirector(directorId) {
      this.directorIdToRemove = directorId;
      this.isModalOpen = true;
    },
  }
};
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc;
}

.bg-white {
  background-color: white;
}

.bg-primary {
  background-color: #f56565;
}

.bg-secondary {
  background-color: #4c51bf;
}

.text-secondary {
  color: #4c51bf;
}

.text-primary {
  color: #f56565;
}

.text-white {
  color: white;
}

.text-gray-700 {
  color: #4a5568;
}

.text-gray-600 {
  color: #718096;
}

.text-gray-500 {
  color: #a0aec0;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.cursor-pointer {
  cursor: pointer;
}

.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transition-transform {
  transition: transform 0.3s;
}

.transition-all {
  transition: all 0.3s;
}

.hover\:bg-opacity-80:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.hover\:bg-opacity-90:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.grid {
  display: grid;
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.mt-6 {
  margin-top: 1.5rem;
}

.mt-10 {
  margin-top: 2.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.ml-6 {
  margin-left: 1.5rem;
}

.mr-6 {
  margin-right: 1.5rem;
}

.ml-auto {
  margin-left: auto;
}

.mr-auto {
  margin-right: auto;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.pl-6 {
  padding-left: 1.5rem;
}

.pt-4 {
  padding-top: 1rem;
}

.pb-4 {
  padding-bottom: 1rem;
}

.pt-8 {
  padding-top: 2rem;
}

.pb-8 {
  padding-bottom: 2rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.transition-all {
  transition: all 0.3s ease-in-out;
}

.shadow-lg {
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
}

.shadow {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
