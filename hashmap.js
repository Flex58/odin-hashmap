const node = (key = null, value = null, next = null) => {
    return {
        key: key,
        value: value,
        next: next,
    }
}


const linkedList = (key = null, value = null) => {
    return {
        head: node(key, value),
        
        tail() {
            let index = this.head.next
            while (index.next != null) {
                index = index.next  
            }
            return index 
        },

        append(key, value) {
            let newNode = node(key, value);
            if (this.head.next == null) {
               return this.head.next = newNode;
            }
            let index = this.tail()
            return index.next = newNode;
        },

        prepend(key, value){
            let newNode = node(key, value)
            newNode.next = this.head;
            this.head = newNode;
        },

        size() {
            let index = this.head
            let size = 1;
            while (index.next != null) {
                index = index.next
                size++  
            }
            return size;
        },

        at(n) {
            let index = this.head
            for(let i = 0; i < n; i++) {
                if (index.next == null) {
                    return new Error("Out of Range")
                }
                index = index.next
            }
            return index;
        },

        pop() {
            let last = this.tail()
            let index = this.head
            while (index.next.value != last.value){
                index = index.next
            }
            index.next = null;
        },

        contains(value) {
            if (this.head.value == value) return true;
            let index = this.head
            while (index.next != null) {
                index = index.next
                if (index.value == value) {
                    return true;
                }
            }
            return false;
        },

        containsKey(key) {
            if (this.head.key == key) return true;
            let index = this.head
            while (index.next != null) {
                index = index.next
                if (index.key == key) {
                    return true;
                }
            }
            return false;
        },

        find(value) {
            let index = this.head
            let counter = 0;

            if (index.value == value) {
                return counter
            }
            while (index.next != null) {
                index = index.next
                counter ++
                if (index.value == value) {
                    return counter
                }
            }
            return null
        },

        findKey(key) {
            let index = this.head
            let counter = 0;

            if (index.key == key) {
                return counter
            }
            while (index.next != null) {
                index = index.next
                counter ++
                if (index.key == key) {
                    return counter
                }
            }
            return null
        },
        
        toString() {
            let string = this.head.value 
            let index = this.head
            while (index.next != null) {
                index = index.next
                string += " -> "
                string += index.value
            }
            string += " -> "
            string += index.next
            console.log(string)
        },

        inserAt(value, i) {
            let index = this.head
            let goal = this.at(i)
            while (index.next != goal){
                index = index.next
            }
            index.next = node(value);
            index.next.next = goal;
        },

        removeAt(i) {
            let index = this.head
            let goal = this.at(i)
            while (index.next != goal){
                index = index.next
            }
            index.next = index.next.next
        }
    }
}



const hashMap = (capacity) => {
    return {
        loadFactor: 0.75,
        buckets: Array.from({length: capacity}), 

        hash(key){
            let hashCode = 0;
      
            const primeNumber = 31;
            for (let i = 0; i < key.length; i++) {
                hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % capacity;
            }

            return hashCode;
        },

        set(key, value) {
            let index = this.hash(key)
            //console.log(key + " " + value)
            this.isOutOfBounds(index)

            if (this.buckets[index]){
                if (this.buckets[index].containsKey(key)) {
                    let i = this.buckets[index].findKey(key)
                    this.buckets[index].at(i).value = value
                } else {
                    if (capacity * this.loadFactor <= this.length()) {
                       this.rehash()
                    }
                    this.buckets[index].append(key, value)
                }
            } else {
                if (capacity * this.loadFactor <= this.length()) {
                    this.rehash()
                }
                this.buckets[index] = linkedList(key, value)
            }
        },

        get(key) {
            let index = this.hash(key)

            this.isOutOfBounds(index)

            if (this.buckets[index]) {
                if (this.buckets[index].containsKey(key)) {
                    return this.buckets[index].at(this.buckets[index].findKey(key)).value
                }
            } 
            return null
        },

        has(key){

            let index = this.hash(key)

            this.isOutOfBounds(index)

            if (this.buckets[index]) {
                if (this.buckets[index].containsKey(key)) {
                    return true
                } 
            } 
            return false;
        },

        remove(key) {
            let index = this.hash(key)

            this.isOutOfBounds(index)

            if (this.buckets[index]) {
                if (this.buckets[index].containsKey(key)) {
                    this.buckets[index].removeAt(this.buckets[index].findKey(key))
                    return true
                } 
            } 
            return false;
        },
        length() {
            let counter = 0;

            this.forEach(() => {
                counter++
            })
            return counter;
        },

        keys() {
            let arr = []
            this.forEach((i, j) => {
                arr.push(this.buckets[i].at(j).key)
            })

            return arr;
        },

        values() {
            let arr = [] 
            this.forEach((i,j) => {
                arr.push(this.buckets[i].at(j).value)
            })
            return arr;
        },

        entries() {
            let arr = []
            this.forEach((i,j) => {
                let pair = []
                pair.push(this.buckets[i].at(j).key)
                pair.push(this.buckets[i].at(j).value)
                arr.push(pair)
            })
            return arr;
        },

        isOutOfBounds(index) {
            if (index < 0 || index >= this.buckets.length) {
                throw new Error("Trying to access index out of bounds " + index + " " + this.buckets.length + " " + capacity)
            }
        },

        forEach(callback) {
            for (let i = 0; i < capacity; i++){
                    if (this.buckets[i]) {
                        let size = this.buckets[i].size()
                        for (let j = 0; j < size; j++) {
                            callback(i,j);
                        }
                    }
                }
        },

        rehash() {
            let temp = this.buckets

            capacity *= 2;
            this.buckets = Array.from({length: capacity}) 

            for (let i = 0; i < capacity; i++){
                if (temp[i]) {
                    let size = temp[i].size()
                    for (let j = 0; j < size; j++) {
                        this.set(temp[i].at(j).key, temp[i].at(j).value)
                    }
                }
            }
        }
    }
}

let test = hashMap(16)

test.set('apple', 'red')
test.set('banana', 'yellow')
test.set('carrot', 'orange')
test.set('dog', 'brown')
test.set('elephant', 'gray')
test.set('frog', 'green')
test.set('grape', 'purple')
test.set('hat', 'black')
test.set('ice cream', 'white')
test.set('jacket', 'blue')
test.set('kite', 'pink')
test.set('lion', 'golden')
test.set("apple", "green")
test.set("tea", "black")
test.set("apple", "yellow")
test.set("kite", "yellow")
console.log(test.entries())






    