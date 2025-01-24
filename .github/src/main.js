import { fetchImages, resetPage, getCurrentPage } from './js/pixabay-api.js';
import {
  clearGallery,
  showImages,
  showErrorMessage,
  showLoadingIndicator,
  hideLoadingIndicator,
  toggleLoadMoreButton,
  showEndOfResultsMessage,
} from './js/render-functions.js';

toggleLoadMoreButton(false);

let query = '';

document
  .querySelector('.search-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
    query = document.querySelector('.search-input').value.trim();

    if (!query) {
      return;
    }

    resetPage();
    clearGallery();
    showLoadingIndicator();

    try {
      const data = await fetchImages(query, 1);
      hideLoadingIndicator();
      showImages(data.hits);
      toggleLoadMoreButton(data.totalHits > data.hits.length);
    } catch (error) {
      hideLoadingIndicator();
      showErrorMessage();
      console.error(error);
    }
  });

document
  .querySelector('.load-more')
  .addEventListener('click', async function () {
    const nextPage = getCurrentPage() + 1;

    showLoadingIndicator();
    try {
      const data = await fetchImages(query, nextPage);
      hideLoadingIndicator();
      showImages(data.hits);

      const totalLoaded = nextPage * 15;
      if (totalLoaded >= data.totalHits) {
        toggleLoadMoreButton(false);
        showEndOfResultsMessage();
      } else {
        toggleLoadMoreButton(true);
      }

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    } catch (error) {
      hideLoadingIndicator();
      showErrorMessage();
      console.error(error);
    }
  });
