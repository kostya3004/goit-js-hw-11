import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';


const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const input = document.querySelector('[name="searchQuery"]');
const btnSearch = document.querySelector('.search-button');
const KEY = '33041326-cf537b952fe64a39320c0f3d9';

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
let currentPage = 1;

btnSearch.addEventListener('click', onSearch);
const PER_PAGE = 40;

async function fetchImages(value, page) {
    const params = new URLSearchParams({
    q: value,
    key: KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
    page: page,
  });

  const BASE_URL = `https://pixabay.com/api/?${params}`;
  return await axios.get(BASE_URL).then(response => response.data);
}

async function onSearch(e) {
  e.preventDefault();
  currentPage = 1;
  const inputValue = input.value.trim();

  try {
    if (inputValue === '') {
      cleanGallery();
      Notiflix.Notify.warning('Enter your search query');
    } else {
      const imageCount = await fetchImages(inputValue, currentPage);
      cleanGallery();

      if (imageCount.hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        createMarkup(imageCount.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${imageCount.totalHits} images.`
        );
        loadMoreBtn.hidden = false;
        gallerySimpleLightbox.refresh();
      }
    }
  } catch (error) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    console.log(error.message);
  }
}

loadMoreBtn.addEventListener('click', onLoadMoreClick);


async function onLoadMoreClick(e) {
  currentPage++;
    const inputValue = input.value.trim();
  loadMoreBtn.hidden = true;
    
  try {
    const imageCount = await fetchImages(inputValue, currentPage);
    const totalPages = Math.ceil(imageCount.totalHits / PER_PAGE);
    createMarkup(imageCount.hits);
    gallerySimpleLightbox.refresh();
      // Notiflix.Notify.success(`Hooray! We found ${imageCount.totalHits} images.`);
    loadMoreBtn.hidden = false;
    if (currentPage === totalPages) {
      loadMoreBtn.hidden = true;
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
      
  } catch (error) {
    // Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }
}

function createMarkup(images) {
  const markup = images
    .map(image => {
      return `<div class="item-card">
        <a href="${image.largeImageURL}"><img class="item-image" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
        <div class="item-block">
           <p class="item-info">
                <b>Likes</b> ${image.likes}</p>
            <p class="item-info">
                <b>Views</b> ${image.views}</p>
            <p class="item-info">
                <b>Comments</b> ${image.comments}</p>
            <p class="item-info">
                <b>Downloads</b> ${image.downloads}</p>
        </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML("beforeend", markup);
}

function cleanGallery() {
  gallery.innerHTML = '';
    currentPage = 1;
    loadMoreBtn.hidden = true;
}

