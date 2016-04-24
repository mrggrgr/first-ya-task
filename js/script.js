// шаблоны html-разметки для заполнения данными и вставки на страницу
var channelStart = '<div class="grid-item"><div class="channel"><div class="info"></div></div></div>';
var channelImage = '<div class="logo"><img src="%data%-1x.png" srcset="%data%-2x.png 2x" alt=""></div>';
var channelTitle = '<div class="title"><a href="#" class="link">%data%</a></div>';

var programmsStart = '<div class="programms"><div class="items"></div></div>';
var programmItem = '<div class="telecast"><div class="telecast-inner show"></div></div>';
var programmTime = '<span class="time">%data%</span>';
var programmName = '<span class="name">%data%</span>';

var programmDescriptionTitle = '<div class="pop-up"><div class="pop-up-inside"><span class="title">%data%</span>';
var programmCategory = '<span class="category">%data%</span>';
var programmDescription = '<p class="description">%data%</p></div></div>';

// главный блок на странице с телепрограммой
var programmsPage = document.getElementById('tv-programm');

// функция очистки страницы
function clearProgrammsPage() {
    programmsPage.innerHTML = '';
    return false;
}

// конструктор телепрограмм
function TVProgramm() {
    this.channels;
}

// метод показа телепрограммы
TVProgramm.prototype.display = function () {
    // цикл для показа телеканалов
    for (var channel in this.channels) {
        document.getElementById("tv-programm").insertAdjacentHTML("beforeend", channelStart);
        var channelInfo = channelImage.replace(/%data%/g, this.channels[channel].image) + channelTitle.replace("%data%", this.channels[channel].title);
        document.getElementsByClassName("info")[document.getElementsByClassName("info").length - 1].insertAdjacentHTML("beforeend", channelInfo);

        if (this.channels[channel].programms.length > 0) {
            document.getElementsByClassName("channel")[document.getElementsByClassName("channel").length - 1].insertAdjacentHTML("beforeend", programmsStart);
            // цикл для показа программ телеканала
            for (var i = 0; i < this.channels[channel].programms.length; i++) {
                var programm = this.channels[channel].programms[i];
                // соединить имя, категорию и описание программы для всплыв.окна
                var programmPopup = programmDescriptionTitle.replace("%data%", programm.title) + programmCategory.replace("%data%", programm.category) + programmDescription.replace("%data%", programm.description);
                document.getElementsByClassName("items")[document.getElementsByClassName("items").length - 1].insertAdjacentHTML("beforeend", programmItem);
                var telecastInner = programmTime.replace("%data%", programm.time) + programmName.replace("%data%", programm.title) + programmPopup;
                document.getElementsByClassName("telecast-inner")[document.getElementsByClassName("telecast-inner").length - 1].insertAdjacentHTML("beforeend", telecastInner);
            }
            activateTelecasts();
        }
    }
};



// найти ссылки дней недели на страницы
var dayLinks = document.getElementsByClassName("day-link");
for (var i = 0; i < dayLinks.length; i++) {
    // обработчик кликов по дням недели
    dayLinks[i].onclick = function () {
        if (this.classList.contains("active")) {
            return false;
        } else {
            document.getElementsByClassName("active")[0].classList.remove("active");
            this.classList.add("active");
            clearProgrammsPage();
            eval(this.id + "TVProgramm").display();
            filterTelecastByCategory();
            return false;
        }

    };
}

// активировать текущие телепередачи для показа доп.информации
function activateTelecasts() {
    var telecasts = document.getElementsByClassName("telecast-inner");
    for (var i = 0; i < telecasts.length; i++) {
        var hoverTimeout;
        // при наведении курсора
        telecasts[i].onmouseenter = function () {
            var self = this;

            if (hoverTimeout)
                clearTimeout(hoverTimeout);

            // показать доп.информацию о телепередаче через 400 мс
            hoverTimeout = setTimeout(function () {
                if (self.classList.contains("active")) {
                    return false;
                } else {
                    self.classList.add("active");
                    self.getElementsByClassName("pop-up")[0].style.display = "block";
                    return false;
                }
            }, 400);
        };
        // при уходе курсора
        telecasts[i].onmouseleave = function () {
            var self = this;

            if (hoverTimeout)
                clearTimeout(hoverTimeout);

            // скрыть доп.информацию о телепередаче через 400 мс
            setTimeout(function () {
                self.classList.remove("active");
                self.getElementsByClassName("pop-up")[0].style.display = "none";
                return false;
            }, 400);
        };
    }
}

// отфильтровать телепередачи по категории
function filterTelecastByCategory(e) {
    if (e)
        e.classList.toggle("selected");

    var checkboxButtons = document.getElementsByClassName("button");
    var selected = [];
    for (var n = 0; n < checkboxButtons.length; n++) {
        if (checkboxButtons[n].checked == true) {
            selected.push(checkboxButtons[n].value);
        }
    }

    for (var telecastsCategories = document.getElementsByClassName("category"), k = 0; k < telecastsCategories.length; k++) {
        if (selected.length > 0) {
            telecastsCategories[k].parentNode.parentNode.parentNode.classList.remove("show");
            for (var s = 0; s < selected.length; s++) {
                if (telecastsCategories[k].innerHTML == selected[s])
                    telecastsCategories[k].parentNode.parentNode.parentNode.classList.add("show");
            }
        } else {
            telecastsCategories[k].parentNode.parentNode.parentNode.classList.add("show");
        }
    }
}