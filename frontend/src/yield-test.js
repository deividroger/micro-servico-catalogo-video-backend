function* test(){
    yield "react";
    console.log('Deivid Roger');
    yield "saga";
}

const iterator = test();


console.log(iterator.next());
console.log(iterator.next());