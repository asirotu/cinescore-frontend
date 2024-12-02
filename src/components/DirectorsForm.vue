<template>
  <div class="bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full sm:w-3/4 lg:w-1/2">
      <h2 class="text-3xl font-bold text-center mb-6 text-primary">
        {{ director.id ? 'Editar Autor' : 'Cadastrar Autor' }}
      </h2>

      <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="saveDirector" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="name">Nome</label>
          <input 
            v-model="director.name" 
            type="text" 
            id="name" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required 
            placeholder="Digite o Nome do Autor"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="bio">Biografia</label>
          <textarea 
            v-model="director.bio" 
            id="bio" 
            rows="4" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            placeholder="Digite a Biografia do Autor (máx. 500 caracteres)"
          ></textarea>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button @click="goBack" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition duration-200">
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="isLoading" 
            class="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition duration-200"
          >
            <span v-if="isLoading">Carregando...</span>
            <span v-else>{{ director.id ? 'Atualizar' : 'Salvar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'EditDirector',
  data() {
    return {
      director: {
        name: '',
        bio: ''
      },
      isLoading: false,
      errorMessage: null
    };
  },
  created() {
    const directorId = this.$route.params.id;
    if (directorId) {
      this.fetchDirectorDetails(directorId);
    }
  },
  methods: {
    async fetchDirectorDetails(directorId) {
      this.isLoading = true;
      try {
        const response = await api.get(`/directors/${directorId}`);
        this.director = response.data;
      } catch (error) {
        this.errorMessage = 'Erro ao carregar os dados do autor.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async saveDirector() {
      this.isLoading = true;
      this.errorMessage = null;

      try {
        if (this.director.id) {
          await api.put(`/directors`, { id: this.director.id, ...this.director });
        } else {
          await api.post(`/directors`, this.director);
        }
        this.$router.push('/admin/directors');
      } catch (error) {
        this.errorMessage = 'Erro ao salvar o autor. Tente novamente mais tarde.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    goBack() {
      this.$router.push('/admin/directors');
    },
  }
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>
