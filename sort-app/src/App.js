import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [sortedArray, setSortedArray] = useState([]);
  const [inputIdentif, setIdentifValue] = useState('');
  const [sortedOutArray, setSortedOutArray ] = useState([]);
  const bubbleSort = (arr) => {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
            
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
  };


  const inSortedArray = async (arr) => {
    const a = arr.split(',').map(Number); 
     if (a.some(isNaN)) {
        alert('Ошибка: введите только числа, разделенные запятыми.');
        return; 
    }
    const sorted = bubbleSort(a);
    setSortedArray(sorted);
    try {
      const response = await fetch('http://localhost:5000/save-sorted', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ numbers: sorted }),
        });
        if (!response.ok) {
        }
      } catch (error) {
      console.error(error);
    }
  }

  const outSortedArray = async () => {
    try {
        const response = await fetch(`http://localhost:5000/get-sorted/${inputIdentif}`);
        const data = await response.json();
        setSortedOutArray(data);
    } catch (error) {
        alert("Данные введены неверно");
    }
};

  return(  
      <div>
        <h1>Пузырковая сортировка</h1>
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Введите числа через запятую"
        />
        <button onClick={() => inSortedArray(inputValue)}>Сортировать</button>
        <h2>Результат сортировки:</h2>
        <p>{sortedArray.join(', ')}</p>
        <h1>идентификатор сортировки:</h1>
        <input
            type="text"
            value={inputIdentif}
            onChange={(e) => setIdentifValue(e.target.value)}
            placeholder="Введите идентификатор массива"
        />
          <button onClick={outSortedArray}>Получить массив из БД</button>
        <h2>Массив из БД:</h2>
        <p>{sortedOutArray.join(', ')}</p>
    </div>
  );
}

export default App;
