import gallery from './gallery-items.js';

// ==============================================================
/* 1 Создание и рендер разметки по массиву данных и 
предоставленному шаблону. */
// ==============================================================
const refs = {
  galleryList: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  modalImg: document.querySelector('.js-lightbox img'),
  btnClose: document.querySelector('button[data-action="close-lightbox"]'),
  overlay: document.querySelector('.lightbox__overlay'),
};

// console.log(refs.galleryList);

// -------------------------------------------------------------
// создание списка через createElement
// -------------------------------------------------------------
// const createGalleryItem = item => {
//   const liEl = document.createElement('li');
//   liEl.classList.add('gallery__item');
//   const aEl = document.createElement('a');
//   aEl.classList.add('gallery__link');
//   aEl.href = item.original;
//   const imgEl = document.createElement('img');
//   imgEl.classList.add('gallery__image');
//   imgEl.src = item.preview;
//   imgEl.dataset.source = item.original;
//   imgEl.alt = item.description;

//   aEl.append(imgEl);
//   liEl.append(aEl);

//   return liEl;
// };

// const galleryItems = gallery.map(item => createGalleryItem(item));

// refs.galleryList.append(...galleryItems);

// -------------------------------------------------------------
// создание списка с помощью insertAdjacentHTML с деструктуризацией
// -------------------------------------------------------------
const galleryItems = gallery
  .map((item, index) => createGalleryItem(item, index))
  .join('');

function createGalleryItem({ original, preview, description }, index) {
  const galleryElement = `
    <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      data-index="${index}"
      alt="${description}"
    />
  </a>
</li>
  `;
  return galleryElement;
}

refs.galleryList.insertAdjacentHTML('beforeend', galleryItems);

// ==============================================================
/* 2 Реализация делегирования на галерее ul.js-gallery и 
получение url большого изображения. */
// ==============================================================
refs.galleryList.addEventListener('click', onImgClick);

function onImgClick(event) {
  event.preventDefault();

  const currentTag = event.target;
  const currentIndex = currentTag.dataset.index;

  if (currentTag.nodeName !== 'IMG') {
    return;
  }

  currentTag.src = currentTag.dataset.source;

  openModal();
  changeImage(currentTag, currentIndex);
  // changeImage(currentTag.src, currentTag.alt, currentTag.dataset.index);
}

// ==============================================================
/* 3 Открытие модального окна по клику на элементе галереи. */
// ==============================================================
function openModal() {
  window.addEventListener('keydown', onPressEsc);
  window.addEventListener('keydown', onPressArrowRight);
  window.addEventListener('keydown', onPressArrowLeft);
  refs.modal.classList.add('is-open');
}

// ==============================================================
/* 4 Подмена значения атрибута src элемента img.lightbox__image. */
// ==============================================================
function changeImage({ src, alt }, index) {
  refs.modalImg.src = src;
  refs.modalImg.alt = alt;
  refs.modalImg.dataset.index = index;
}

// ==============================================================
/* 5 Закрытие модального окна по клику на кнопку 
button[data-action="close-lightbox"]. */

/* 6 Очистка значения атрибута src элемента img.lightbox__image. 
Это необходимо для того, чтобы при следующем открытии модального 
окна, пока грузится изображение, мы не видели предыдущее. */
// ==============================================================
refs.btnClose.addEventListener('click', closeModal);

function closeModal() {
  window.removeEventListener('keydown', onPressEsc);
  window.removeEventListener('keydown', onPressArrowRight);
  window.removeEventListener('keydown', onPressArrowLeft);
  refs.modal.classList.remove('is-open');
  refs.modalImg.src = '';
  refs.modalImg.alt = '';
}

// Дополнительно
// ==============================================================
/* 7 Закрытие модального окна по клику на div.lightbox__overlay. */
// ==============================================================
refs.overlay.addEventListener('click', closeModal);

// ==============================================================
/* 8 Закрытие модального окна по нажатию клавиши ESC. */
// ==============================================================
function onPressEsc(event) {
  //   console.log(event.code);
  if (event.code === 'Escape') {
    closeModal();
  }
}

// ==============================================================
/* 9 Пролистывание изображений галереи в открытом модальном окне 
клавишами "влево" и "вправо". */
// ==============================================================
/* - добавить data-index для каждого img
 * - когда открыто модал. окно поставить addEventListener на
 * клавиши право и лево
 * - когда модал. закрыто убрать addEventListener
 * - создать функции для событий клавиши право и лево
 */

// -------------------------------------------------------------
// для переключения по кнопкам
// -------------------------------------------------------------
let index = 0;

const btnRightLeft = `
<button
        type="button"
        class="btn btn-left"
      ></button>
<button
        type="button"
        class="btn btn-right"
      ></button>
`;

const content = document.querySelector('.lightbox__content');
content.insertAdjacentHTML('beforeend', btnRightLeft);

const btnRight = document.querySelector('.btn-right');
const btnLeft = document.querySelector('.btn-left');

btnRight.addEventListener('click', onPressRight);
btnLeft.addEventListener('click', onPressLeft);

function onPressRight() {
  if (index >= gallery.length - 1) {
    return;
  }
  index = +refs.modalImg.dataset.index + 1;
  refs.modalImg.src = gallery[index].original;
  changeImg();
}

function onPressLeft() {
  if (index === 0) {
    return;
  }
  index = +refs.modalImg.dataset.index - 1;
  refs.modalImg.src = gallery[index].original;
  changeImg();
}

// -------------------------------------------------------------
// для переключения по клавишам
// -------------------------------------------------------------

function onPressArrowRight(event) {
  if (event.code === 'ArrowRight') {
    onPressRight();
  }
  changeImg();
}

function onPressArrowLeft(event) {
  if (event.code === 'ArrowLeft') {
    onPressLeft();
  }
  changeImg();
}

function changeImg() {
  refs.modalImg.dataset.index = index;
}
