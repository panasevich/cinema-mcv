
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
        this.request = `${this.searchBy}`;
    }
}

class CinemaController {
    constructor(view, model){
        this.view = view;
        this.model = model;
    }
    fetchData(){
        const { sortBy, searchBy, searchString } = this.model;
        const sortByParam = sortBy ? `sortBy=${sortBy}&` : '';
        const searchByParam = searchBy ? `searchBy=${searchBy}&` : '';
        const searchStringParam = searchString ? `search=${searchString}&` : '';
        const url = sortByParam || searchByParam || searchStringParam ?
            `http://react-cdp-api.herokuapp.com/movies?${sortByParam}${searchByParam}${searchStringParam}` :
            'http://react-cdp-api.herokuapp.com/movies';
        fetch(url)
            .then(response => response.json())
            .then(data => this.view.render({data: data.data, setField: this.setField }))
            .catch(error => error);
    }
    // fetchData();
    setField(fieldName, fieldData) {
        console.log('setField');
        this.model[fieldName] = fieldData;
        this.fetchData();
    }
    init() {
        this.fetchData();
        this.setField =  this.setField.bind(this);
    }
}

class CounterView {
    constructor(element) {
        this.element = element;
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
                    <button class="btn btn-secondary"><a href="/movie/337167">View</a></button>
                </div>
            </div>
        </div>
        `
    }
    render(props) {
        console.log(props);
        this.element.innerHTML = `${this.header()} <div class="scroll-row">${props.data.map(v=>this.movie(v)).join('')}</div>`;
        setTimeout(()=>{
            const searchByBtns = element.getElementsByClassName('search-by-item');
            const sortByBtns = element.getElementsByClassName('sort-by');
            for (let i=0; i <searchByBtns.length; i++) {
                console.log(searchByBtns);
                searchByBtns[i].addEventListener('click', function(){
                    props.setField('searchBy', this.getAttribute("data-value"))
                });
            }
            for (let i=0; i <sortByBtns.length; i++) {
                sortByBtns[i].addEventListener('click', function(){
                    props.setField('sortBy', this.getAttribute("data-value"))
                });
            }
    }, 500);
    document.getElementById('search-button').addEventListener('click', function(){
        props.setField('searchString', document.getElementById('search-field').value)
    });
    }
}

const element = document.getElementById('header');

const view = new CounterView(element, ['increment', 'decrement']);
console.log(view, 'view');
const model = new CinemaModel(0);



// const mockProps = {currentValue: 500, increment: ()=> null, decrement: ()=> null};
// view.render(mockProps);

const controller = new CinemaController(view, model);
controller.init();
// controller.init();
