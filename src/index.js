import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';


////////AXIOS
const BASE_URL = 'https://pixabay.com/api';
const KEY = '33041326-cf537b952fe64a39320c0f3d9';

export function axiosGet(param) {
  return axios.get(
    `${BASE_URL}/?key=${KEY}&q=${param.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${param.page}&per_page=${param.countImgoOnPage}`
  );
}
////////AXIOS