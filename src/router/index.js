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
      path: '/jStartView',
      name: 'JStartView',
      component: () => import('../views/JStartView.vue')
    },
    { 
      path: '/jCreateInfo',
      name: 'JCreateInfo',
      component: () => import('../views/JCreateInfo.vue')
    },
    { 
      path: '/EnterNameView/:pollId',
      name: 'EnterNameView',
      component: () => import('../views/EnterNameView.vue')
    },
    { 
      path: '/BoardViewSteph/:pollId',
      name: 'BoardViewSteph',
      component: () => import('../views/BoardViewSteph.vue')
    },
    { 
      path: '/PlayPrototype',
      name: 'PlayPrototype/',
      component: () => import('../views/PlayPrototype.vue') 
    },
    { 
      path: '/jJoinView',
      name: 'JJoinView',
      component: () => import('../views/JJoinView.vue') /* lägg till ID*/
    },
    { 
      path: '/jPollView/:pollId/:participantName',
      name: 'JPollView',
      component: () => import('../views/JPollView.vue')
    },
    { 
      path: '/QuestionView/:pollId/:participantName/:row/:col',
      name: 'QuestionView',
      component: () => import('../views/QuestionView.vue')
    },
    { 
      path: '/HowToHostView/:pollId',
      name: 'HowToHostView',
      component: () => import('../views/HowToHostView.vue')
    },
    { 
      path: '/HostView/:pollId',
      name: 'HostView',
      component: () => import('../views/HostView.vue')
    },
    { 
      path: '/HostWhichPoll',
      name: 'HostWichPoll',
      component: () => import('../views/HostWhichPoll.vue')
    },
    {   
      path: '/AnswerRight/:pollId/:participantName',
      name: 'AnswerRight',
      component: () => import('../views/AnswerRight.vue')
    },
    { 
      path: '/AnswerWrong/:pollId/:participantName',
      name: 'AnswerWrong',
      component: () => import('../views/AnswerWrong.vue')
    },
    { 
      path: '/AnswerNone/:pollId/:participantName',
      name: 'AnswerNone',
      component: () => import('../views/AnswerNone.vue')
    },
    { 
      path: '/EditQuiz',
      name: 'EditQuiz',
      component: () => import('../views/EditQuiz.vue')
    },
    { 
<<<<<<< HEAD
      path: '/DisplayQuestion',
      name: 'DisplayQuestion',
      component: () => import('../views/DisplayQuestion.vue')
=======
      path: '/PlayerTurnView',
      name: 'PlayerTurnView',
      component: () => import('../views/PlayerTurnView.vue')
>>>>>>> c0f4ff0599dc1cb6ff1db7c29771870e75d6e17f
    }
  ]
});

// Exporting the router instance to be used in the main application
export default router;
