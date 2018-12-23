
const SEARCH_BY = {
    genre: 'genre',
    title: 'title',
};

const SORT_BY = {
    date: 'date',
    title: 'title',
};

class CinemaModel {
    constructor(init){
        this.movies = init.movies;
        this.searchString = init.searchString;
        this.searchBy = '';
        this.sortBy= '';
        this.request = this.searchBy;
        this.pageId = null;
    }
}

class CinemaController {
    constructor(view, model){
        this.view = view;
        this.model = model;
    }
    fetchData(){
        const { sortBy, searchBy, searchString, pageId } = this.model;
        const sortByParam = sortBy ? `sortBy=${sortBy}&` : '';
        const searchByParam = searchBy ? `searchBy=${searchBy}&` : '';
        const searchStringParam = searchString ? `search=${searchString}&` : '';
        const url = sortByParam || searchByParam || searchStringParam ?
            `http://react-cdp-api.herokuapp.com/movies?${sortByParam}${searchByParam}${searchStringParam}` :
            'http://react-cdp-api.herokuapp.com/movies';
        console.log(pageId, 'hash');
        if(pageId){
            let genre = '';
            fetch(`http://react-cdp-api.herokuapp.com/movies/${pageId}`)
                .then(response => response.json())
                .then(data => {
                    genre = data.genres[0];
                 return this.view.renderMovie(data);})
                .catch(error => error);
            // fetch(`http://react-cdp-api.herokuapp.com/movies?sortBy=date`)
            //     .then(response => response.json())
            //     .then(data => this.view.renderContent({data: data.data}));
            return;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => this.view.render({data: data.data, setField: this.setField, setPageId: this.setPageId }))
            .catch(error => error);
    }
    // fetchData();
    setPageId(data){
        console.log('asdasd', data);
        this.model.pageId = data;
        this.fetchData();
    }
    setField(fieldName, fieldData) {
        this.model[fieldName] = fieldData;
        this.fetchData();
    }
    init() {
        this.fetchData();
        this.setField =  this.setField.bind(this);
        this.setPageId =  this.setPageId.bind(this);
    }
}

class MoviesView {
    constructor(header, content) {
        this.headerBlock = header;
        this.contentBlock = content;
    }

    header(props){
        return `
        <div class="search-holder">
            <div class="search">
                <div class="logo">netflixroulette</div>
            </div>
            <div class="search-field">
                <input type="text" id="search-field">
                <button type="button" id="search-button">Search</button>
            </div>
            <div class="search-by">
                <div class="search-by-title">SearchBy</div>
                <button class="search-by-item active" data-value="title">Title</button>
                <button class="search-by-item" data-value="genres">Genres</button>
            </div>
        </div>
        <div class="search-footer">
            <div class="search-count">3 movies found</div>
            <div class="search-by alternate">
                <div class="search-by-title">Sort by</div>
                <div class="sort-by" data-value="date">Date</div>
                <div class="sort-by  active" data-value="rating">Rating</div>
            </div>
        </div>
    `;
    }
    movie(props) {
        return `
        <div class="col-sm-4" style="margin: 15px 0;">
            <div class="card">
                <img src=${props.poster_path} alt="Card image cap" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${props.title}</h5>
                    <h6 class="card-subtitle">${props.release_date}</h6>
                    ${props.genres.map(v => `<div>${v}</div>` ).join('')}
                    <button class="btn btn-secondary" data-id="${props.id}"><a href="#${props.id}">View</a></button>
                </div>
            </div>
        </div>
        `
    }
    renderMovie(props){
        console.log(props);
        this.headerBlock.innerHTML = `<div class="search-holder"><div class="movie-wrap clearfix">
                <img src="${props.poster_path}" class="movie-img" alt="">
                <div class="movie-data">
                    <h1 class="movie-title">${props.title}</h1>                    
                    <h5>${props.tagline}</h5>
                    <h6>${props.release_date}</h6>
                    <div>${props.overview}</div>
                </div>
            </div></div>`
    }
    renderContent(props) {
        console.log(props, 'renderContent');
        this.contentBlock.innerHTML = `<div class="scroll-row">${props.data.map(v=>this.movie(v)).join('')}</div>`
    }
    render(props) {
        console.log(props, 'props');
        this.headerBlock.innerHTML = this.header();
        this.contentBlock.innerHTML = `<div class="scroll-row">${props.data.map(v=>this.movie(v)).join('')}</div>`;
        setTimeout(()=>{
            const searchByBtns = this.headerBlock.getElementsByClassName('search-by-item');
            const sortByBtns = this.headerBlock.getElementsByClassName('sort-by');
            const movieBtn = this.contentBlock.querySelectorAll('.card-body > .btn');
            console.log(movieBtn, 'movireBTN');
            for (let i=0; i <searchByBtns.length; i++) {
                searchByBtns[i].addEventListener('click', function(){
                    props.setField('searchBy', this.getAttribute("data-value"))
                });
            }
            for (let i=0; i <sortByBtns.length; i++) {
                sortByBtns[i].addEventListener('click', function(){
                    props.setField('sortBy', this.getAttribute("data-value"))
                });
            }
            for (let i=0; i <movieBtn.length; i++) {
                movieBtn[i].addEventListener('click', function(){
                    console.log(this.getAttribute("data-id"));
                    window.scrollTo(0, 0);
                    props.setPageId(this.getAttribute("data-id"))
                });
            }
    }, 500);
    document.getElementById('search-button').addEventListener('click', function(){
        props.setField('searchString', document.getElementById('search-field').value)
    });
    }
}

const header = document.getElementById('header');
const content = document.getElementById('content');

const view = new MoviesView(header, content);

const model = new CinemaModel(0);

const controller = new CinemaController(view, model);
controller.init();

