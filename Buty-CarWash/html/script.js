'use strict';

const app = document.getElementById('app');
const buyServiceButton = document.getElementById('buy-service');

function setDisplay(visible) {
    const shouldShow = visible === true;

    app.classList.toggle('is-visible', shouldShow);
    app.setAttribute('aria-hidden', String(!shouldShow));
}

function closeUi() {
    setDisplay(false);

    $.post(
        `https://${GetParentResourceName()}/exit`,
        JSON.stringify({})
    );
}

function select() {
    const activePackage = document.querySelector('.package.active');

    if (!activePackage) return;

    const packageValue = activePackage.getAttribute('data-value');

    $.post(
        `https://${GetParentResourceName()}/wash`,
        JSON.stringify({
            type: packageValue
        })
    );

    closeUi();
}

window.addEventListener('message', function (event) {
    const data = event.data || {};

    if (data.type === 'ui') {
        setDisplay(data.status);
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Escape' && app.classList.contains('is-visible')) {
        closeUi();
    }
});

buyServiceButton.addEventListener('click', select);

buyServiceButton.addEventListener('keyup', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select();
    }
});

const slider = document.querySelector('.slider-inner');
const description = document.querySelector('.description');
const percentage = document.querySelector('.percentage');
const packages = document.querySelectorAll('.package');

let selectedIndex = 0;
const leftValue = 210;

packages.forEach((item, index) => {
    if (item.classList.contains('active')) {
        selectedIndex = index;
    }
});

function changeDescription() {
    const currentPackage = packages[selectedIndex];

    if (!currentPackage) return;

    const packageDescription = currentPackage.querySelector('.package-description');
    const packagePercentage = currentPackage.querySelector('.package-percentage');

    description.innerHTML = packageDescription ? packageDescription.innerHTML : '';
    percentage.innerHTML = packagePercentage ? packagePercentage.innerHTML : '';
}

function setActivePackage(index) {
    packages[selectedIndex].classList.remove('active');

    selectedIndex = index;

    packages[selectedIndex].classList.add('active');

    changeDescription();
}

function updateSliderPosition(direction) {
    if (direction === 'left') {
        if (selectedIndex === 0) {
            slider.style.left = `-${(packages.length - 2) * leftValue}px`;
            setActivePackage(packages.length - 1);
            return;
        }

        if (selectedIndex === 1) {
            slider.style.left = `${leftValue}px`;
            setActivePackage(selectedIndex - 1);
            return;
        }

        slider.style.left = `-${(selectedIndex - 2) * leftValue}px`;
        setActivePackage(selectedIndex - 1);
        return;
    }

    if (direction === 'right') {
        if (selectedIndex === packages.length - 1) {
            slider.style.left = `${leftValue}px`;
            setActivePackage(0);
            return;
        }

        slider.style.left = `-${selectedIndex * leftValue}px`;
        setActivePackage(selectedIndex + 1);
    }
}

function onLeftClick() {
    updateSliderPosition('left');
}

function onRightClick() {
    updateSliderPosition('right');
}

changeDescription();