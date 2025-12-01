import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
const PER_PAGE = 15;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  searchQuery = query;
  page = 1;

  clearGallery();
  hideLoadMoreButton();

  await fetchImages();
}

async function onLoadMore() {
  page += 1;
  await fetchImages(true);
}

async function fetchImages(isLoadMore = false) {
  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, page);
    const { hits, totalHits } = data;

    if (!hits || hits.length === 0) {
      if (page === 1) {
        iziToast.info({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      }

      hideLoadMoreButton();
      return;
    }

    createGallery(hits);

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "You've reached the end of search results.",
        position: 'topRight',
      });
    }

    if (isLoadMore) {
      smoothScrollAfterLoad();
    }
  } catch (error) {
    iziToast.error({
      message: 'An error occurred during the request. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function smoothScrollAfterLoad() {
  const firstCard = document.querySelector('.gallery-item');

  if (!firstCard) return;

  const cardHeight = firstCard.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
