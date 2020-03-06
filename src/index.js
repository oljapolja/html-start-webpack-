require('./img/' + /\.(gif|png|jpe?g|svg)$/i); // takes all images from 'img' and deep directory (for minimize)

import * as $ from 'jquery';

import Post from '@/js/Post'
import '@/js/babelTest'

import "@/sass/main.sass"
import photo from '@/img/1/1.JPG'

const post = new Post('new title of Post', photo);

console.log(post.toString());
console.log(post.titleUpperCase);


$('.test-block').html('test-block');
