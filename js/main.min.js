window.addEventListener('load', function(){
    function scrollPolyfill(func) {
        const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
        return function(obj) {
            if(supportsNativeSmoothScroll) {
                func.call(this, {top: obj.top, behavior: obj.behavior})
            } else {
                func.call(this, 0, obj.top);
            }
        }
    }
    this.window.scrollTo = scrollPolyfill(this.window.scrollTo);

    /**
     * Scroll
     */
    // variables
    const btnUp = document.querySelector('.scrollUp');
    const btnDown = document.querySelector('.intro__main-mousebutton');
    const menuBtn = document.querySelector('.intro__burger');
    const nav = document.querySelector('.intro__navigation');
    const servicesBtn = document.querySelector('.services__descr-button');
    // work
    btnUp.addEventListener('click', onButtonScroll);
    btnDown.addEventListener('click', onButtonScroll);
    nav.addEventListener('click', onLinkScroll);
    servicesBtn.addEventListener('click', onLinkScroll);
    menuBtn.addEventListener('click', function(){
        this.classList.toggle('active-burger');
    });
    // functions
    window.addEventListener('scroll', function(){
		let pos = window.pageYOffset;
		
		if(pos > window.innerHeight){
			btnUp.classList.add('scrollUp-visible');
		}
		else{
			btnUp.classList.remove('scrollUp-visible');
		}
    });

    function onButtonScroll() {
        let pos;

        if (this.dataset.scrollbutton === 'down') {
            pos = document.querySelector('#intro').offsetHeight;
        } else {
            pos = 0;
        }

        window.scrollTo({top: pos, behavior: 'smooth'});
    }

    function onLinkScroll(e) {
        const loc = e.target.hash;
        const pos = document.querySelector(loc);
        e.preventDefault();

        if(loc && pos) {
            window.scrollTo({top: pos.offsetTop, behavior: 'smooth'});
            menuBtn.classList.remove('active-burger');
        }
    }

    /**
     * Forms
     */
    // variables
    const patterns = {text: /.+/, phone: /^\d{7,14}$/, email: /^.+@.+\..+$/};
	const introForm = document.querySelector('#intro-form');
	const consultForm = document.querySelector('#consultation-form');
	const modalForm = document.querySelector('#modal-form');
	const modal = document.querySelector('.modal');
	const modalOpenButton = document.querySelector('.count__result-button');
    // work 
    introForm.addEventListener('submit', onFormSubmit);
    introForm.addEventListener('focusin', onFormFocus);
    consultForm.addEventListener('submit', onFormSubmit);
    consultForm.addEventListener('focusin', onFormFocus);
    modalForm.addEventListener('submit', onFormSubmit);
    modalForm.addEventListener('focusin', onFormFocus);

    modalOpenButton.addEventListener('click', function() {
        modal.classList.add('active-modal');
    });

    modal.addEventListener('click', function(e){
        if(e.target.classList.contains('modal-to-close')) {
            this.classList.remove('active-modal');
        }
    });
    // functions
    function onFormSubmit(e){
        let err = false;

        const inputs = this.querySelectorAll('[data-valid]');

        for(let i = 0; i < inputs.length; i++) {
            const el = inputs[i];
            
            if(!patterns[el.dataset.valid].test(el.value.trim())) {
                el.classList.add('form-error');
				err = true;
            }
        }

        if(err) {
            e.preventDefault();
        }
    }

    function onFormFocus(e){
		if(e.target.dataset.valid){
			e.target.classList.remove('form-error');
		}
	}

    /**
     * Count
     */
    // variables
    const countRadios = document.querySelector('.count__options-radios');
    const countPackages = document.querySelector('.count__package-wrap');
    const square = document.querySelector('.js-result-square');
    const price = document.querySelector('.js-result-price');
    const total = document.querySelector('.js-result-total');
    let squareValue = document.querySelector('input[name=square]:checked').value;
    let priceValue = document.querySelector('input[name=package]:checked').value;
    // work
    countRadios.addEventListener('click', onCountChange);
    countPackages.addEventListener('click', onCountChange);
    // function
    function onCountChange(e) {
        if(e.target.value) {
            switch(e.target.name) {
                case 'square':
                    squareValue = parseInt(e.target.value);
                    square.textContent = squareValue.toLocaleString();
                    break;
                case 'package':
                    priceValue = parseInt(e.target.value);
                    price.textContent = priceValue.toLocaleString();
                    break;
            }
            const totalValue = parseInt(squareValue) * parseInt(priceValue);
            total.textContent = totalValue.toLocaleString();
        }
    }

    /**
     * 
     */
    // variables
    const portfolioMenu = document.querySelector('.portfolio__menu');
    const portfolio = document.querySelector('.portfolio__wrap');
    // work
    portfolioMenu.addEventListener('click', onPortfolioChange);
    // function
    function onPortfolioChange(e){
        const activeClass = 'portfolio__menu-active';
        const target = e.target;

        if(target.classList.contains('portfolio__menu-item')) {
            this.querySelector('.' + activeClass).classList.remove(activeClass);
            target.classList.add(activeClass);

            portfolio.className = 'portfolio__wrap ' + target.dataset.menu;
        }
    }
});