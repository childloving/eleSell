import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';

Vue.use(VueRouter);

let app = Vue.extend(App);
let router = new VueRouter();
router.start(app, '#app');
