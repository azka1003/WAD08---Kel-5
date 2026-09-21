const btnMulaiGratis =document.querySelector('#cta-btn');
const txtUnderBtn = document.querySelector('#p-btn')

let counter = 0;

btnMulaiGratis.addEventListener('click',() =>{
  counter++;
  //TODO Action
  //kalau mau di rubah jadi dari 0 tanpa rubah kode dan nambah -1

  if (counter === 1 ){
    console.log('clicked');
    txtUnderBtn.textContent = 'Hello World!'
  }else if (counter === 2){
    console.log ('change text color');
    txtUnderBtn.classList.add('text-red-500')
  }else if (counter === 3){
    console.log ('off');
    btnMulaiGratis.classList.add('hidden');
    txtUnderBtn.classList.add('hidden');
  }
});