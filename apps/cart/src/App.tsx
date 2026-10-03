import './App.css';
import CartButton from './CartButton';
import CartPage from './pages/CartPage';

function App() {
  return (
    <>
      <CartPage />
      <CartButton sku="123" />
    </>
  );
}

export default App;
