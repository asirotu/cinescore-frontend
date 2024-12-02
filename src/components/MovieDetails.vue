<template>
  <div class="bg-gray-900 min-h-screen flex flex-col">
    <header class="flex justify-between items-center pr-6">
      <img
        @click.stop="$router.push('/')"
        class="w-36 object-contain"
        src="../assets/cinescore.jpeg"
        alt="Logo"
      />
      <div class="flex space-x-8">
        <button @click.stop="$router.push(`/movies`)" class="text-white font-semibold">
            Filmes
          </button>
        <button @click.stop="$router.push('/directors')" class="text-white text-lg font-semibold hover:text-gray-400 transition-colors">
          Diretores
        </button>
        <button @click.stop="$router.push('/users')" class="text-white text-lg font-semibold hover:text-gray-400 transition-colors">
          Conta
        </button>
      </div>
    </header>

    <div v-if="movie" class="flex-1 bg-gray-900 text-white p-8 flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
      
      <img 
        :src="movie.image" 
        alt="Capa do Filme" 
        class="w-96 object-cover rounded-lg shadow-xl transform transition-transform hover:scale-110"
      />

      <div class="flex-1 text-center md:text-left">
        <div class="flex justify-between">
          <h2 class="text-5xl font-extrabold mb-4">{{ movie.title }}</h2>
          <div class="flex">
            <span v-for="star in [1, 2, 3, 4, 5]" :key="star" :class="star <= movie.rating ? 'text-yellow-500' : 'text-gray-400'" class="text-xl">
              ★
            </span>
          </div>
        </div>
        <p class="text-lg text-gray-300 mb-4"><span class="font-semibold text-gray-100">{{ movie.director.name }}</span></p>

        <p class="text-md text-gray-500 mb-2"><strong>Gênero:</strong> {{ movie.genre }}</p>
        <p class="text-md text-gray-500 mb-2"><strong>Ano:</strong> {{ movie.releaseYear }}</p>

        <p class="text-md text-gray-500 mb-2"><strong>Duração:</strong> {{ movie.durationMinutes }} minutos</p>
      </div>
    </div>

    <div class="bg-gray-800 p-8 mb-8">
      <h3 class="text-3xl font-semibold text-white mb-4">{{ editingComment ? 'Editar Comentário' : 'Adicionar Comentário' }}</h3>
      <div class="flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <span class="text-white font-semibold">Avaliação:</span>
          <div class="flex space-x-2">
            <button 
              v-for="star in [1, 2, 3, 4, 5]" 
              :key="star" 
              @click="newComment.rating = star" 
              :class="star <= newComment.rating ? 'text-yellow-500' : 'text-gray-400'" 
              class="text-xl">
              ★
            </button>
          </div>
        </div>

        <textarea 
          v-model="newComment.text" 
          placeholder="Escreva seu comentário..." 
          class="resize-none p-4 w-100 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"></textarea>

        <div class="flex justify-end">
          <button @click="submitComment" class="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-opacity-80 transition duration-200">
            {{ editingComment ? 'Editar Comentário' : 'Enviar Comentário' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="comments.length > 0" class="bg-gray-800 p-8">
      <h3 class="text-3xl font-semibold text-white mb-4">Comentários</h3>
      <div v-for="(comment, index) in comments" :key="index" class="mb-8 border-b border-gray-700 pb-6">
        <div class="flex items-center mb-2">
          <span class="font-bold text-white">{{ comment.user.username }}</span>
          <div class="flex ml-2">
            <span v-for="star in [1, 2, 3, 4, 5]" :key="star" :class="star <= comment.rating ? 'text-yellow-500' : 'text-gray-400'" class="text-xl">
              ★
            </span>
          </div>
        </div>
        <p class="text-gray-400">{{ comment.comment }}</p>
      </div>
    </div>
  </div>
  <modal
        :isOpen="isModalOpen"
        :title="'Comentário enviado com sucesso'"
        :message="'Seu comentário foi enviado com sucesso!, você pode ver seu comentário no seu perfil.'"
        @close="isModalOpen = false"
      />
</template>

<script>
import api from '../api';
import Modal from './ModalConfirm.vue';

export default {
  name: 'MovieDetails',
  components: {
    Modal
  },
  data() {
    return {
      movie: null,
      comments: [],
      newComment: {
        text: '',
        rating: 0,
      },
      editingComment: null,
      userId: localStorage.getItem('userId'),
      isModalOpen: false,
    };
  },
  created() {
    this.fetchMovieDetails();
    this.fetchComments();
  },
  methods: {
    async fetchMovieDetails() {
      const movieId = this.$route.params.id;
      try {
        const response = await api.get(`/movies/${movieId}`);
        this.movie = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchComments() {
      const movieId = this.$route.params.id;
      try {
        const response = await api.get(`/reviews/find/movie/${movieId}`);
        this.comments = response.data.content;

        const userComment = this.comments.find(comment => comment.user.id == this.userId);
        if (userComment) {
          this.newComment.text = userComment.comment;
          this.newComment.rating = userComment.rating;
          this.editingComment = userComment; 
        } else {
          this.editingComment = null; 
        }
      } catch (error) {
        console.error(error);
      }
    },
    async submitComment() {
      const commentData = {
        comment: this.newComment.text,
        rating: this.newComment.rating,
        movie: {id: this.movie.id},
        user: {id: this.userId},
      };

      try {
        if (this.editingComment) {
          await api.put(`/reviews`, {id: this.editingComment.id, ...commentData});
          this.fetchMovieDetails();
          this.isModalOpen = true
        } else {
          await api.post(`/reviews`, commentData);
          this.fetchMovieDetails();
        }

        this.newComment.text = '';
        this.newComment.rating = 0;
        this.editingComment = null; 
        this.fetchComments();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
}

.text-primary {
  color: #e50914;
}

header {
  background: linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,1));
}

button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  transform: scale(1.05);
}

h2 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

textarea {
  resize: none;
  min-height: 120px;
  max-width: 500px;
}

.comment-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment {
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;
}

button:hover {
  cursor: pointer;
}

textarea {
  min-height: 120px;
}
</style>
