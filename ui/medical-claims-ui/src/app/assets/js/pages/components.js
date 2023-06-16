/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * Components Js
 */

 

// Tab

try {
  const Default = {
    defaultTabId: null,
    activeClasses: 'text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500',
    inactiveClasses: 'text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300',
    onShow: () => { }
  }
  
  class Tabs {
    constructor(items = [], options = {}) {
        this._items = items
        this._activeTab = options ? this.getTab(options.defaultTabId) : null
        this._options = { ...Default, ...options }
        this._init()
    }
  
    _init() {
        if (this._items.length) {
            // set the first tab as active if not set by explicitly
            if (!this._activeTab) {
                this._setActiveTab(this._items[0])
            }
  
            // force show the first default tab
            this.show(this._activeTab.id, true)
  
            // show tab content based on click
            this._items.map(tab => {
                tab.triggerEl.addEventListener('click', () => {
                    this.show(tab.id)
                })
            })
        }
    }
  
    getActiveTab() {
        return this._activeTab
    }
  
    _setActiveTab(tab) {
        this._activeTab = tab
    }
  
    getTab(id) {
        return this._items.filter(t => t.id === id)[0]
    }
  
    show(id, forceShow = false) {
        const tab = this.getTab(id)
  
        // don't do anything if already active
        if (tab === this._activeTab && !forceShow) {
            return
        }
  
        // hide other tabs
        this._items.map(t => {
            if (t !== tab) {
                t.triggerEl.classList.remove(...this._options.activeClasses.split(" "));
                t.triggerEl.classList.add(...this._options.inactiveClasses.split(" "));
                t.targetEl.classList.add('hidden')
                t.triggerEl.setAttribute('aria-selected', false)
            }
        })
  
        // show active tab
        tab.triggerEl.classList.add(...this._options.activeClasses.split(" "));
        tab.triggerEl.classList.remove(...this._options.inactiveClasses.split(" "));
        tab.triggerEl.setAttribute('aria-selected', true)
        tab.targetEl.classList.remove('hidden')
  
        this._setActiveTab(tab)
  
        // callback function
        this._options.onShow()
    }
  
  }
  
  window.Tabs = Tabs;
  
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-tabs-toggle]').forEach(triggerEl => {
  
        const tabElements = []
        let defaultTabId = null
        triggerEl.querySelectorAll('[role="tab"]').forEach(el => {
            const isActive = el.getAttribute('aria-selected') === 'true'
            const tab = {
                id: el.getAttribute('data-tabs-target'),
                triggerEl: el,
                targetEl: document.querySelector(el.getAttribute('data-tabs-target'))
            }
            tabElements.push(tab)
  
            if (isActive) {
                defaultTabId = tab.id
            }
        })
        new Tabs(tabElements, {
            defaultTabId: defaultTabId
        })
    })
  })
} catch (err) {}


// Accordion
instanceMap = new Map();

class InstanceData {
    static set(componentName, element, instance){
        if(!instanceMap.has(componentName)){
            instanceMap.set(componentName, new Map())
        }

        const elementMap = instanceMap.get(componentName);

        elementMap.set(element, instance);
    }

    static get(componentName, element){
        if(instanceMap.has(componentName)){
            return instanceMap.get(componentName).get(element);
        }
        return null;
    }

    static getAllInstance(componentName){
        if(componentName!==null){
            return instanceMap.get(componentName);
        }
        return null;
    }

}

class EventHandler{

    static trigger(event, componentName, element){
        InstanceData.getAllInstance(componentName).forEach(function (value, key, map){
            value.on(event, element);
        })
    }
}
class Component{


    constructor(componentName, element) {
        this.componentName = componentName;
        this.element = element;
        InstanceData.set(componentName, element, this);
    }


    on(event, element){
        // throw new Error('You have to implement this method!');
    }

    static getInstance(elementName, element){
        return InstanceData.get(elementName, element);
    }


    trigger(event){
        EventHandler.trigger(event, this.componentName, this.element)
    }

    static childOf(child, parent){
        while((child=child.parentNode)&&child!==parent);
        return !!child;
    }

    static getAllInstance(){
        return instanceMap;
    }

    static childOfOrSelf(child, parent){
        if(this.childOf(child,parent)){
            return true;
        }
        return child.isEqualNode(parent);
    }



}

class Collapse extends Component {

    static compName = "collapse";
    static event_key = "collapse.tw";
    static event_show = `show.${this.event_key}`;

    constructor(element) {
        super(Collapse.compName, element);
        this.component_name = "collapse";
        if (element.getAttribute('data-toggle')) {
            this.element = element;
            this.collapse = document.querySelector(`${element.getAttribute('href')}`);
            console.log(this.collapse);
        } else {
            this.collapse = element;
            this.element = document.querySelector(`[href='#${element.id}']`);
        }
        this.init();
    }

