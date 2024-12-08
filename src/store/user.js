import { reactive } from 'vue';

export const userStore = reactive({
  id: localStorage.getItem('userId') || null,
  username: localStorage.getItem('username') || null,
  gold: 0,
  tickets: 0,

  setUser(id, name) {
    this.id = id;
    this.username = name;
    localStorage.setItem('username', name);
    localStorage.setItem('userId', id);
  },

  setGold(amount) {
    this.gold = amount;
  },

  setTickets(amount) {
    this.tickets = amount;
  },

  clearUser() {
    this.id = null;
    this.username = null;
    this.gold = 0;
    this.tickets = 0;
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  }
});
