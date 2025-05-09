class ThemeSwitcher {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle')
        this.currentTheme = localStorage.getItem('theme') || 'light'

        this.initTheme()
        this.initEventListners()
    }

    initTheme() {
        if (
            this.currentTheme === dark || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)    
        ){
            document.documentElement.setAttribute('data-theme', 'dark')
            this.currentTheme === 'dark'
        } else {
            document.documentElement.removeAttribute('data-theme')
            this.currentTheme === 'light'
        }

        localStorage.setItem('theme', this.currentTheme)
    }
}
    