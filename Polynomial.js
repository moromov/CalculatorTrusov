class Polynomial {
    constructor(members = []) {
        this.members = members;
        this.members.sort((a, b) => b.power - a.power);
    }

    toString() {
        if (this.members.length === 0) {
            return '0';
        }
        return this.members
            .map((member, index) => {
                const sign = member.value >= 0 ? (index === 0 ? '' : ' + ') : ' - ';
                const value = Math.abs(member.value);
                if (member.power === 0) {
                    return `${sign}${value}`;
                }
                if (member.power === 1) {
                    return value === 1 ? `${sign}x` : `${sign}${value}x`;
                }
                return value === 1 ? `${sign}x^${member.power}` : `${sign}${value}x^${member.power}`;
            })
            .join('')
            .trim();

    }

    getValue(x) {
        const calc = new Calculator();
        
        let result = calc.zero(x);

        if (x instanceof Matrix) {
            const result = [];
            for (let i = 0; i < x.values.length; i++){
                const elemMatrix = [];
                for (let j = 0; j < x.values[i].length; j++){
                    elemMatrix.push(this.getValue(x.values[i][j]));
                }
                result.push(elemMatrix);
            }
            return new Matrix(result);
        }


        if (x instanceof Complex) {
            const sortMembers = [...this.members].sort((a, b) => b.power - a.power);
            let result = new Complex(0,0);

            for (let i = 0; i < sortMembers.length; i++){
                const power = calc.pow(x, sortMembers[i].power);
                const term = calc.prod(power, sortMembers[i].value);
                result = calc.add(result, term);
            }
            return result;
        }

        const sortMembers = [...this.members].sort((a, b) => b.power - a.power);

        for (let i = 0; i < sortMembers.length; i++) {
            const power = calc.pow(x, sortMembers[i].power);
            const term = calc.prod(sortMembers[i].value, power);
            result = calc.add(result, term);
        }
        


        return result;
    }
}