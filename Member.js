class Member {
    constructor(value = 0, power = 0) {
        this.value = parseFloat(value) || 0;
        this.power = parseInt(power) || 0;
    }

    toString() {
        if (this.value === 0) return '0';
        let result = '';
        if (this.value === 1 && this.power > 0) {
        } else if (this.value === -1 && this.power > 0) {
            result = '-';
        } else {
            result = this.value.toString();
        }
        if (this.power === 1) {
            result += 'x';
        } else if (this.power > 1) {
            result += `x^${this.power}`;
        }
        return result;
    }
}