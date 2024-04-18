const MS_IN_DAY = 86400000;

class TTRPGTime {
    _ms = 0;
    s = 0;
    m = 0;
    h = 0;
    timescale = 1;
    format = 24;
    interval = undefined;
    last = Date.now();

    set ms(ms) {
        this._ms = ms;
        this.s = Math.floor( ms / 1000 ) % 60;
        this.m = Math.floor( ms / 1000 / 60 ) % 60;
        this.h = Math.floor( ms / 1000 / 60 / 60 ) % 24;
    }

    get ms() {
        return this._ms;
    }

    tick() {
        if(this.timescale > 0) {
            this.interval ??= setInterval(()=>this.tick(), 10);
            this.ms += (Date.now() - this.last) * this.timescale;
            this.last = Date.now();
        }
        else this.stop();
    }

    start() {
        this.last = Date.now();
        this.tick();
    }

    stop() {
        this.interval = clearInterval(this.interval);
    }

    reset() {
        this.stop();
        this.ms = 0;
    }

    setTimescale(timescale) {
        this.timescale = timescale;
    }

    addTime(h=0, m=0, s=0, ms = 0) {
        this.ms += 1000*60*60*h + 1000*60*m + 1000*s + ms;
    }

    shortRest() {
        this.addTime(1);
    }

    longRest() {
        this.addTime(8);
    }

    combatRound() {
        this.addTime(0, 0, 6);
    }

    dungeonRound() {
        this.addTime(0, 10);
    }

    setFormat(format) {
        this.format = format;
    }
    
    toString() {
        let h = this.h;
        let m = this.m;
        let ampm = '';
        m = m < 10 ? '0'+m : m;
        if(this.format == 12) {
            ampm = h < 12 ? " AM" : " PM";
            h = h % 12;
            h = h ? h : 12;
        }
        h = h < 10 ? '0'+h : h;
        let s = this.s%60;
        s = s < 10 ? '0'+s : s;
        return `${h}:${m}:${s}${ampm}`;
    }

    backgroundColors() {
        let l = (1-(Math.abs(this.ms%MS_IN_DAY-MS_IN_DAY/2)/(MS_IN_DAY/2)));

        let r = (1-(Math.abs(this.ms%(MS_IN_DAY/2)-MS_IN_DAY/4)/(MS_IN_DAY/4)));
        r = r**2;
        let b = (1-r)-(1-l)*0.75;
        let g = r/2 + b/2;

        let top = `hsl(0, 0%, ${l*100}%)`;
        let bottom = `rgb(${r*255}, ${g*255}, ${b*255})`;

        return [bottom, top];
    }
}