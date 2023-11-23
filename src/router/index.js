// Importing necessary functions from Vue Router
import { createRouter, createWebHistory } from 'vue-router';

// Importing Vue component views
import StartView from '../views/StartView.vue';

// Creating a Vue Router instance
const router = createRouter({
  // Using web history mode and setting base URL
  history: createWebHistory(import.meta.env.BASE_URL),

  // Defining routes for the application
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView // Default route displaying the StartView component
    },
    {
      path: '/poll/:id',
      name: 'PollView',
      component: () => import('../views/PollView.vue') // Route for displaying a poll, dynamically loading the PollView component
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue') // Route for creating a new poll, dynamically loading the CreateView component
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue') // Route for viewing poll results, dynamically loading the ResultView component
    },
    {
      path: '/test',
      name: 'TestView',
      component: () => import('../views/TestView.vue')
    }
  ]
});

// Exporting the router instance to be used in the main application
export default router;
