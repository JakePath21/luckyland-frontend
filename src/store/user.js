import { reactive } from 'vue';

export const userStore = reactive({
  username: localStorage.getItem('username') || null,
  gold: 0,
  tickets: 0,

  setUsername(name) {
    this.username = name;
    localStorage.setItem('username', name);
  },

  setGold(amount) {
    this.gold = amount;
  },

  setTickets(amount) {
    this.tickets = amount;
  },

  clearUsername() {
    this.username = null;
    this.gold = 0;
    this.tickets = 0;
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }
});
