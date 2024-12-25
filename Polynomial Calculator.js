class PolynomialCalculator {
    div(a, b) {
        if (b.members.length === 0 || (b.members.length === 1 && b.members[0].value === 0)) {
            throw new Error("Division by zero polynomial is not allowed");
        }

        let dividend = a;
        const divisor = b;
        const quotientMembers = [];

        while (dividend.members.length > 0 && dividend.members[0].power >= divisor.members[0].power) {
            const leadDividend = dividend.members[0];
            const leadDivisor = divisor.members[0];
            const leadQuotientValue = leadDividend.value / leadDivisor.value;
            const leadQuotientPower = leadDividend.power - leadDivisor.power;
            const leadQuotient = new Member(leadQuotientValue, leadQuotientPower);

            quotientMembers.push(leadQuotient);

            const leadQuotientPolynomial = new Polynomial([leadQuotient]);
            const product = this.mult(leadQuotientPolynomial, divisor);
            dividend = this.sub(dividend, product);
        }

        return new Polynomial(quotientMembers);
    }

    add(a, b) {
        const polyA = (a instanceof Polynomial) ? a : new Polynomial([new Member(a, 0)]);
        const polyB = (b instanceof Polynomial) ? b : new Polynomial([new Member(b, 0)]);
        const members = new Map();
        const addMember = (member) => {
            const currentValue = members.get(member.power) || 0;
            const newValue = currentValue + member.value;
            if (newValue !== 0) {
                members.set(member.power, newValue);
            } else {
                members.delete(member.power); 
            }
        };
        polyA.members.forEach(addMember);
        polyB.members.forEach(addMember);
        const resultMembers = Array.from(members.entries())
            .sort((a, b) => b[0] - a[0]) 
            .map(([power, value]) => new Member(value, power));
        if (resultMembers.length === 0) {
            return new Polynomial([new Member(0, 0)]);
        }
        return new Polynomial(resultMembers);
    }
    sub(a, b) {
        const members = [];
        a.members.forEach(elemA => {
            const member = b.members.find(elemB => elemB.power === elemA.power);
            if (member) {
                members.push(new Member(elemA.value - member.value, elemA.power));
            } else {
                members.push(new Member(elemA.value, elemA.power));
            }
        });
        b.members.forEach(elemB => {
            if (!members.find(elem => elem.power === elemB.power)) {
                members.push(new Member(-elemB.value, elemB.power));
            }
        });
        return new Polynomial(members.filter(member => member.value !== 0));
    }

    mult(a, b) {
        const members = new Map();
    
        a.members.forEach(elemA => {
            b.members.forEach(elemB => {
                const power = elemA.power + elemB.power;
                const value = elemA.value * elemB.value;
                if (members.has(power)) {
                    members.set(power, members.get(power) + value);
                } else {
                    members.set(power, value);
                }
            });
        });
    
        const resultMembers = [];
        members.forEach((value, power) => {
            if (value !== 0) {
                resultMembers.push(new Member(value, power));
            }
        });
    
        return new Polynomial(resultMembers);
    }

    zero() {
        return new Polynomial([new Member(0, 0)]);
    }

    one() {
        return new Polynomial([new Member(1, 0)]);
    }

    prod(a, p) {
        const calc = new Calculator();
        const members = [];
        a.members.forEach(elemA => {
            members.push(new Member(calc.mult(elemA.value, p), elemA.power));
        });
        return new Polynomial(members);
    }

    pow(a, n) {
        if (n < 0) throw new Error("Negative exponents not supported");
        if (n === 0) return this.one();
        if (n === 1) return a;
        
        let result = a;
        for (let i = 1; i < n; i++) {
            result = this.mult(result, a);
        }
        return result;
    }

    getPolynomial(str){
        const arr = str.split('-');
        if(arr.lehgth > 1){
            arr.forEach((elem, index) => {
                if(index === 0){
                    if(elem === ''){
                        arr[index + 1] = `-${arr[index+1]}`;
                    } else return;
                }
                if(index === 1){
                    if(arr[index - 1]){
                        arr[index] = `-${arr[index]}`;
                        return;
                    } else return;
                }
                arr[index] = `${arr[index]}`;
            });
        }
        const newArr = arr.filter(elem => elem !== '').reduce((
            S, elem) => {
                const arr = elem.split('+');
                arr.forEach(el => S.push(el));
                return S;
            }, []);
            return new Polynomial(newArr.map(elem => 
                this.getMember(elem)));
    }

    getMember(str) {
        const match = str.match(/(-?\d*)x(?:\^(\d+))?/);
        if (!match) {
            return new Member(parseFloat(str), 0);
        }
        const value = parseFloat(match[1]) || (match[1] === '-' ? -1 : 1);
        const power = parseInt(match[2]) || (match[0].includes('x') ? 1 : 0);
        return new Member(value, power);
    }
}