const selectDropdown = document.querySelectorAll('.status-update-form');

selectDropdown.forEach(dropdown => {
    const select = dropdown.querySelector('.status-select');
    const select_list = dropdown.querySelector('.select-list');

    select.addEventListener('click', (event) => {
        selectDropdown.forEach(d => {
        if (d !== dropdown) {
            d.querySelector('.select-list').classList.add('hidden');
        }
        });
        select_list.classList.toggle('hidden');
        event.stopPropagation();
    });
})

document.addEventListener('click', () => {
  selectDropdown.forEach(d => {
    d.querySelector('.select-list').classList.add('hidden');
  });
});

document.addEventListener('scroll', () => {
  selectDropdown.forEach(d => {
    d.querySelector('.select-list').classList.add('hidden');
  });
});