<template>
  <div class="bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full sm:w-3/4 lg:w-1/2">
      <h2 class="text-3xl font-bold text-center mb-6 text-primary"> 
        {{ movie && movie.id ? 'Editar Filme' : 'Adicionar Filme' }}
      </h2>

      <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="saveMovie" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="title">Título</label>
          <input 
            v-model="movie.title" 
            type="text" 
            id="title" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required 
            placeholder="Digite o título do filme"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="director">Diretor</label>
          <select 
            v-model="movie.directorId" 
            id="director" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required
          >
            <option disabled value="">Selecione um diretor</option>
            <option v-for="director in directors" :key="director.id" :value="director.id">
              {{ director.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="releaseYear">Ano de Lançamento</label>
          <input 
            v-model="movie.releaseYear" 
            type="number" 
            id="releaseYear" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required 
            placeholder="Digite o ano de lançamento"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="genre">Gênero</label>
          <input 
            v-model="movie.genre" 
            type="text" 
            id="genre" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required 
            placeholder="Digite o gênero do filme"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="durationMinutes">Duração (minutos)</label>
          <input 
            v-model="movie.durationMinutes" 
            type="number" 
            id="durationMinutes" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required 
            placeholder="Digite a duração do filme"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold" for="image">Imagem do Filme</label>

          <div v-if="imageUrl" class="my-4">
            <img :src="imageUrl" alt="Imagem do filme" class="w-full h-auto rounded-md border border-gray-300" />
          </div>
          <div v-else-if="movie.image" class="my-4">
            <img :src="movie.image" alt="Imagem do filme" class="w-full h-auto rounded-md border border-gray-300" />
          </div>

          <input 
            type="file" 
            @change="handleImageUpload" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200"
            accept="image/*"
          />
          <p v-if="imageUrl" class="text-sm text-gray-600 mt-2">Imagem carregada com sucesso!</p>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button @click="goBack" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition duration-200">
            Cancelar
          </button>
          <button 
            type="submit" 
            class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary-dark transition duration-200" 
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'EditMovie',
  data() {
    return {
      movie: {
        title: '',
        directorId: '',
        releaseYear: '',
        genre: '',
        durationMinutes: '',
        image: ''
      },
      directors: [],
      imageUrl: null,
      errorMessage: null,
    };
  },
  created() {
    this.fetchMovieDetails();
    this.fetchDirectors();
  },
  methods: {
    async fetchMovieDetails() {
      const movieId = this.$route.params.id;
      if (movieId) {
        try {
          const response = await api.get(`/movies/${movieId}`);
          this.movie = response.data?._embedded?.movieDto || [];
          this.movie.directorId = this.movie.director.id;
        } catch (error) {
          this.errorMessage = 'Erro ao buscar detalhes do filme.';
        }
      } else {
        this.resetMovie();
      }
    },

    resetMovie() {
      this.movie = {
        title: '',
        directorId: null,
        releaseYear: null,
        genre: '',
        durationMinutes: null,
        image: null,
      };
    },

    async fetchDirectors() {
      try {
        const response = await api.get('/directors');
        this.directors = response.data.content;
      } catch (error) {
        this.errorMessage = 'Erro ao buscar diretores.';
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageUrl = reader.result;
        this.movie.image = this.imageUrl;
      };
      reader.readAsDataURL(file);
    },

    async saveMovie() {
      const movieData = {
        title: this.movie.title,
        director: {id: this.movie.directorId},
        releaseYear: this.movie.releaseYear,
        genre: this.movie.genre,
        durationMinutes: this.movie.durationMinutes,
        image: this.movie.image
      };

      try {
        if (this.movie.id) {
          await api.put(`/movies`, {id: this.movie.id, ...movieData});
        } else {
          await api.post('/movies', movieData);
        }

        this.$router.push('/');
      } catch (error) {
        this.errorMessage = 'Erro ao salvar filme.';
      }
    },

    goBack() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.bg-primary {
  background-color: red;
}
.bg-primary-dark {
  background-color: darkred;
}
.text-primary {
  color: red;
}
.text-primary-light {
  color: lightcoral;
}
</style>