    static getInstance(element) {
        if (!element.getAttribute('data-toggle')) {
            element = element.parentElement.querySelector(`[href='#${element.id}']`);
        }
        return Component.getInstance(Collapse.compName, element);
    }

    init() {
        this._show = false;
        let self = this;
        this.activateClickListener();
        this.subscribe((event, element)=>{
            if((event.key==self.event_show) && element!=self.element){

                self.hide();
            }
        })    
    }


    activateClickListener() {
        const self = this;
        this.element.addEventListener('click', function (e) {
            self.toggle();
        });
    }

    toggle() {
        this._show ? this.hide() : this.show();
    }

    show() {
        const self = this;
        self._show = true;
        setTimeout(function () {
            // self.collapse.classList.add('show');
        }, 1000);
        // self.collapse.classList.add('collapsing');
        self.collapse.classList.remove('hidden');
        self.collapse.classList.add('show');
        self.element.setAttribute('aria-expanded', true);
        this.trigger(Collapse.event_show);
    }

    on(event, element) {
        if (this.subscribeFunc) {
            this.subscribeFunc(event, element);
        }
    }

    subscribe(func) {
        this.subscribeFunc = func;
    }

    hide() {
        const self = this;
        self._show = false;
        setTimeout(function () {
            // self.collapse.classList.add('show');
        }, 1000);
        // self.collapse.classList.add('collapsing');
        self.element.setAttribute('aria-expanded', false);
        self.collapse.classList.remove('show');
        self.collapse.classList.add('hidden');
    }
}


document.querySelectorAll(`[data-toggle='collapse']`).forEach(function (element) {
    new Collapse(element);
});


try {
    const Default = {
        defaultTabId: null,
        activeClasses: 'text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500',
        inactiveClasses: 'text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300',
        onShow: () => { }
    }
    
    class Tabs {
        constructor(items = [], options = {}) {
            this._items = items
            this._activeTab = options ? this.getTab(options.defaultTabId) : null
            this._options = { ...Default, ...options }
            this._init()
        }
    
        _init() {
            if (this._items.length) {
                // set the first tab as active if not set by explicitly
                if (!this._activeTab) {
                    this._setActiveTab(this._items[0])
                }
    
                // force show the first default tab
                this.show(this._activeTab.id, true)
    
                // show tab content based on click
                this._items.map(tab => {
                    tab.triggerEl.addEventListener('click', () => {
                        this.show(tab.id)
                    })
                })
            }
        }
    
        getActiveTab() {
            return this._activeTab
        }
    
        _setActiveTab(tab) {
            this._activeTab = tab
        }
    
        getTab(id) {
            return this._items.filter(t => t.id === id)[0]
        }
    
        show(id, forceShow = false) {
            const tab = this.getTab(id)
    
            // don't do anything if already active
            if (tab === this._activeTab && !forceShow) {
                return
            }
    
            // hide other tabs
            this._items.map(t => {
                if (t !== tab) {
                    t.triggerEl.classList.remove(...this._options.activeClasses.split(" "));
                    t.triggerEl.classList.add(...this._options.inactiveClasses.split(" "));
                    t.targetEl.classList.add('hidden')
                    t.triggerEl.setAttribute('aria-selected', false)
                }
            })
    
            // show active tab
            tab.triggerEl.classList.add(...this._options.activeClasses.split(" "));
            tab.triggerEl.classList.remove(...this._options.inactiveClasses.split(" "));
            tab.triggerEl.setAttribute('aria-selected', true)
            tab.targetEl.classList.remove('hidden')
    
            this._setActiveTab(tab)
    
            // callback function
            this._options.onShow()
        }
    
    }
    
    window.Tabs = Tabs;
    
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-tabs-toggle]').forEach(triggerEl => {
    
            const tabElements = []
            let defaultTabId = null
            triggerEl.querySelectorAll('[role="tab"]').forEach(el => {
                const isActive = el.getAttribute('aria-selected') === 'true'
                const tab = {
                    id: el.getAttribute('data-tabs-target'),
                    triggerEl: el,
                    targetEl: document.querySelector(el.getAttribute('data-tabs-target'))
                }
                tabElements.push(tab)
    
                if (isActive) {
                    defaultTabId = tab.id
                }
            })
            new Tabs(tabElements, {
                defaultTabId: defaultTabId
            })
        })
    })
    
} catch (err) {}


