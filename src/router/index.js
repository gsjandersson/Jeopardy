// Importing necessary functions from Vue Router
import { createRouter, createWebHistory } from 'vue-router';

// Importing Vue component views
import JStartView from '../views/JStartView.vue';

// Creating a Vue Router instance
const router = createRouter({
  // Using web history mode and setting base URL
  history: createWebHistory(import.meta.env.BASE_URL),

  // Defining routes for the application
  routes: [
    {
      path: '/',
      name: 'JStartView',
      component: JStartView
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
      path: '/AnswerRight/:pollId/:participantName/:row',
      name: 'AnswerRight',
      component: () => import('../views/AnswerRight.vue')
    },
    { 
      path: '/AnswerWrong/:pollId/:participantName/:row',
      name: 'AnswerWrong',
      component: () => import('../views/AnswerWrong.vue')
    },
    { 
      path: '/AnswerNone/:pollId/:participantName/:row',
      name: 'AnswerNone',
      component: () => import('../views/AnswerNone.vue')
    },
    { 
      path: '/EditQuiz',
      name: 'EditQuiz',
      component: () => import('../views/EditQuiz.vue')
    },
    { 
      path: '/PlayerTurnView/:pollId',
      name: 'PlayerTurnView',
      component: () => import('../views/PlayerTurnView.vue')
    },
    { 
      path: '/DisplayQuestion/:pollId/:row/:col',
      name: 'DisplayQuestion',
      component: () => import('../views/DisplayQuestion.vue')
    },
    { 
      path: '/QuestionResultView/:pollId/:row/:col',
      name: 'QuestionResultView',
      component: () => import('../views/QuestionResultView.vue')
    },
    { 
      path: '/WaitingRoom/:pollId/:participantName',
      name: 'WaitingRoom',
      component: () => import('../views/WaitingRoom.vue')
    }
  ]
});

// Exporting the router instance to be used in the main application
export default router;
