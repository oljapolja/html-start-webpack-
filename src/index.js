import * as $ from 'jquery';

import Post from '@/js/Post'
import '@/js/babelTest'

import "@/sass/main.sass"
import photo from '@/img/rose.JPG'

const post = new Post('new title of Post', photo);

console.log(post.toString());
console.log(post.titleUpperCase);


$('.test-block').html('test-block');