try {
    const Default = {
        alwaysOpen: false,
        activeClasses: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
        inactiveClasses: 'text-gray-500 dark:text-gray-400',
        onOpen: () => { },
        onClose: () => { }
    }
    
    class Accordion {
        constructor(items = [], options = {}) {
            this._items = items
            this._options = { ...Default, ...options }
            this._init()
        }
    
        _init() {
            if (this._items.length) {
                // show accordion item based on click
                this._items.map(item => {
    
                    if (item.active) {
                        this.open(item.id)
                    }
    
                    item.triggerEl.addEventListener('click', () => {
                        this.toggle(item.id)
                    })
                })
            }
        }
    
        getItem(id) {
            return this._items.filter(item => item.id === id)[0]
        }
    
        open(id) {
            const item = this.getItem(id)
    
            // don't hide other accordions if always open
            if (!this._options.alwaysOpen) {
                this._items.map(i => {
                    if (i !== item) {
                        i.triggerEl.classList.remove(...this._options.activeClasses.split(" "))
                        i.triggerEl.classList.add(...this._options.inactiveClasses.split(" "))
                        i.targetEl.classList.add('hidden')
                        i.triggerEl.setAttribute('aria-expanded', false)
                        i.active = false
    
                        // rotate icon if set
                        if (i.iconEl) {
                            i.iconEl.classList.remove('rotate-180')
                        }
                    }
                })
            }
    
            // show active item
            item.triggerEl.classList.add(...this._options.activeClasses.split(" "))
            item.triggerEl.classList.remove(...this._options.inactiveClasses.split(" "))
            item.triggerEl.setAttribute('aria-expanded', true)
            item.targetEl.classList.remove('hidden')
            item.active = true
    
            // rotate icon if set
            if (item.iconEl) {
                item.iconEl.classList.add('rotate-180')
            }
    
            // callback function
            this._options.onOpen(item)
        }
    
        toggle(id) {
            const item = this.getItem(id)
    
            if (item.active) {
                this.close(id)
            } else {
                this.open(id)
            }
    
            // callback function
            // this._options.onToggle(item)
        }
    
        close(id) {
            const item = this.getItem(id)
    
            item.triggerEl.classList.remove(...this._options.activeClasses.split(" "))
            item.triggerEl.classList.add(...this._options.inactiveClasses.split(" "))
            item.targetEl.classList.add('hidden')
            item.triggerEl.setAttribute('aria-expanded', false)
            item.active = false
    
            // rotate icon if set
            if (item.iconEl) {
                item.iconEl.classList.remove('rotate-180')
            }
    
            // callback function
            this._options.onClose(item)
        }
    
    }
    
    window.Accordion = Accordion;
    
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-accordion]').forEach(accordionEl => {
    
            const alwaysOpen = accordionEl.getAttribute('data-accordion')
            const activeClasses = accordionEl.getAttribute('data-active-classes')
            const inactiveClasses = accordionEl.getAttribute('data-inactive-classes')
    
            const items = []
            accordionEl.querySelectorAll('[data-accordion-target]').forEach(el => {
                const item = {
                    id: el.getAttribute('data-accordion-target'),
                    triggerEl: el,
                    targetEl: document.querySelector(el.getAttribute('data-accordion-target')),
                    iconEl: el.querySelector('[data-accordion-icon]'),
                    active: el.getAttribute('aria-expanded') === 'true' ? true : false
                }
                items.push(item)
            })
    
            new Accordion(items, {
                alwaysOpen: alwaysOpen === 'open' ? true : false,
                activeClasses: activeClasses ? activeClasses : Default.activeClasses,
                inactiveClasses: inactiveClasses ? inactiveClasses : Default.inactiveClasses
            })
        })
    })
    
} catch (err) {}

class Modal extends Component {

    event_key = "modal.tw";
    event_show = `show.${(this.event_key)}`;
  
    constructor(element) {
        super("modal", element);
        this.element = element;
  
        this.modal = document.getElementById(element.getAttribute('href').split('#')[1]);
        this.modalDialog = this.modal?.querySelector('.modal-dialog');
        this.init();
    }
  
    init() {
        this._show = false;
        this.activateClickListener();
        this.activateListener();
        this.isStatic = this.modal.getAttribute('data-backdrop') === "static";
    }
  
    toggle() {
        if (this._show) this.hide(); else this.show();
    }
  
    show() {
        if (!this.modal) return;
        const self = this;
        document.body.classList.add('modal-enabled');
        setTimeout(function () {
            self.modal.classList.add('block');
            self._show = true;
        }, 150);
  
    }
  
    hide() {
        const self = this;
        self._show = false;
        setTimeout(function () {
            self.modal.classList.remove('block');
        }, 150);
        setTimeout(function () {
            document.body.classList.remove('modal-enabled');
        }, 150);
  
    }
  
  
    activateClickListener() {
        const self = this;
  
        //Show Listener
        this.element.addEventListener('click', function () {
            self.show();
        });
  
        //Close Listener
        this.modal.querySelectorAll('.btn-close, .close').forEach(function (closeBtn) {
            closeBtn.addEventListener('click', function () {
                self.hide();
            });
        });
    }
  
    activateListener() {
        // Close the Modal if the user clicks outside it
        const self = this;
        window.addEventListener('click', function (event) {
  
            if (self._show && !self.isStatic && event.target.matches(".modal")) {
                self.hide();
            }
        })
  
    }
  
  }
  
  document.querySelectorAll('[data-modal-toggle="modal"]').forEach(function (element) {
    new Modal(element);
  });