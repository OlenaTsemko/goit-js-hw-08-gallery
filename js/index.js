import gallery from './gallery-items.js';

/* 1 Создание и рендер разметки по массиву данных и 
предоставленному шаблону. */
const refs = {
  galleryList: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  modalImg: document.querySelector('.js-lightbox img'),
  btnClose: document.querySelector('button[data-action="close-lightbox"]'),
  overlay: document.querySelector('.lightbox__overlay'),
};

// создание списка с помощью insertAdjacentHTML с деструктуризацией
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

/* 2 Реализация делегирования на галерее ul.js-gallery и 
получение url большого изображения. */
refs.galleryList.addEventListener('click', onImgClick);
refs.btnClose.addEventListener('click', closeModal);
refs.overlay.addEventListener('click', closeModal);

function onImgClick(event) {
  event.preventDefault();

  const currentTag = event.target;
  const currentIndex = currentTag.dataset.index;

  if (currentTag.nodeName === 'IMG') {
    currentTag.src = currentTag.dataset.source;

    openModal();
    changeImage(currentTag, currentIndex);
  }
}

/* 3 Открытие модального окна по клику на элементе галереи. */
function openModal() {
  window.addEventListener('keydown', onPressEsc);
  window.addEventListener('keydown', onPressArrowRight);
  window.addEventListener('keydown', onPressArrowLeft);
  refs.modal.classList.add('is-open');
}

/* 4 Подмена значения атрибута src элемента img.lightbox__image. */
function changeImage({ src, alt }, index) {
  refs.modalImg.src = src;
  refs.modalImg.alt = alt;
  refs.modalImg.dataset.index = index;
}

/* 5 Закрытие модального окна по клику на кнопку 
button[data-action="close-lightbox"]. */

/* 6 Очистка значения атрибута src элемента img.lightbox__image. */
function closeModal() {
  window.removeEventListener('keydown', onPressEsc);
  window.removeEventListener('keydown', onPressArrowRight);
  window.removeEventListener('keydown', onPressArrowLeft);
  refs.modal.classList.remove('is-open');
  refs.modalImg.src = '';
  refs.modalImg.alt = '';
}

// Дополнительно
/* 7 Закрытие модального окна по клику на div.lightbox__overlay. */
/* 8 Закрытие модального окна по нажатию клавиши ESC. */
function onPressEsc(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}

/* 9 Пролистывание изображений галереи в открытом модальном окне 
клавишами "влево" и "вправо". */

// для переключения по кнопкам
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

let index;

function setImgIndex() {
  index = +refs.modalImg.dataset.index;
}

function changeImgIndex() {
  refs.modalImg.dataset.index = index;
}

function changeImg() {
  refs.modalImg.src = gallery[index].original;
  refs.modalImg.alt = gallery[index].description;
}

function onPressRight() {
  setImgIndex();
  if (index < gallery.length - 1) {
    index += 1;
    changeImg();
    changeImgIndex();
  }
}

function onPressLeft() {
  setImgIndex();
  if (index !== 0) {
    index -= 1;
    changeImg();
    changeImgIndex();
  }
}

// для переключения по клавишам
function onPressArrowRight(event) {
  if (event.code === 'ArrowRight') {
    onPressRight();
  }
}

function onPressArrowLeft(event) {
  if (event.code === 'ArrowLeft') {
    onPressLeft();
  }
}
